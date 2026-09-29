/**
 * Bandhan Matrimony — Profiles API Routes
 * GET  /api/profiles            — Get gender-filtered feed
 * GET  /api/profiles/me         — Get my profile
 * PUT  /api/profiles/me         — Update my profile
 * POST /api/profiles/photo      — Upload profile photo
 * GET  /api/profiles/:id        — Get single profile
 * GET  /api/matches/today       — Today's preference matches
 * GET  /api/matches/nearby      — Nearby matches by distance
 * GET  /api/visits              — My profile visitors
 * POST /api/visits              — Record a profile visit
 * POST /api/interests           — Send express interest
 * PUT  /api/interests/:id       — Accept/Decline interest
 * GET  /api/interests/received  — Received interests
 * GET  /api/interests/sent      — Sent interests
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const { User, Profile, PartnerPreference, Interest, ProfileVisit } = require('../models');
const { Op } = require('sequelize');

// ─────────────────────────────────────────────
// Multer: Profile Photo Upload Config
// ─────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${req.user.userId}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') },
  fileFilter: (req, file, cb) => {
    if (/image\/(jpg|jpeg|png|webp)/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP images are allowed.'));
    }
  }
});

// ─────────────────────────────────────────────
// Helper: Calculate distance between two coords (Haversine)
// ─────────────────────────────────────────────
const calcDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─────────────────────────────────────────────
// GET /api/profiles — Gender-Filtered Feed
// ─────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Determine feed gender from JWT token (server-enforced)
    let feedGender = 'Bride'; // Default
    if (req.user) {
      feedGender = req.user.gender === 'Groom' ? 'Bride' : 'Groom';
    }

    const {
      page = 1,
      limit = 20,
      religion,
      motherTongue,
      city,
      maxAge,
      minIncome,
      manglik,
      diet,
      verifiedOnly,
      isNri,
    } = req.query;

    const whereClause = {};
    if (religion && religion !== 'All') whereClause.religion = religion;
    if (motherTongue && motherTongue !== 'All') whereClause.motherTongue = motherTongue;
    if (city && city !== 'All') whereClause.city = city;
    if (manglik && manglik !== 'All') whereClause.manglik = manglik;
    if (diet && diet !== 'All') whereClause.diet = diet;
    if (verifiedOnly === 'true') whereClause.isVerified = true;
    if (isNri === 'true') whereClause.isNri = true;

    // Age filter (DOB-based)
    if (maxAge) {
      const minBirth = new Date();
      minBirth.setFullYear(minBirth.getFullYear() - parseInt(maxAge));
      whereClause.dob = { [Op.gte]: minBirth };
    }

    const userWhereClause = { gender: feedGender, isActive: true };

    const { count, rows } = await Profile.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        where: userWhereClause,
        attributes: ['id', 'gender', 'isApproved', 'isEmailVerified', 'isMobileVerified'],
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['matchScore', 'DESC'], ['createdAt', 'DESC']],
    });

    return res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      feedGender,
      profiles: rows.map(p => ({
        id: p.userId,
        name: p.fullName,
        gender: p.user?.gender,
        dob: p.dob,
        heightCm: p.heightCm,
        religion: p.religion,
        caste: p.caste,
        motherTongue: p.motherTongue,
        education: p.education,
        occupation: p.occupation,
        annualIncome: p.annualIncome,
        city: p.city,
        state: p.state,
        country: p.country,
        diet: p.diet,
        manglik: p.manglik,
        rashi: p.rashi,
        matchScore: p.matchScore,
        isVerified: p.user?.isEmailVerified || p.user?.isMobileVerified,
        isNri: p.isNri,
        photoUrl: p.photoUrl,
        photos: p.photos || [],
        lat: p.lat,
        lng: p.lng,
        aboutMe: p.aboutMe,
      }))
    });

  } catch (err) {
    console.error('Get profiles error:', err);
    return res.status(500).json({ error: 'Failed to get profiles.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/profiles/me — My Profile
// ─────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.userId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'mobile', 'gender', 'isApproved', 'profileComplete'] }
      ]
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get your profile.' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/profiles/me — Update My Profile
// ─────────────────────────────────────────────
router.put('/me', requireAuth, async (req, res) => {
  try {
    const allowedFields = [
      'fullName', 'dob', 'heightCm', 'religion', 'caste', 'motherTongue',
      'education', 'occupation', 'annualIncome', 'city', 'state', 'country',
      'isNri', 'aboutMe', 'rashi', 'nakshatra', 'gotra', 'manglik', 'diet',
      'lat', 'lng', 'familyDetails'
    ];

    const updates = {};
    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const [updated] = await Profile.update(updates, { where: { userId: req.user.userId } });

    if (updated) {
      // Check profile completeness
      const profile = await Profile.findOne({ where: { userId: req.user.userId } });
      const required = ['fullName', 'dob', 'heightCm', 'religion', 'education', 'occupation', 'city', 'aboutMe'];
      const isComplete = required.every(f => profile[f]);
      
      if (isComplete) {
        await User.update({ profileComplete: true }, { where: { id: req.user.userId } });
      }
    }

    return res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/profiles/photo — Upload Profile Photo
// ─────────────────────────────────────────────
router.post('/photo', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No photo uploaded.' });

    const photoUrl = `/uploads/${req.file.filename}`;
    await Profile.update({ photoUrl }, { where: { userId: req.user.userId } });

    return res.json({ message: 'Photo uploaded successfully.', photoUrl });
  } catch (err) {
    console.error('Photo upload error:', err);
    return res.status(500).json({ error: 'Photo upload failed.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/profiles/:id — Single Profile
// ─────────────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.params.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'gender', 'isApproved'] }]
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found.' });
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get profile.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/matches/today — Today's Preference Matches
// ─────────────────────────────────────────────
router.get('/matches/today', requireAuth, async (req, res) => {
  try {
    const feedGender = req.user.gender === 'Groom' ? 'Bride' : 'Groom';
    const pref = await PartnerPreference.findOne({ where: { userId: req.user.userId } });

    const whereClause = {};
    if (pref?.religion && pref.religion !== 'Any') whereClause.religion = pref.religion;
    if (pref?.manglik && pref.manglik !== 'Any') whereClause.manglik = pref.manglik;
    if (pref?.diet && pref.diet !== 'Any') whereClause.diet = pref.diet;

    const profiles = await Profile.findAll({
      where: whereClause,
      include: [{ model: User, as: 'user', where: { gender: feedGender, isActive: true } }],
      order: [['matchScore', 'DESC']],
      limit: 20,
    });

    return res.json({ profiles, date: new Date().toISOString().split('T')[0] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get today matches.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/visits — Record Profile Visit
// ─────────────────────────────────────────────
router.post('/visits', requireAuth, async (req, res) => {
  try {
    const { profileId } = req.body;
    const visitorId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];

    const [visit, created] = await ProfileVisit.findOrCreate({
      where: { visitorId, profileId, visitDate: today },
      defaults: {
        id: uuidv4(),
        visitorId,
        profileId,
        visitDate: today,
        visitCount: 1,
        firstVisitTime: new Date(),
        lastVisitTime: new Date(),
      }
    });

    if (!created) {
      await visit.update({
        visitCount: visit.visitCount + 1,
        lastVisitTime: new Date(),
      });
    }

    return res.json({ recorded: true, visitCount: visit.visitCount });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to record visit.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/visits — My Profile Visitors
// ─────────────────────────────────────────────
router.get('/visits', requireAuth, async (req, res) => {
  try {
    const visits = await ProfileVisit.findAll({
      where: { profileId: req.user.userId },
      order: [['lastVisitTime', 'DESC']],
      limit: 50,
    });

    return res.json({ visits });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get visitors.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/interests — Send Express Interest
// ─────────────────────────────────────────────
router.post('/interests', requireAuth, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.userId;

    const existing = await Interest.findOne({ where: { senderId, receiverId } });
    if (existing) return res.status(409).json({ error: 'Interest already sent.' });

    const interest = await Interest.create({
      id: uuidv4(), senderId, receiverId, message, status: 'sent'
    });

    return res.status(201).json({ message: 'Interest sent!', interest });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send interest.' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/interests/:id — Accept or Decline
// ─────────────────────────────────────────────
router.put('/interests/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Status must be accepted or declined.' });
    }

    const interest = await Interest.findByPk(req.params.id);
    if (!interest) return res.status(404).json({ error: 'Interest not found.' });
    if (interest.receiverId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    await interest.update({ status });
    return res.json({ message: `Interest ${status}.`, interest });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update interest.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/interests/received
// ─────────────────────────────────────────────
router.get('/interests/received', requireAuth, async (req, res) => {
  try {
    const interests = await Interest.findAll({
      where: { receiverId: req.user.userId },
      order: [['createdAt', 'DESC']],
    });
    return res.json({ interests });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get received interests.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/interests/sent
// ─────────────────────────────────────────────
router.get('/interests/sent', requireAuth, async (req, res) => {
  try {
    const interests = await Interest.findAll({
      where: { senderId: req.user.userId },
      order: [['createdAt', 'DESC']],
    });
    return res.json({ interests });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get sent interests.' });
  }
});

module.exports = router;
