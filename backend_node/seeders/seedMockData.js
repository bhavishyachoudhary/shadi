/**
 * Non-production, idempotent mock-data seeder.
 *
 * Dry run (no DB connection): npm run seed:mock:dry
 * Seed configured development DB: set ALLOW_MOCK_SEED=true, then npm run seed:mock
 * Optionally set MOCK_SEED_SYNC=true to create missing Sequelize tables in development.
 */

require('dotenv').config();

const { User, Profile, PartnerPreference, sequelize } = require('../models');
const {
  loadFrontendMockProfiles,
  mockUserIdForProfileId,
  mockProfileIdForProfileId,
  mockPreferenceIdForProfileId,
} = require('../utils/mockData');

const isDryRun = process.argv.includes('--dry-run');
const isProduction = process.env.NODE_ENV === 'production';

const normalizedManglik = value => {
  if (value === 'Anshik') return 'Partial';
  return ['Yes', 'No', 'Partial'].includes(value) ? value : 'No';
};

const buildRecords = mockProfiles => {
  if (!Array.isArray(mockProfiles) || mockProfiles.length !== 100) {
    throw new Error(`Expected exactly 100 mock profiles, received ${mockProfiles?.length ?? 0}.`);
  }

  const users = mockProfiles.map(profile => ({
    id: mockUserIdForProfileId(profile.id),
    email: `mock.profile${profile.id}@bandhan.test`,
    mobile: null,
    password: null,
    googleId: null,
    gender: profile.gender,
    isEmailVerified: Boolean(profile.isVerified),
    isMobileVerified: true,
    isApproved: true,
    profileComplete: true,
    loginMethod: 'email',
    lastLoginAt: null,
    isActive: true,
  }));

  const profiles = mockProfiles.map(profile => ({
    id: mockProfileIdForProfileId(profile.id),
    userId: mockUserIdForProfileId(profile.id),
    fullName: profile.name,
    dob: profile.dob,
    heightCm: profile.heightCm,
    religion: profile.religion,
    caste: profile.caste,
    motherTongue: profile.motherTongue,
    education: profile.education,
    occupation: profile.occupation,
    annualIncome: profile.income,
    city: profile.city,
    state: profile.state,
    country: profile.country,
    isNri: Boolean(profile.isNri),
    aboutMe: profile.about,
    photoUrl: profile.photo,
    photos: profile.photos || [],
    rashi: profile.rashi,
    nakshatra: profile.nakshatra,
    gotra: profile.gotra,
    manglik: normalizedManglik(profile.manglik),
    diet: profile.diet,
    matchScore: profile.matchScore,
    lat: profile.lat,
    lng: profile.lng,
    isVerified: Boolean(profile.isVerified),
    lifestyleVideoUrl: null,
    familyDetails: profile.family || null,
  }));

  const preferences = mockProfiles.map(profile => ({
    id: mockPreferenceIdForProfileId(profile.id),
    userId: mockUserIdForProfileId(profile.id),
    minAge: profile.gender === 'Bride' ? 27 : 24,
    maxAge: profile.gender === 'Bride' ? 36 : 33,
    minHeightCm: profile.gender === 'Bride' ? 168 : 154,
    maxHeightCm: profile.gender === 'Bride' ? 193 : 180,
    religion: 'Any',
    caste: 'Any',
    education: 'Any',
    incomeMin: null,
    manglik: 'Any',
    diet: 'Any',
    preferredCities: profile.city,
    nriPreference: 'Any',
  }));

  return { users, profiles, preferences };
};

const validateRecords = records => {
  const userIds = new Set(records.users.map(user => user.id));
  const profileUserIds = new Set(records.profiles.map(profile => profile.userId));
  const locations = new Set(records.profiles.map(profile => `${profile.city}|${profile.state}|${profile.country}`));
  const brides = records.users.filter(user => user.gender === 'Bride').length;
  const grooms = records.users.filter(user => user.gender === 'Groom').length;
  const invalidCoordinates = records.profiles.filter(profile => (
    !Number.isFinite(profile.lat)
    || !Number.isFinite(profile.lng)
    || profile.lat < -90
    || profile.lat > 90
    || profile.lng < -180
    || profile.lng > 180
  ));

  if (userIds.size !== 100 || profileUserIds.size !== 100 || brides !== 50 || grooms !== 50 || locations.size !== 50 || invalidCoordinates.length) {
    throw new Error('Mock fixture validation failed.');
  }

  return { profiles: records.profiles.length, brides, grooms, locations: locations.size };
};

const seedMockData = async () => {
  const mockProfiles = await loadFrontendMockProfiles();
  const records = buildRecords(mockProfiles);
  const summary = validateRecords(records);

  if (isDryRun) {
    console.log(JSON.stringify({ mode: 'dry-run', ...summary }, null, 2));
    return;
  }

  if (isProduction || process.env.ALLOW_MOCK_SEED !== 'true') {
    throw new Error('Mock seeding is disabled. Use a non-production environment with ALLOW_MOCK_SEED=true.');
  }

  await sequelize.authenticate();
  if (process.env.MOCK_SEED_SYNC === 'true') {
    await sequelize.sync();
  }

  await sequelize.transaction(async transaction => {
    await User.bulkCreate(records.users, {
      transaction,
      updateOnDuplicate: [
        'email', 'gender', 'isEmailVerified', 'isMobileVerified', 'isApproved',
        'profileComplete', 'loginMethod', 'isActive',
      ],
    });
    await Profile.bulkCreate(records.profiles, {
      transaction,
      updateOnDuplicate: [
        'fullName', 'dob', 'heightCm', 'religion', 'caste', 'motherTongue',
        'education', 'occupation', 'annualIncome', 'city', 'state', 'country',
        'isNri', 'aboutMe', 'photoUrl', 'photos', 'rashi', 'nakshatra', 'gotra',
        'manglik', 'diet', 'matchScore', 'lat', 'lng', 'isVerified', 'familyDetails',
      ],
    });
    await PartnerPreference.bulkCreate(records.preferences, {
      transaction,
      updateOnDuplicate: [
        'minAge', 'maxAge', 'minHeightCm', 'maxHeightCm', 'religion', 'caste',
        'education', 'incomeMin', 'manglik', 'diet', 'preferredCities', 'nriPreference',
      ],
    });
  });

  console.log(JSON.stringify({ mode: 'seeded', ...summary }, null, 2));
};

seedMockData()
  .catch(error => {
    console.error(`Mock seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (!isDryRun) await sequelize.close();
  });
