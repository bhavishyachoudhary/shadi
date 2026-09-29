/**
 * Bandhan Matrimony — User & Profile Sequelize Models
 * Tables: users, profiles, partner_preferences
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ═══════════════════════════════════════════════
//  USERS TABLE — Authentication & Account Info
// ═══════════════════════════════════════════════
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(191),
    unique: true,
    allowNull: true,
    validate: { isEmail: true }
  },
  mobile: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true, // Null for Google OAuth users
  },
  googleId: {
    type: DataTypes.STRING(191),
    unique: true,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('Bride', 'Groom'),
    allowNull: false,
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isMobileVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  profileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  loginMethod: {
    type: DataTypes.ENUM('email', 'mobile', 'google'),
    defaultValue: 'email',
  },
  otpCode: {
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['mobile'] },
    { fields: ['google_id'] },
  ]
});

// ═══════════════════════════════════════════════
//  PROFILES TABLE — Personal & Family Details
// ═══════════════════════════════════════════════
const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  fullName: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  heightCm: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  religion: {
    type: DataTypes.STRING(50),
    defaultValue: 'Hindu',
  },
  caste: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  motherTongue: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  education: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  occupation: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  annualIncome: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'India',
  },
  isNri: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  aboutMe: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  photoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  photos: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  rashi: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  nakshatra: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  gotra: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  manglik: {
    type: DataTypes.ENUM('Yes', 'No', 'Partial'),
    defaultValue: 'No',
  },
  diet: {
    type: DataTypes.ENUM('Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'),
    defaultValue: 'Vegetarian',
  },
  matchScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lifestyleVideoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  familyDetails: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'profiles',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['religion'] },
    { fields: ['city'] },
  ]
});

// ═══════════════════════════════════════════════
//  PARTNER PREFERENCES TABLE
// ═══════════════════════════════════════════════
const PartnerPreference = sequelize.define('PartnerPreference', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  minAge: { type: DataTypes.INTEGER, defaultValue: 22 },
  maxAge: { type: DataTypes.INTEGER, defaultValue: 35 },
  minHeightCm: { type: DataTypes.INTEGER, defaultValue: 155 },
  maxHeightCm: { type: DataTypes.INTEGER, defaultValue: 185 },
  religion: { type: DataTypes.STRING(100), defaultValue: 'Any' },
  caste: { type: DataTypes.STRING(200), defaultValue: 'Any' },
  education: { type: DataTypes.STRING(200), defaultValue: 'Any' },
  incomeMin: { type: DataTypes.STRING(100), allowNull: true },
  manglik: { type: DataTypes.STRING(20), defaultValue: 'Any' },
  diet: { type: DataTypes.STRING(50), defaultValue: 'Any' },
  preferredCities: { type: DataTypes.TEXT, allowNull: true }, // CSV of cities
  nriPreference: { type: DataTypes.ENUM('Yes', 'No', 'Any'), defaultValue: 'Any' },
}, {
  tableName: 'partner_preferences',
});

// ═══════════════════════════════════════════════
//  INTERESTS TABLE
// ═══════════════════════════════════════════════
const Interest = sequelize.define('Interest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  status: {
    type: DataTypes.ENUM('sent', 'accepted', 'declined'),
    defaultValue: 'sent',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'interests',
  indexes: [
    { fields: ['sender_id'] },
    { fields: ['receiver_id'] },
  ]
});

// ═══════════════════════════════════════════════
//  MESSAGES TABLE — Chat
// ═══════════════════════════════════════════════
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  roomId: {
    type: DataTypes.STRING(191),
    allowNull: false,
    comment: 'Derived from sorted(senderId + receiverId)',
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('text', 'image', 'location', 'audio', 'file'),
    defaultValue: 'text',
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read'),
    defaultValue: 'sent',
  },
  fileUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'messages',
  indexes: [
    { fields: ['room_id'] },
    { fields: ['sender_id'] },
  ]
});

// ═══════════════════════════════════════════════
//  PROFILE VISITS TABLE
// ═══════════════════════════════════════════════
const ProfileVisit = sequelize.define('ProfileVisit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  visitorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  profileId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  visitDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  visitCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  firstVisitTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastVisitTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'profile_visits',
  indexes: [
    { fields: ['visitor_id', 'profile_id', 'visit_date'], unique: true },
  ]
});

// ═══════════════════════════════════════════════
//  AI MATCH SCORES TABLE — Gemini AI Results
// ═══════════════════════════════════════════════
const AiMatchScore = sequelize.define('AiMatchScore', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  targetId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  verdict: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Cache expires after 24h to avoid repeated Gemini calls',
  },
}, {
  tableName: 'ai_match_scores',
  indexes: [
    { fields: ['user_id', 'target_id'], unique: true },
  ]
});

// ═══════════════════════════════════════════════
//  ASSOCIATIONS
// ═══════════════════════════════════════════════
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(PartnerPreference, { foreignKey: 'userId', as: 'preferences' });
PartnerPreference.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { User, Profile, PartnerPreference, Interest, Message, ProfileVisit, AiMatchScore, sequelize };
