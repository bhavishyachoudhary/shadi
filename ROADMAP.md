# 🪷 Bandhan Matrimony — Project Roadmap

> **Stack:** React + Vite (Frontend) · Node.js + Express (Backend API) · React-Leaflet (Map) · Vanilla CSS  
> **Repo:** https://github.com/bhavishyachoudhary/shadi  
> **Status:** Active Development — Sprint 1 Complete  

---

## ✅ PHASE 1 — Foundation (COMPLETED)

### Core Features Built
| Feature | Status | Notes |
|---|---|---|
| 🏠 Landing Hero + Navbar | ✅ Done | Dual CTA, gold-maroon luxury theme |
| 🗺️ Live Map View (Leaflet) | ✅ Done | Satellite + Street, custom SVG pins |
| 🔍 City Search with Autocomplete | ✅ Done | Sirsa, Haryana, Delhi NCR + 20+ cities |
| 📍 Multi-City Radius Circles | ✅ Done | One circle per selected city |
| 🎯 Opposite Gender Auto-Feed | ✅ Done | Groom sees Brides only, Bride sees Grooms |
| 📋 Profile Detail Modal | ✅ Done | Full bio, match score, Kundali |
| 💌 Express Interest (3-state) | ✅ Done | Sent → Accepted → Declined cycle |
| ⭐ Shortlist / Bookmark | ✅ Done | Local state, persistent per session |
| 📽️ Lifestyle Reels Modal | ✅ Done | Video thumbnail + play UI |
| 👨‍👩‍👧 Parivar Meet Scheduler | ✅ Done | Family video call booking flow |
| 📥 Dashboard Inbox | ✅ Done | Received/Sent interests, chat unlock |
| 💬 Floating Live Chat Widget | ✅ Done | Bottom-right dock, profile-aware |
| 🔔 Notifications Drawer | ✅ Done | Interest, visitor, parivar alerts |
| 👤 Recent Profile Visitors | ✅ Done | Same-day dedup, visit count |
| 🧮 36 Guna Milan Calculator | ✅ Done | Vedic Kundali matching |
| 🔐 Auth Page (Login/OTP/Signup) | ✅ Done | Simulated OTP flow |
| 🧾 Mandatory Onboarding Gate | ✅ Done | Un-skippable after login |
| 📝 Registration Wizard | ✅ Done | Multi-step, community/caste/gotra |
| 💳 Membership Plans Modal | ✅ Done | Free / Silver / Gold / Diamond |
| 🗑️ Delete Account Modal | ✅ Done | Permanent delete confirmation |
| 📡 Backend API (Node.js) | ✅ Done | Express server, CORS, basic routes |
| 🚀 GitHub Push | ✅ Done | `main` branch on GitHub |

---

## ✅ PHASE 2 — 11-Point Feature Sprint (Sprint 1 Complete — Oct 2026)

### From User Requirements (Oct 7, 2026 — 11 Features)

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | Interest persistence + Subscription tokens | ⏳ Sprint 2 | Planned |
| 2 | Fix map filters | ✅ Done | Parent location mode added |
| 3 | Notifications with profile photo + name + link | ✅ Done | Photos, match %, "View Profile →" |
| 4 | Rich listing: degree, designation, package, caste, gotra, location | ✅ Done | ProfileCard rebuilt |
| 5 | Parent location search (parent in Hisar, user works in Gurugram) | ✅ Done | Work vs Home toggle in MapView |
| 6 | Family account access + permissions | ⏳ Sprint 2 | Planned |
| 7 | Attractive user profile + personal feed | ⏳ Sprint 2 | Planned |
| 8 | Public feed based on map selection | ⏳ Sprint 2 | Planned |
| 9 | Multiple images (profile + cover picture) | ✅ Done | coverPhoto, galleryPhotos added to all profiles |
| 10 | Follow friends/users (optional social) | ⏳ Sprint 3 | Optional |
| 11 | Past achievements + present targets + future vision | ✅ Done | Life Story section in all profiles |

### Sprint 1 Changes Made (Oct 7, 2026)
- **NotificationsModal.jsx** — Rebuilt to show profile photos, names, match%, occupation, city, "View Profile →" link
- **mockProfiles.js** — Added: `parentLocation`, `coverPhoto`, `galleryPhotos`, `designation`, `degree`, `achievements[]`, `presentTargets[]`, `futureVision`
- **ProfileCard.jsx** — Now shows: designation (bold), degree, caste+community, gotra, parent location, income pill
- **MapView.jsx** — Added `searchMode` state: **Work City** vs **Parent Home** toggle that changes distance computation
- **App.jsx** — Notifications enriched with `match` type + `profiles` passed to NotificationsModal
- **IMPLEMENTATION_PLAN.md** — Created with full 11-feature spec

---

## 🔧 PHASE 2 — Sprint 2 (Upcoming — Oct 8–10)

### Planned
- [ ] **Interest persistence** — Save to `localStorage`, reload on refresh
- [ ] **Subscription access tokens** — Free/Silver/Gold/Diamond gating with locked overlays
- [ ] **Family access modal** — Add family member, set permissions (view/respond/full)
- [ ] **User profile page** — Cover photo + circular avatar + tabs (About/Feed/Achievements/Matches)
- [ ] **Public map feed** — Slide-in profile feed panel when region is selected on map

---

## 🚀 PHASE 3 — Backend Integration (Upcoming)

### Real Database & Auth
- [ ] **MongoDB Atlas** — Profiles, Users, Interests, Messages collections
- [ ] **JWT Auth** — Login → JWT token → Protected routes
- [ ] **bcrypt password hashing** — Secure credential storage
- [ ] **OTP via Twilio/MSG91** — Real SMS-based OTP verification
- [ ] **Email verification** — Nodemailer / SendGrid on registration

### Profile Management APIs
- [ ] `POST /api/auth/register` — Create new user account
- [ ] `POST /api/auth/login` — Authenticate + return JWT
- [ ] `GET /api/profiles` — Paginated, filterable profile feed
- [ ] `POST /api/profiles/:id/interest` — Send express interest
- [ ] `PATCH /api/profiles/me` — Update own profile fields
- [ ] `POST /api/upload/photo` — Cloudinary photo upload
- [ ] `GET /api/visitors` — Who visited my profile

### Real-Time Features (Socket.io)
- [ ] **Live chat** — Socket.io rooms per matched pair
- [ ] **Online/Away status** — Heartbeat-based presence
- [ ] **Push notifications** — New interest, visitor alerts

---

## 💡 PHASE 4 — Premium Features

### Advanced Search & Matching
- [ ] **AI Match Score** — Weighted compatibility engine (religion, gotra, city, education, income)
- [ ] **Smart Suggestions** — "Today's Top 5 Matches for You"
- [ ] **Saved Searches** — Save filter presets with names
- [ ] **Profile Boost** — Paid feature: appear at top of search results for 24h
- [ ] **NRI Filter** — USA / UK / Canada / Australia NRI-specific search

### Map Enhancements
- [ ] **Cluster Markers** — Group nearby pins at low zoom levels
- [ ] **Heatmap Layer** — Density heatmap of profiles by region
- [ ] **State-level filter** — Filter by state (Haryana, Punjab, Rajasthan, etc.)

---

## 💰 PHASE 5 — Monetization

### Membership Tiers
| Plan | Price | Features |
|---|---|---|
| Free | ₹0 | 5 profile views/day, no chat |
| Silver | ₹999/mo | 50 profiles, send interests |
| Gold | ₹2499/mo | Unlimited, chat, Parivar Meet |
| Diamond | ₹4999/mo | All + AI boost + NRI access |

- [ ] **Razorpay integration** — Indian payment gateway
- [ ] **Subscription management** — Auto-renewal, cancel anytime
- [ ] **GST invoice generation** — PDF invoice on payment

---

## 📱 PHASE 6 — Mobile App

- [ ] **Expo setup** — Cross-platform React Native
- [ ] **Push notifications** — Firebase FCM
- [ ] **GPS-based proximity** — "Profiles near you right now"
- [ ] **App Store + Play Store listing**

---

## 🗓️ Timeline Summary

```
Sep 2026  → Phase 1 DONE (MVP Live)
Oct 2026  → Phase 2 Sprint 1 DONE (Features 3,4,5,9,11) + Sprint 2 In Progress
Nov 2026  → Phase 3 Complete (Real DB + Auth + Socket.io)
Dec 2026  → Phase 4 Premium Features + AI Match Score
Jan 2027  → Phase 5 Monetization (Razorpay)
Feb 2027  → Phase 6 Mobile App (React Native)
Apr 2027  → Public Launch 🚀
```

---

## 👤 Author

**Bhavishya Choudhary**  
GitHub: [@bhavishyachoudhary](https://github.com/bhavishyachoudhary)  
Project: [github.com/bhavishyachoudhary/shadi](https://github.com/bhavishyachoudhary/shadi)

---

*Last updated: October 7, 2026 — Sprint 1 Complete*
