/**
 * Bandhan Matrimony — Profile routes
 * Mounted at /api/v1/profiles (and /api/profiles as a temporary legacy alias).
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const { requireAuth } = require('../middleware/authMiddleware');
const { User, Profile } = require('../models');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const router = express.Router();
const uploadDirectory = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
const allowedImageTypes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (req, file, callback) => {
    const extension = allowedImageTypes[file.mimetype] || '.img';
    callback(null, `profile_${req.user.userId}_${Date.now()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: Number.parseInt(process.env.MAX_FILE_SIZE || '5242880', 10) },
  fileFilter: (_req, file, callback) => {
    if (allowedImageTypes[file.mimetype]) return callback(null, true);
    return callback(new Error('Only JPEG, PNG, and WEBP images are allowed.'));
  },
});

const positiveInteger = (value, fallback, maximum = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
};

const calculateAge = dob => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) age -= 1;
  return age;
};

const verificationDto = profile => ({
  email: Boolean(profile.user?.isEmailVerified),
  mobile: Boolean(profile.user?.isMobileVerified),
  profile: Boolean(profile.isVerified),
});

const profileSummaryDto = profile => ({
  id: String(profile.userId),
  name: profile.fullName,
  gender: profile.user?.gender,
  age: calculateAge(profile.dob),
  heightCm: profile.heightCm,
  religion: profile.religion,
  caste: profile.caste,
  motherTongue: profile.motherTongue,
  education: profile.education,
  occupation: profile.occupation,
  annualIncome: profile.annualIncome,
  city: profile.city,
  state: profile.state,
  country: profile.country,
  diet: profile.diet,
  manglik: profile.manglik,
  matchScore: profile.matchScore,
  isNri: profile.isNri,
  photoUrl: profile.photoUrl,
  verification: verificationDto(profile),
});

const profileDetailDto = profile => ({
  ...profileSummaryDto(profile),
  dob: profile.dob,
  photos: profile.photos || [],
  aboutMe: profile.aboutMe,
  rashi: profile.rashi,
  nakshatra: profile.nakshatra,
  gotra: profile.gotra,
  lifestyleVideoUrl: profile.lifestyleVideoUrl,
  familyDetails: profile.familyDetails,
});

const selfProfileDto = profile => ({
  ...profileDetailDto(profile),
  privateLocation: {
    lat: profile.lat,
    lng: profile.lng,
  },
});

const eligibleUserWhere = req => ({
  id: { [Op.ne]: req.user.userId },
  gender: req.user.gender === 'Groom' ? 'Bride' : 'Groom',
  isActive: true,
  isApproved: true,
  profileComplete: true,
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const page = positiveInteger(req.query.page, 1);
    const limit = positiveInteger(req.query.limit, 20, 100);
    const where = {};

    if (req.query.religion && req.query.religion !== 'All') where.religion = req.query.religion;
    if (req.query.motherTongue && req.query.motherTongue !== 'All') where.motherTongue = req.query.motherTongue;
    if (req.query.city && req.query.city !== 'All') where.city = req.query.city;
    if (req.query.manglik && req.query.manglik !== 'All') where.manglik = req.query.manglik;
    if (req.query.diet && req.query.diet !== 'All') where.diet = req.query.diet;
    if (req.query.verifiedOnly === 'true') where.isVerified = true;
    if (req.query.isNri === 'true') where.isNri = true;
    if (req.query.isNri === 'false') where.isNri = false;

    const dobRange = {};
    let hasDobRange = false;
    const maxAge = positiveInteger(req.query.maxAge, null, 100);
    const minAge = positiveInteger(req.query.minAge, null, 100);
    if (maxAge) {
      const earliestBirthDate = new Date();
      earliestBirthDate.setFullYear(earliestBirthDate.getFullYear() - maxAge - 1);
      dobRange[Op.gt] = earliestBirthDate;
      hasDobRange = true;
    }
    if (minAge) {
      const latestBirthDate = new Date();
      latestBirthDate.setFullYear(latestBirthDate.getFullYear() - minAge);
      dobRange[Op.lte] = latestBirthDate;
      hasDobRange = true;
    }
    if (hasDobRange) where.dob = dobRange;

    const { count, rows } = await Profile.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        required: true,
        where: eligibleUserWhere(req),
        attributes: ['id', 'gender', 'isEmailVerified', 'isMobileVerified'],
      }],
      limit,
      offset: (page - 1) * limit,
      order: [['matchScore', 'DESC'], ['createdAt', 'DESC']],
      distinct: true,
    });

    return sendSuccess(res, rows.map(profileSummaryDto), {
      meta: {
        total: count,
        page,
        pageSize: limit,
        pages: Math.ceil(count / limit),
        feedGender: req.user.gender === 'Groom' ? 'Bride' : 'Groom',
      },
    });
  } catch (error) {
    console.error('Get profiles error:', error);
    return sendError(res, 500, 'PROFILE_LIST_FAILED', 'Failed to get profiles.');
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'gender', 'isEmailVerified', 'isMobileVerified'],
      }],
    });
    if (!profile) return sendError(res, 404, 'PROFILE_NOT_FOUND', 'Profile not found.');
    return sendSuccess(res, selfProfileDto(profile));
  } catch (error) {
    console.error('Get own profile error:', error);
    return sendError(res, 500, 'PROFILE_READ_FAILED', 'Failed to get your profile.');
  }
});

router.put('/me', requireAuth, async (req, res) => {
  try {
    const allowedFields = [
      'fullName', 'dob', 'heightCm', 'religion', 'caste', 'motherTongue',
      'education', 'occupation', 'annualIncome', 'city', 'state', 'country',
      'isNri', 'aboutMe', 'rashi', 'nakshatra', 'gotra', 'manglik', 'diet',
      'lat', 'lng', 'familyDetails',
    ];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const profile = await Profile.findOne({ where: { userId: req.user.userId } });
    if (!profile) return sendError(res, 404, 'PROFILE_NOT_FOUND', 'Profile not found.');
    await profile.update(updates);

    const requiredFields = ['fullName', 'dob', 'heightCm', 'religion', 'education', 'occupation', 'city', 'aboutMe'];
    const profileComplete = requiredFields.every(field => Boolean(profile[field]));
    if (profileComplete) {
      await User.update({ profileComplete: true }, { where: { id: req.user.userId } });
    }

    const updatedProfile = await Profile.findOne({
      where: { userId: req.user.userId },
      include: [{ model: User, as: 'user', attributes: ['id', 'gender', 'isEmailVerified', 'isMobileVerified'] }],
    });
    return sendSuccess(res, selfProfileDto(updatedProfile), { message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Update profile error:', error);
    return sendError(res, 500, 'PROFILE_UPDATE_FAILED', 'Failed to update profile.');
  }
});

router.post('/photo', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, 'PHOTO_REQUIRED', 'No photo uploaded.');
    const photoUrl = `/uploads/${req.file.filename}`;
    const [updated] = await Profile.update({ photoUrl }, { where: { userId: req.user.userId } });
    if (!updated) return sendError(res, 404, 'PROFILE_NOT_FOUND', 'Profile not found.');
    return sendSuccess(res, { photoUrl }, { message: 'Photo uploaded successfully.' });
  } catch (error) {
    console.error('Photo upload error:', error);
    return sendError(res, 500, 'PHOTO_UPLOAD_FAILED', 'Photo upload failed.');
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.params.id },
      include: [{
        model: User,
        as: 'user',
        required: true,
        where: eligibleUserWhere(req),
        attributes: ['id', 'gender', 'isEmailVerified', 'isMobileVerified'],
      }],
    });
    if (!profile) return sendError(res, 404, 'PROFILE_NOT_FOUND', 'Profile not found or unavailable.');
    return sendSuccess(res, profileDetailDto(profile));
  } catch (error) {
    console.error('Get profile error:', error);
    return sendError(res, 500, 'PROFILE_READ_FAILED', 'Failed to get profile.');
  }
});

module.exports = router;
