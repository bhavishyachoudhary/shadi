# 🪷 Bandhan Matrimony — Project Roadmap

> **Stack:** React + Vite (Frontend) · Node.js + Express (Backend API) · React-Leaflet (Map) · Vanilla CSS  
> **Repo:** https://github.com/bhavishyachoudhary/shadi  
> **Status:** Active Development — MVP Live  

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

## 🔧 PHASE 2 — Refinements (IN PROGRESS)

### Active Tasks
- [ ] **Sidebar left-panel UI polish** — make city search more prominent & attractive
- [ ] **"No profiles on page" empty state** — show when filters return zero results
- [ ] **Toast system upgrade** — replace fixed toast with animated slide-in/out
- [ ] **Shared photo sync** — ensure profile photo changes reflect instantly across modals
- [ ] **Map View sidebar scrollbar** — style custom scrollbar for dark glass panel

### Known Issues to Fix
| Issue | Severity | Fix Plan |
|---|---|---|
| Page blank on refresh with filter edge-case | Medium | Validate filter default state on mount |
| Map tile flicker on city switch | Low | Add loading skeleton over map |
| Sidebar `maxHeight: 820` hardcoded | Low | Replace with `calc(100vh - 70px)` |
| Floating chat z-index conflict on mobile | Low | Audit all z-index layers |

---

## 🚀 PHASE 3 — Backend Integration (NEXT 2–4 WEEKS)

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
- [ ] **Typing indicators** — Real-time typing dots in chat
- [ ] **Online/Away status** — Heartbeat-based presence
- [ ] **Push notifications** — New interest, visitor alerts

---

## 💡 PHASE 4 — Premium Features (4–8 WEEKS)

### Advanced Search & Matching
- [ ] **AI Match Score** — Weighted compatibility engine (religion, gotra, city, education, income)
- [ ] **Smart Suggestions** — "Today's Top 5 Matches for You"
- [ ] **Saved Searches** — Save filter presets with names
- [ ] **Profile Boost** — Paid feature: appear at top of search results for 24h
- [ ] **NRI Filter** — USA / UK / Canada / Australia NRI-specific search

### Map Enhancements
- [ ] **Cluster Markers** — Group nearby pins at low zoom levels
- [ ] **Heatmap Layer** — Density heatmap of profiles by region
- [ ] **Route to Profile** — "How far is this city from me?" distance card
- [ ] **State-level filter** — Filter by state (Haryana, Punjab, Rajasthan, etc.)

### Communication
- [ ] **Parivar Meet Video** — Embed Jitsi/Daily.co video call in modal
- [ ] **Read Receipts** — Double-tick in chat messages
- [ ] **Message Templates** — Pre-written icebreaker messages
- [ ] **Voice Note** — Short 30s voice message in chat

---

## 💰 PHASE 5 — Monetization (6–10 WEEKS)

### Membership Tiers (Implement Backend)
| Plan | Price | Features |
|---|---|---|
| Free | ₹0 | 5 profile views/day, no chat |
| Silver | ₹999/mo | 50 profiles, send interests |
| Gold | ₹2499/mo | Unlimited, chat, Parivar Meet |
| Diamond | ₹4999/mo | All + AI boost + NRI access |

### Payment Gateway
- [ ] **Razorpay integration** — Indian payment gateway (UPI, cards, netbanking)
- [ ] **Subscription management** — Auto-renewal, cancel anytime
- [ ] **GST invoice generation** — PDF invoice on payment
- [ ] **Referral rewards** — ₹500 off for referring a new member

---

## 📱 PHASE 6 — Mobile App (8–12 WEEKS)

### React Native / Expo
- [ ] **Expo setup** — Same codebase, cross-platform
- [ ] **Push notifications** — Firebase FCM for mobile alerts
- [ ] **Biometric login** — Face ID / Fingerprint login
- [ ] **Camera integration** — Take/crop profile photo in-app
- [ ] **GPS-based proximity** — "Profiles near you right now" live map
- [ ] **App Store + Play Store listing** — Production submission

---

## 🧹 PHASE 7 — Tech Debt & Performance

### Code Quality
- [ ] Split `MapView.jsx` (850 lines) → `MapContainer.jsx` + `ProfileSidebar.jsx` + `FilterPanel.jsx`
- [ ] Move all inline styles → CSS modules or `index.css` utility classes
- [ ] Add `PropTypes` or migrate to **TypeScript**
- [ ] Add unit tests (Vitest + React Testing Library) for core handlers
- [ ] Add E2E tests (Playwright) for auth and profile flow

### Performance
- [ ] **Lazy-load modals** — `React.lazy()` for ProfileDetailModal, GunaMilan, etc.
- [ ] **Image CDN** — Serve all photos via Cloudinary with `?w=400&q=80`
- [ ] **Virtualized profile list** — `react-window` for 1000+ profiles
- [ ] **Service Worker** — Cache map tiles for offline use

### SEO & PWA
- [ ] **React Helmet** — Dynamic `<title>` and `<meta>` per page
- [ ] **sitemap.xml + robots.txt** — Crawlable public profile pages
- [ ] **PWA manifest** — Installable on Android/iOS home screen
- [ ] **Lighthouse score ≥ 90** — Performance, Accessibility, SEO

---

## 📊 Metrics to Track (Post-Launch)

| Metric | Target |
|---|---|
| Profile registrations | 500 in Month 1 |
| Daily Active Users | 100 DAU by Month 2 |
| Express Interests sent/day | 200+ |
| Chat messages/day | 500+ |
| Premium conversions | 5% of registered users |
| Map sessions/day | 50+ |

---

## 🗓️ Timeline Summary

```
Sep 2026  → Phase 1 DONE (MVP Live)
Oct 2026  → Phase 2 Refinements + Phase 3 Backend Start
Nov 2026  → Phase 3 Complete (Real DB + Auth + Socket.io)
Dec 2026  → Phase 4 Premium Features + AI Match Score
Jan 2027  → Phase 5 Monetization (Razorpay)
Feb 2027  → Phase 6 Mobile App (React Native)
Mar 2027  → Phase 7 Tech Debt + Performance
Apr 2027  → Public Launch
```

---

## 👤 Author

**Bhavishya Choudhary**  
GitHub: [@bhavishyachoudhary](https://github.com/bhavishyachoudhary)  
Project: [github.com/bhavishyachoudhary/shadi](https://github.com/bhavishyachoudhary/shadi)

---

*Last updated: September 2026*
