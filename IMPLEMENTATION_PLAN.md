# 🪷 Bandhan Matrimony — 11-Point Implementation Plan

> Generated: October 2026 | Priority: High → Medium → Low

---

## Feature Map Overview

| # | Feature | Priority | Files Impacted | Status |
|---|---|---|---|---|
| 1 | Interest persistence + Subscription access tokens | 🔴 High | AuthContext, App.jsx, MembershipPlans | ⏳ Planned |
| 2 | Fix map filters | 🔴 High | MapView.jsx, App.jsx | ⏳ Planned |
| 3 | Notifications with profile image + link | 🔴 High | NotificationsModal.jsx, App.jsx | ⏳ Planned |
| 4 | Rich profile listing (match, degree, designation, package, caste, gotra, location) | 🔴 High | ProfileCard.jsx, MapView sidebar | ⏳ Planned |
| 5 | Parent location search | 🟠 Medium | MapView.jsx, mockProfiles.js | ⏳ Planned |
| 6 | Family account access + permissions | 🟠 Medium | AuthContext, new FamilyAccessModal | ⏳ Planned |
| 7 | Attractive user profile + personal feed | 🟠 Medium | new UserProfilePage.jsx, App.jsx | ⏳ Planned |
| 8 | Public feed based on map selection | 🟠 Medium | MapView.jsx, new PublicFeed sidebar | ⏳ Planned |
| 9 | Multiple images (profile + cover picture) | 🟡 Medium | mockProfiles.js, ProfileDetailModal, Onboarding | ⏳ Planned |
| 10 | Follow friends/users (optional social layer) | 🟢 Low | new FollowSystem context + UI | ⏳ Planned |
| 11 | Past achievements, present targets, future vision | 🟠 Medium | mockProfiles.js, ProfileDetailModal | ⏳ Planned |

---

## Detailed Feature Specs

### FEATURE 1 — Interest Status Persistence + Subscription Access Tokens

**Problem:** Interest state (sent/accepted/declined) lives only in React state (lost on refresh). No subscription gating on premium actions.

**Solution:**
- Persist `interestMap` in `localStorage` keyed by `bandhan_interests_{userId}`
- Add `subscription` field to `AuthContext`: `free | silver | gold | diamond`
- Gate actions by plan:
  - `free`: View only 5 profiles, cannot send interests
  - `silver`: Can send up to 20 interests, no chat
  - `gold`: Unlimited interests + chat
  - `diamond`: All gold + NRI + AI boost
- Show subscription badge in Navbar (🥈 Silver, 🥇 Gold, 💎 Diamond)
- Show lock overlay on gated features

**Files:** `AuthContext.jsx`, `App.jsx`, `MembershipPlans.jsx`, `Navbar.jsx`

---

### FEATURE 2 — Fix Map Filters

**Problems:**
- `filters` in `App.jsx` and `MapView.jsx` internal state are separate, causing duplication
- `filters.selectedCityKeys` in App.jsx is string[] but MapView uses object[]
- MapView `genderTab` ignores App.jsx `filters.gender`
- Out-of-radius profiles still visible even when toggle is OFF

**Solution:**
- Lift ALL filter state OUT of MapView into App.jsx, pass as props
- Single `filteredProfiles` computation in App.jsx feeds MapView
- MapView becomes a display-only component (no internal filter logic)
- Wire `showOuter`, `selectedCities`, `radiusKm`, `mapType` as controlled props
- Add "Reset Map Filters" button that syncs with sidebar SearchFilters

**Files:** `App.jsx`, `MapView.jsx`, `SearchFilters.jsx`

---

### FEATURE 3 — Notifications with Profile Image + Name + Link

**Problem:** Notifications only show icon + text, no profile photo, no clickable profile link.

**Solution:**
- Add `profilePhoto`, `profileName`, `profileAge`, `profileCity` to each notification object
- Enrich notifications in `App.jsx` using `profiles` data on creation
- In `NotificationsModal.jsx` render:
  - Circular profile photo (40x40)
  - Bold profile name + age
  - City + designation line
  - "View Profile →" tappable link
- Add `match` type notification: "🎯 New Top Match: Ananya Sharma (94% match)"

**Files:** `NotificationsModal.jsx`, `App.jsx`

---

### FEATURE 4 — Rich Profile Listing Cards

**Problem:** ProfileCard and MapView sidebar don't show enough data for quick decisions.

**Solution — ProfileCard.jsx:**
- Show: Match %, Degree, Designation, Package (₹/$ per year), Caste + Community, Gotra, Location + Distance
- Visual hierarchy: Match score badge (top), name, designation row, degree badge, income pill, caste pill, gotra, location

**Solution — MapView sidebar list:**
- Each card: photo, name, age, designation, income, caste, gotra, distance badge

**Files:** `ProfileCard.jsx`, `MapView.jsx`

---

### FEATURE 5 — Parent Location Based Search

**Problem:** Profile location = user's work city. But parents live in Hisar/Sirsa. Families want to find people near parents, not just work location.

**Solution:**
- Add `parentLocation` field to profile data: `{ city, state, lat, lng }`
- In mockProfiles, add parent hometown = profile's `family.hometown` city with coordinates
- Add toggle in MapView filter: "📍 Search by: Work Location | Parent Home Location"
- When "Parent Home" selected, compute distances from `parentLat/parentLng` instead
- Show both badges: "🏠 Sirsa (Home)" and "💼 Gurugram (Work)"

**Files:** `mockProfiles.js`, `MapView.jsx`, `ProfileCard.jsx`

---

### FEATURE 6 — Family Account Access + Permissions

**Problem:** Parents/siblings who create profiles on behalf of user can't manage them.

**Solution:**
- Add `familyAccess` array to auth user: `[{ name, relation, mobile, permissions: ['view', 'respond', 'shortlist'] }]`
- New `FamilyAccessModal.jsx` for managing family members:
  - Add family member (name, mobile, relation)
  - Set permissions: View only / Respond to interests / Full access
  - Active sessions list
- "Family managed" badge on profiles where `profileCreatedBy === 'Family'`
- In Navbar: show "👨‍👩‍👧 Family Access" button when logged in

**New File:** `src/components/FamilyAccessModal.jsx`
**Files:** `AuthContext.jsx`, `App.jsx`, `Navbar.jsx`

---

### FEATURE 7 — Attractive User Profile Page + Personal Feed

**Problem:** No dedicated page for the logged-in user's own profile. No "feed" of a specific user's journey.

**Solution — UserProfilePage.jsx:**
- Cover photo (full-width banner)
- Circular profile picture with edit button
- Name, age, designation, location
- Tabs: About | Feed | Photos | Achievements | Matches
- "Feed" tab: personal posts (like Instagram) — e.g., "Traveled to Chandigarh this weekend"
- Edit profile inline

**Solution — Personal Feed:**
- `feedPosts` array on user profile: `{ id, text, photo, timestamp, likes }`
- Feed cards with like button + timestamp
- Shareable link: `/profile/{userId}`

**New File:** `src/components/UserProfilePage.jsx`
**Files:** `App.jsx`, `Navbar.jsx`, `mockProfiles.js`

---

### FEATURE 8 — Public Feed Based on Map Selection

**Problem:** Map only shows pins. No way to browse a curated public feed of profiles in the selected region.

**Solution:**
- Add "📋 Feed" toggle button in MapView (top-right, next to range badges)
- When active: slides in an overlay panel (right side) showing profile cards in selected city/radius
- Feed sorted by: Best Match → Recently Active → Nearby
- Cards show: photo, name, match %, designation, location, Express Interest button
- "Viewing feed for: Sirsa & Haryana region" label at top

**Files:** `MapView.jsx`

---

### FEATURE 9 — Multiple Images (Profile + Cover Picture)

**Problem:** Profiles have a `photos[]` array but no distinction between profile pic and cover pic.

**Solution:**
- Add `coverPhoto` field to profiles (landscape wide banner image)
- Add `profilePhoto` field (main circular display image)
- In Onboarding (step 2): upload section with:
  - "Set Profile Picture" (square crop)
  - "Set Cover Photo" (landscape crop)
  - Gallery images (up to 8 photos)
- In ProfileDetailModal: show cover photo as header banner
- Photo permission system: Public / On Interest / Timed (24h)

**Files:** `mockProfiles.js`, `ProfileDetailModal.jsx`, `MandatoryOnboardingModal.jsx`

---

### FEATURE 10 — Follow Friends & Users (Optional Social Layer)

**Problem:** No way for users to follow someone they're interested in without sending a formal "interest".

**Solution (Optional Social):**
- `followedIds[]` in user state (like shortlist but public-optional)
- "Follow" button on profiles (not the same as Express Interest)
- Following creates a soft connection: get notified when they update profile/post
- Privacy: Followee can see who follows them, can block
- In MapView: show "Followed" badge on pins
- Accessible via "👥 Following" tab in profile

**Files:** `App.jsx`, `ProfileCard.jsx`, `ProfileDetailModal.jsx`

---

### FEATURE 11 — Achievements + Present Targets + Future Vision

**Problem:** Profile "About" section is a single paragraph. No structured career/life timeline.

**Solution:**
- Add to profile data:
  ```js
  achievements: [
    { year: '2021', title: 'Promoted to Senior Engineer', type: 'career' },
    { year: '2023', title: 'Completed MBA from IIM', type: 'education' },
  ],
  presentTargets: [
    'Building a sustainable SaaS product',
    'Running a half-marathon in 2025',
  ],
  futureVision: 'Looking to settle in Chandigarh, build a warm family home, travel twice a year, and grow professionally in tech.',
  ```
- In ProfileDetailModal: new "Life Story" tab with timeline UI
- Timeline cards: 🏆 Past | 🎯 Now | 🌟 Vision
- Milestones displayed as vertical timeline with icons

**Files:** `mockProfiles.js`, `ProfileDetailModal.jsx`

---

## Implementation Order (Sprint Plan)

### Sprint 1 (Day 1–2): Foundation Fixes
1. ✅ Fix map filters (Feature 2)
2. ✅ Notification images + links (Feature 3)
3. ✅ Rich profile listing (Feature 4)

### Sprint 2 (Day 3–4): Data & Search
4. Parent location search (Feature 5)
5. Multiple images (Feature 9)
6. Achievements / Life Story (Feature 11)

### Sprint 3 (Day 5–6): Auth & Access
7. Interest persistence + Subscription tokens (Feature 1)
8. Family account access (Feature 6)

### Sprint 4 (Day 7–8): Profile & Feed
9. User profile page (Feature 7)
10. Public map feed (Feature 8)

### Sprint 5 (Day 9–10): Social
11. Follow system (Feature 10)

---

*Last updated: October 2026*
