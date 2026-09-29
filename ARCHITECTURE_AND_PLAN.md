# 🌺 Bandhan Matrimony — Architecture & Master Plan v2.0
## GoDaddy Shared Hosting · MySQL · Node.js v2 · React Vite · Gemini AI

---

## Project Status Summary

| Layer | Status | Details |
|---|---|---|
| React Frontend | ✅ Complete | Vite + JSX, all UI components |
| Auth Context (JWT) | ✅ Complete | `src/context/AuthContext.jsx` |
| Auth Page UI | ✅ Complete | `src/components/AuthPage.jsx` |
| Node.js Backend | ✅ Complete | `backend_node/server.js` v2.0 |
| MySQL Schema | ✅ Complete | `backend_node/schema.sql` |
| Sequelize Models | ✅ Complete | `backend_node/models/index.js` |
| JWT Middleware | ✅ Complete | `backend_node/middleware/authMiddleware.js` |
| Auth API Routes | ✅ Complete | `backend_node/routes/auth.js` |
| Profiles API | ✅ Complete | `backend_node/routes/profiles.js` |
| Gemini AI Routes | ✅ Complete | `backend_node/routes/ai.js` |
| Google OAuth | ✅ Complete | `backend_node/config/passport.js` |
| GoDaddy SQL Schema | ✅ Complete | `backend_node/schema.sql` |

---

## Authentication Flow (Implemented)

```
[Landing Page / Dashboard]
    ↓ Click "Login / Sign Up" in Navbar
[AuthPage.jsx Modal]
    ├── Tab: Email (Email + Password)
    ├── Tab: Mobile (OTP via MSG91)
    └── Tab: Google (OAuth 2.0 → passport-google-oauth20)
    
[Sign Up: 3 Steps]
    Step 1: Full Name + Email/Mobile
    Step 2: Gender Selection (Bride 👰 or Groom 🤵) ← CRITICAL
    Step 3: Password Setup OR Mobile OTP Verify OR Google SSO
    
[After Auth Success]
    → JWT Token stored in localStorage (AuthContext)
    → filters.gender = opposite of user.gender (Groom → Bride feed)
    → Dashboard shows ONLY opposite gender profiles
    
[Logout]
    → Clear localStorage token
    → Reset feed to default
```

---

## Gender Feed Enforcement (Dual Layer)

### Frontend (AuthContext.jsx)
```javascript
const feedGender = authUser?.gender === 'Groom' ? 'Bride' : 'Groom';
// Groom logged in → feedGender = 'Bride' → sees only bride profiles
// Bride logged in → feedGender = 'Groom' → sees only groom profiles
```

### Backend (profiles.js API)
```javascript
const feedGender = req.user.gender === 'Groom' ? 'Bride' : 'Groom';
// Server enforces correct gender even if client tries to manipulate
```

---

## Gemini AI Features (Implemented Backend)

| Feature | Route | Model | Trigger |
|---|---|---|---|
| 15-Dimension Match Verdict | GET /api/ai/match/:id | gemini-2.0-flash | Open profile modal |
| Smart Ice-Breaker Chat | POST /api/ai/chat-starters | gemini-2.0-flash | Open chat |
| Profile Improvement Tips | GET /api/ai/profile-tips | gemini-2.0-flash | Edit profile |
| Natural Language Search | POST /api/ai/smart-search | gemini-2.0-flash | Smart search bar |

**AI Match Score Caching**: Scores are cached in MySQL for 24h to avoid excessive Gemini API calls.

---

## GoDaddy Hosting Deployment Steps

### Step 1: MySQL Database
1. cPanel → MySQL Databases → Create database `bandhan_db`
2. Create user `bandhan_user` with strong password
3. Grant ALL PRIVILEGES to user on database
4. phpMyAdmin → Select `bandhan_db` → Import → `schema.sql`

### Step 2: Node.js App
1. cPanel → Setup Node App → Create App
   - Node version: 18.x
   - Application root: `backend_node`
   - Application URL: `/api`
   - Application startup file: `server.js`
2. Copy `.env.example` to `.env` and fill all values
3. npm install (in cPanel Node App manager)
4. Start the app

### Step 3: React Frontend
1. Run `npm run build` in `c:\shadi`
2. Upload `dist/*` to `public_html/` via File Manager
3. Upload `.htaccess` to `public_html/`:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Step 4: Domain & SSL
1. cPanel → Let's Encrypt SSL → Install for your domain
2. Update `FRONTEND_URL` and `GOOGLE_CALLBACK_URL` in `.env` to use HTTPS

---

## File Directory

```
c:\shadi\
├── src\
│   ├── context\
│   │   └── AuthContext.jsx          ← JWT auth state management
│   ├── components\
│   │   ├── AuthPage.jsx             ← Login/Signup/OTP modal
│   │   ├── Navbar.jsx               ← Auth-aware navbar
│   │   ├── ProfileCard.jsx          ← Profile cards
│   │   ├── ProfileDetailModal.jsx   ← Full profile + AI verdict
│   │   ├── TodayAndNearbyMatches.jsx
│   │   ├── RecentVisitorsView.jsx
│   │   ├── FloatingChatWidget.jsx
│   │   ├── DashboardInbox.jsx
│   │   ├── GunaMilanCalculator.jsx
│   │   ├── LifestyleReelsModal.jsx
│   │   ├── ParivarMeetModal.jsx
│   │   ├── RegistrationWizard.jsx
│   │   ├── MembershipPlans.jsx
│   │   ├── MapView.jsx
│   │   ├── DeleteAccountModal.jsx
│   │   ├── NotificationsModal.jsx
│   │   ├── SearchFilters.jsx
│   │   ├── HeroSection.jsx
│   │   └── Footer.jsx
│   ├── data\
│   │   └── mockProfiles.js
│   ├── App.jsx                      ← Main app (auth wired)
│   ├── main.jsx                     ← AuthProvider wrapper
│   └── index.css
│
├── backend_node\
│   ├── server.js                    ← Express v2.0 main server
│   ├── schema.sql                   ← MySQL schema for GoDaddy
│   ├── .env.example                 ← Environment template
│   ├── package.json                 ← Dependencies
│   ├── config\
│   │   ├── database.js              ← Sequelize MySQL config
│   │   └── passport.js              ← Google OAuth strategy
│   ├── middleware\
│   │   └── authMiddleware.js        ← JWT verify middleware
│   ├── models\
│   │   └── index.js                 ← All Sequelize models
│   └── routes\
│       ├── auth.js                  ← Auth routes (JWT+OTP+Google)
│       ├── profiles.js              ← Profiles, interests, visits
│       └── ai.js                    ← Gemini AI routes
│
├── ARCHITECTURE_AND_PLAN.md         ← This file
└── GODADDY_HOSTING_GUIDE.md         ← Detailed hosting guide
```
