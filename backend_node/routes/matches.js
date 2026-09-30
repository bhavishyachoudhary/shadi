/** Bandhan Matrimony — Match routes mounted at /api/v1/matches. */

const express = require('express');
const { Op } = require('sequelize');
const { requireAuth } = require('../middleware/authMiddleware');
const { User, Profile, PartnerPreference } = require('../models');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const router = express.Router();

const calculateAge = dob => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) age -= 1;
  return age;
};

const summaryDto = profile => ({
  id: String(profile.userId),
  name: profile.fullName,
  gender: profile.user?.gender,
  age: calculateAge(profile.dob),
  religion: profile.religion,
  caste: profile.caste,
  motherTongue: profile.motherTongue,
  education: profile.education,
  occupation: profile.occupation,
  city: profile.city,
  state: profile.state,
  country: profile.country,
  photoUrl: profile.photoUrl,
  matchScore: profile.matchScore,
  verification: {
    email: Boolean(profile.user?.isEmailVerified),
    mobile: Boolean(profile.user?.isMobileVerified),
    profile: Boolean(profile.isVerified),
  },
});

router.get('/today', requireAuth, async (req, res) => {
  try {
    const feedGender = req.user.gender === 'Groom' ? 'Bride' : 'Groom';
    const preferences = await PartnerPreference.findOne({ where: { userId: req.user.userId } });
    const where = {};

    if (preferences?.religion && preferences.religion !== 'Any') where.religion = preferences.religion;
    if (preferences?.manglik && preferences.manglik !== 'Any') where.manglik = preferences.manglik;
    if (preferences?.diet && preferences.diet !== 'Any') where.diet = preferences.diet;

    if (preferences?.minAge || preferences?.maxAge) {
      const dobRange = {};
      if (preferences.maxAge) {
        const earliestBirthDate = new Date();
        earliestBirthDate.setFullYear(earliestBirthDate.getFullYear() - preferences.maxAge - 1);
        dobRange[Op.gt] = earliestBirthDate;
      }
      if (preferences.minAge) {
        const latestBirthDate = new Date();
        latestBirthDate.setFullYear(latestBirthDate.getFullYear() - preferences.minAge);
        dobRange[Op.lte] = latestBirthDate;
      }
      where.dob = dobRange;
    }

    const profiles = await Profile.findAll({
      where,
      include: [{
        model: User,
        as: 'user',
        required: true,
        where: {
          id: { [Op.ne]: req.user.userId },
          gender: feedGender,
          isActive: true,
          isApproved: true,
          profileComplete: true,
        },
        attributes: ['id', 'gender', 'isEmailVerified', 'isMobileVerified'],
      }],
      order: [['matchScore', 'DESC'], ['createdAt', 'DESC']],
      limit: 20,
    });

    return sendSuccess(res, profiles.map(summaryDto), {
      meta: { date: new Date().toISOString().split('T')[0], feedGender },
    });
  } catch (error) {
    console.error('Get today matches error:', error);
    return sendError(res, 500, 'MATCH_LIST_FAILED', 'Failed to get today’s matches.');
  }
});

module.exports = router;
