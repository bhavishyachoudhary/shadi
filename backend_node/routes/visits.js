/** Bandhan Matrimony — Profile visit routes mounted at /api/v1/visits. */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { requireAuth } = require('../middleware/authMiddleware');
const { User, Profile, ProfileVisit } = require('../models');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const router = express.Router();

const visitDto = visit => ({
  id: String(visit.id),
  visitorId: String(visit.visitorId),
  profileId: String(visit.profileId),
  visitDate: visit.visitDate,
  visitCount: visit.visitCount,
  firstVisitTime: visit.firstVisitTime,
  lastVisitTime: visit.lastVisitTime,
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const profileId = req.body?.profileId ? String(req.body.profileId) : '';
    const visitorId = String(req.user.userId);
    if (!profileId) return sendError(res, 400, 'PROFILE_ID_REQUIRED', 'profileId is required.');
    if (profileId === visitorId) return sendError(res, 400, 'SELF_VISIT_NOT_ALLOWED', 'You cannot record a visit to your own profile.');

    const targetProfile = await Profile.findOne({
      where: { userId: profileId },
      include: [{
        model: User,
        as: 'user',
        required: true,
        where: { isActive: true, isApproved: true, profileComplete: true },
        attributes: ['id'],
      }],
    });
    if (!targetProfile) return sendError(res, 404, 'PROFILE_NOT_FOUND', 'Profile not found or unavailable.');

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const [visit, created] = await ProfileVisit.findOrCreate({
      where: { visitorId, profileId, visitDate: today },
      defaults: {
        id: uuidv4(), visitorId, profileId, visitDate: today,
        visitCount: 1, firstVisitTime: now, lastVisitTime: now,
      },
    });

    if (!created) {
      await visit.update({ visitCount: visit.visitCount + 1, lastVisitTime: now });
    }

    return sendSuccess(res, visitDto(visit), {
      status: created ? 201 : 200,
      message: 'Profile visit recorded.',
    });
  } catch (error) {
    console.error('Record visit error:', error);
    return sendError(res, 500, 'VISIT_RECORD_FAILED', 'Failed to record visit.');
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const visits = await ProfileVisit.findAll({
      where: { profileId: req.user.userId },
      order: [['lastVisitTime', 'DESC']],
      limit: 50,
    });
    return sendSuccess(res, visits.map(visitDto));
  } catch (error) {
    console.error('Get visits error:', error);
    return sendError(res, 500, 'VISIT_LIST_FAILED', 'Failed to get profile visitors.');
  }
});

module.exports = router;
