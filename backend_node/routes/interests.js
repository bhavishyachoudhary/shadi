/** Bandhan Matrimony — Interest routes mounted at /api/v1/interests. */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { requireAuth } = require('../middleware/authMiddleware');
const { User, Interest } = require('../models');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const router = express.Router();
const ALLOWED_BOXES = new Set(['received', 'sent']);
const ALLOWED_STATUSES = new Set(['sent', 'accepted', 'declined']);

const interestDto = interest => ({
  id: String(interest.id),
  senderId: String(interest.senderId),
  receiverId: String(interest.receiverId),
  status: interest.status,
  message: interest.message,
  createdAt: interest.createdAt,
  updatedAt: interest.updatedAt,
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const senderId = String(req.user.userId);
    const receiverId = req.body?.receiverId ? String(req.body.receiverId) : '';
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : null;

    if (!receiverId) return sendError(res, 400, 'RECEIVER_REQUIRED', 'receiverId is required.');
    if (receiverId === senderId) return sendError(res, 400, 'SELF_INTEREST_NOT_ALLOWED', 'You cannot send interest to yourself.');
    if (message && message.length > 1000) return sendError(res, 400, 'MESSAGE_TOO_LONG', 'Interest message must be 1000 characters or fewer.');

    const receiver = await User.findOne({
      where: { id: receiverId, isActive: true, isApproved: true, profileComplete: true },
    });
    if (!receiver) return sendError(res, 404, 'PROFILE_NOT_FOUND', 'Recipient profile not found or unavailable.');
    if (receiver.gender === req.user.gender) {
      return sendError(res, 403, 'RECIPIENT_NOT_ELIGIBLE', 'This recipient is not eligible for your current feed.');
    }

    const existing = await Interest.findOne({ where: { senderId, receiverId } });
    if (existing) {
      return sendError(res, 409, 'INTEREST_ALREADY_EXISTS', 'An interest request already exists for this profile.', {
        interest: interestDto(existing),
      });
    }

    const interest = await Interest.create({
      id: uuidv4(), senderId, receiverId, message: message || null, status: 'sent',
    });
    return sendSuccess(res, interestDto(interest), { status: 201, message: 'Interest sent.' });
  } catch (error) {
    console.error('Send interest error:', error);
    return sendError(res, 500, 'INTEREST_SEND_FAILED', 'Failed to send interest.');
  }
});

const respondToInterest = desiredStatus => async (req, res) => {
  try {
    const interest = await Interest.findByPk(req.params.id);
    if (!interest) return sendError(res, 404, 'INTEREST_NOT_FOUND', 'Interest request not found.');
    if (String(interest.receiverId) !== String(req.user.userId)) {
      return sendError(res, 403, 'INTEREST_RESPONSE_FORBIDDEN', 'Only the recipient can accept or decline this interest.');
    }

    if (interest.status === desiredStatus) {
      return sendSuccess(res, interestDto(interest), { message: `Interest already ${desiredStatus}.` });
    }
    if (interest.status !== 'sent') {
      return sendError(res, 409, 'INTEREST_ALREADY_RESOLVED', `This interest has already been ${interest.status}.`);
    }

    await interest.update({ status: desiredStatus });
    return sendSuccess(res, interestDto(interest), { message: `Interest ${desiredStatus}.` });
  } catch (error) {
    console.error(`Interest ${desiredStatus} error:`, error);
    return sendError(res, 500, 'INTEREST_RESPONSE_FAILED', 'Failed to update interest.');
  }
};

router.post('/:id/accept', requireAuth, respondToInterest('accepted'));
router.post('/:id/decline', requireAuth, respondToInterest('declined'));

// Temporary compatibility with the original PUT /interests/:id contract.
router.put('/:id', requireAuth, async (req, res, next) => {
  const status = req.body?.status;
  if (!['accepted', 'declined'].includes(status)) {
    return sendError(res, 400, 'INVALID_INTEREST_STATUS', 'Status must be accepted or declined.');
  }
  return respondToInterest(status)(req, res, next);
});

const listInterests = async (req, res, forcedBox) => {
  try {
    const box = forcedBox || req.query.box || 'received';
    if (!ALLOWED_BOXES.has(box)) {
      return sendError(res, 400, 'INVALID_INTEREST_BOX', 'box must be received or sent.');
    }

    const where = box === 'received'
      ? { receiverId: req.user.userId }
      : { senderId: req.user.userId };
    if (req.query.status) {
      if (!ALLOWED_STATUSES.has(req.query.status)) {
        return sendError(res, 400, 'INVALID_INTEREST_STATUS', 'Unsupported interest status.');
      }
      where.status = req.query.status;
    }

    const interests = await Interest.findAll({ where, order: [['createdAt', 'DESC']], limit: 100 });
    return sendSuccess(res, interests.map(interestDto), { meta: { box, total: interests.length } });
  } catch (error) {
    console.error('List interests error:', error);
    return sendError(res, 500, 'INTEREST_LIST_FAILED', 'Failed to get interests.');
  }
};

router.get('/', requireAuth, (req, res) => listInterests(req, res));
router.get('/received', requireAuth, (req, res) => listInterests(req, res, 'received'));
router.get('/sent', requireAuth, (req, res) => listInterests(req, res, 'sent'));

module.exports = router;
