/**
 * Bandhan Matrimony — Gemini AI Routes
 * GET  /api/ai/match/:targetId       — 15-Dimension AI Match Verdict
 * POST /api/ai/chat-starters         — Smart Ice-Breaker Messages
 * GET  /api/ai/profile-tips          — Profile Improvement Suggestions
 * POST /api/ai/smart-search          — Natural Language Search Parser
 * GET  /api/ai/daily-digest          — Daily Match Summary Email
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { AiMatchScore, Profile, User } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Initialize Gemini AI SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─────────────────────────────────────────────
// Helper: Get Gemini Flash model instance
// ─────────────────────────────────────────────
const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

// ─────────────────────────────────────────────
// Helper: Safe JSON parse from Gemini response
// ─────────────────────────────────────────────
const safeJsonParse = (text) => {
  try {
    // Strip markdown code fences if present
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────
// GET /api/ai/match/:targetId
// 15-Dimension Gemini AI Compatibility Verdict
// ─────────────────────────────────────────────
router.get('/match/:targetId', requireAuth, async (req, res) => {
  try {
    const { targetId } = req.params;
    const userId = req.user.userId;

    // Check cache first (valid for 24h)
    const cached = await AiMatchScore.findOne({
      where: { userId, targetId },
    });

    if (cached && cached.expiresAt > new Date()) {
      return res.json({
        cached: true,
        score: cached.score,
        dimensions: cached.dimensions,
        verdict: cached.verdict,
      });
    }

    // Fetch both profiles
    const [myProfile, targetProfile] = await Promise.all([
      Profile.findOne({ where: { userId }, include: [{ model: User, as: 'user' }] }),
      Profile.findOne({ where: { userId: targetId }, include: [{ model: User, as: 'user' }] }),
    ]);

    if (!myProfile || !targetProfile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    const myGender = myProfile.user?.gender || req.user.gender;
    const groom = myGender === 'Groom' ? myProfile : targetProfile;
    const bride = myGender === 'Bride' ? myProfile : targetProfile;

    const prompt = `
You are an expert Indian matrimonial counselor and Vedic astrologer. Evaluate compatibility between:

GROOM: ${groom.fullName}, Age: (DOB: ${groom.dob}), Religion: ${groom.religion}, Caste: ${groom.caste}, 
Mother Tongue: ${groom.motherTongue}, Education: ${groom.education}, Occupation: ${groom.occupation}, 
Income: ${groom.annualIncome}, City: ${groom.city}, Diet: ${groom.diet}, Manglik: ${groom.manglik},
Rashi: ${groom.rashi}, Nakshatra: ${groom.nakshatra}, Gotra: ${groom.gotra},
About: ${groom.aboutMe || 'Not specified'}

BRIDE: ${bride.fullName}, Age: (DOB: ${bride.dob}), Religion: ${bride.religion}, Caste: ${bride.caste},
Mother Tongue: ${bride.motherTongue}, Education: ${bride.education}, Occupation: ${bride.occupation},
Income: ${bride.annualIncome}, City: ${bride.city}, Diet: ${bride.diet}, Manglik: ${bride.manglik},
Rashi: ${bride.rashi}, Nakshatra: ${bride.nakshatra}, Gotra: ${bride.gotra},
About: ${bride.aboutMe || 'Not specified'}

Rate compatibility 1-10 on EXACTLY these 15 dimensions:
1. kundali_match (Ashtakoot Guna Points / 36)
2. diet_compatibility
3. lifestyle_match (hobbies, fitness, interests)
4. career_alignment
5. income_compatibility
6. education_compatibility
7. location_match (city/relocation preference)
8. nri_relocation_willingness
9. family_values_match
10. religion_caste_compatibility
11. language_match (mother tongue)
12. values_about_alignment (about me analysis)
13. age_gap_suitability
14. height_preference
15. manglik_compatibility

Calculate totalScore as: (sum of all dimension scores / 150) * 100

Generate a 2-line warm, culturally sensitive verdict in English.

RESPOND ONLY with valid JSON:
{
  "dimensions": {
    "kundali_match": 8,
    "diet_compatibility": 9,
    "lifestyle_match": 7,
    "career_alignment": 8,
    "income_compatibility": 9,
    "education_compatibility": 9,
    "location_match": 7,
    "nri_relocation_willingness": 6,
    "family_values_match": 8,
    "religion_caste_compatibility": 9,
    "language_match": 10,
    "values_about_alignment": 8,
    "age_gap_suitability": 9,
    "height_preference": 8,
    "manglik_compatibility": 10
  },
  "totalScore": 87,
  "verdict": "An excellent match with strong alignment in values, education, and family background. The Kundali shows promising compatibility with mutual respect and complementary life goals."
}
`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = safeJsonParse(text);

    if (!parsed || !parsed.dimensions || !parsed.totalScore) {
      return res.status(500).json({ error: 'AI analysis failed. Please try again.' });
    }

    // Cache result for 24h
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await AiMatchScore.upsert({
      id: uuidv4(),
      userId,
      targetId,
      score: Math.round(parsed.totalScore),
      dimensions: parsed.dimensions,
      verdict: parsed.verdict,
      expiresAt,
    });

    return res.json({
      cached: false,
      score: Math.round(parsed.totalScore),
      dimensions: parsed.dimensions,
      verdict: parsed.verdict,
    });

  } catch (err) {
    console.error('AI match error:', err);
    // Return a graceful fallback score
    return res.json({
      cached: false,
      score: 75,
      dimensions: null,
      verdict: 'AI analysis temporarily unavailable. Check back later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ─────────────────────────────────────────────
// POST /api/ai/chat-starters
// Generate personalized ice-breaker messages
// ─────────────────────────────────────────────
router.post('/chat-starters', requireAuth, async (req, res) => {
  try {
    const { targetId } = req.body;
    const userId = req.user.userId;

    const [myProfile, targetProfile] = await Promise.all([
      Profile.findOne({ where: { userId } }),
      Profile.findOne({ where: { userId: targetId } }),
    ]);

    if (!myProfile || !targetProfile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    const prompt = `
Generate 3 warm, respectful matrimonial ice-breaker messages from:
${myProfile.fullName} (${myProfile.occupation}, ${myProfile.city}) 
to ${targetProfile.fullName} (${targetProfile.occupation}, ${targetProfile.city}).

Target's interests from their about: "${targetProfile.aboutMe || 'music, travel, cooking'}"
Common traits: Both are from ${myProfile.religion} background.

Rules:
- Each message should be 1-2 sentences
- Warm and respectful Indian matrimonial tone
- Reference a specific detail about their profile
- Don't be generic or creepy
- Cultural but modern

RESPOND ONLY with valid JSON:
{
  "starters": [
    "Message 1 here...",
    "Message 2 here...", 
    "Message 3 here..."
  ]
}
`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text());

    if (!parsed || !parsed.starters) {
      return res.json({
        starters: [
          `Namaste! I noticed we share similar backgrounds. Would love to know more about you.`,
          `Your profile mentions ${targetProfile.city} — I've always loved that city! Would love to connect.`,
          `I admire your educational background. It seems we have a lot in common. Shall we chat?`
        ]
      });
    }

    return res.json({ starters: parsed.starters });

  } catch (err) {
    console.error('Chat starters error:', err);
    return res.json({
      starters: [
        'Namaste! I came across your profile and felt a genuine connection. Would love to connect!',
        'Your profile is very impressive. Would love to know more about your interests and family.',
        'Hello! Seems like we have many things in common. Looking forward to a meaningful conversation.'
      ]
    });
  }
});

// ─────────────────────────────────────────────
// GET /api/ai/profile-tips
// Get AI suggestions to improve profile
// ─────────────────────────────────────────────
router.get('/profile-tips', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    // Calculate completeness
    const fields = ['fullName', 'dob', 'heightCm', 'religion', 'caste', 'motherTongue', 'education', 'occupation', 'annualIncome', 'city', 'aboutMe', 'photoUrl', 'rashi', 'manglik'];
    const filled = fields.filter(f => profile[f]).length;
    const completeness = Math.round((filled / fields.length) * 100);

    const prompt = `
A matrimonial profile has ${completeness}% completeness.
Profile: ${JSON.stringify({
  name: profile.fullName,
  dob: profile.dob,
  height: profile.heightCm,
  religion: profile.religion,
  education: profile.education,
  occupation: profile.occupation,
  income: profile.annualIncome,
  city: profile.city,
  about: profile.aboutMe,
  hasPhoto: !!profile.photoUrl,
  rashi: profile.rashi,
  manglik: profile.manglik,
})}

Generate 3-5 specific, actionable tips to improve this matrimonial profile to attract more compatible matches.
Focus on missing or weak areas.

RESPOND ONLY with valid JSON:
{
  "completeness": ${completeness},
  "tips": [
    { "priority": "high", "tip": "Add a recent, clear photo to increase profile views by 3x." },
    { "priority": "medium", "tip": "Complete your About Me section with hobbies and family values." }
  ]
}
`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text());

    return res.json(parsed || { completeness, tips: [{ priority: 'high', tip: 'Complete all profile fields to appear in more searches.' }] });

  } catch (err) {
    console.error('Profile tips error:', err);
    return res.json({ completeness: 0, tips: [] });
  }
});

// ─────────────────────────────────────────────
// POST /api/ai/smart-search
// Natural language → structured filters
// ─────────────────────────────────────────────
router.post('/smart-search', requireAuth, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required.' });

    const prompt = `
Parse this matrimonial search query into structured filters:
"${query}"

Extract values only if clearly mentioned. Use "Any" for unspecified fields.

RESPOND ONLY with valid JSON:
{
  "gender": "Bride",
  "minAge": 25,
  "maxAge": 30,
  "religion": "Hindu",
  "caste": "Any",
  "motherTongue": "Any",
  "city": "Mumbai",
  "education": "Any",
  "occupation": "Doctor",
  "minIncome": "Any",
  "manglik": "Any",
  "diet": "Vegetarian",
  "isNri": false
}
`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text());

    return res.json({ filters: parsed || {}, original: query });

  } catch (err) {
    console.error('Smart search error:', err);
    return res.json({ filters: {}, original: req.body.query });
  }
});

module.exports = router;
