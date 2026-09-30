# Bandhan — Live Map Discovery Master Plan

**Version:** 3.0  
**Status:** Implementation-ready blueprint  
**Scope:** Premium map-first matrimony discovery, worldwide place/radius search, safe profile previews, full profile details, verified interest flow, and accepted-only real-time chat  
**Current stack:** React 19 + Vite + Leaflet; Node.js + Express + Sequelize + MySQL; Gemini AI  

### Implementation progress — Phase A / early Phase B / mock validation

**Completed:**

- Phase A runtime stabilization, UUID-safe identity handling, truthful trust/security copy, receiver-owned interest decisions, and accepted-only chat exposure.
- Real mobile OTP entry points using `/api/v1`; Google OAuth is intentionally disabled in the frontend until its production configuration is ready.
- Dedicated profile, match, visit, and interest routers with temporary clean legacy aliases.
- Shared API success/error envelope, liveness/readiness endpoints, non-destructive database startup, production secret/provider guards, and safe candidate DTOs without exact coordinates.
- A deterministic development fixture now supplies exactly **100 profiles**: 50 Brides and 50 Grooms across 50 locations (80 India, 20 international across 9 countries).
- Map development mode searches city/state/country and renders all 100 fixture profiles for load verification; production never enables this path.
- Development-only Bride/Groom demo login returns a backend-signed JWT without requiring OAuth or MySQL. The route returns 404 in production.
- An opt-in, idempotent Node seeder transactionally upserts the same 100 users, profiles, and partner preferences when a development MySQL connection is ready. Dry-run validation is available without a database.
- Production build, lint, backend syntax, fixture integrity, demo-auth HTTP/proxy, production guard, seed dry-run, and diff checks pass. Local Node MySQL readiness currently returns 503, so no database write was attempted.

**Mock verification commands:**

```powershell
# Validate the 100-record fixture without touching a database
Set-Location c:\project\shadi\backend_node
npm run seed:mock:dry

# Seed a connected NON-PRODUCTION Node/MySQL database (idempotent; no deletes)
$env:ALLOW_MOCK_SEED='true'
npm run seed:mock

# Only if development tables do not exist yet
$env:ALLOW_MOCK_SEED='true'
$env:MOCK_SEED_SYNC='true'
npm run seed:mock
```

**Next implementation slice:** versioned migrations and visibility/privacy fields, real profile/session bootstrap in the frontend, then the provider-neutral Google Places service and privacy-safe map-search endpoint. Google OAuth can remain deferred while demo auth is active.

---

## 1. Executive decision

Bandhan should become a **map-first matrimony product**, not a standard profile grid with a map added later. A user should be able to open the app, search any city/state/country, select a radius, see every **eligible and privacy-safe candidate** represented on the map, preview a profile by pointer/focus, open complete authorized details, send an interest, and chat only after the recipient accepts.

The project began as a strong visual prototype rather than an integrated application. The original gaps below are retained as historical planning context; the progress section above is authoritative:

- Frontend auth and identity were simulated; backend-signed development demo auth and real OTP entry points now exist.
- Profiles, interests, visitors, notifications, premium state, and chat began as local mock state; the 100-profile fixture is now explicit development-only data.
- The map began with a small hardcoded city list; development now shares a 50-location catalog while Google Places remains pending.
- Node/MySQL contains useful auth, profile, interest, visit, message, and Gemini foundations; live profile state still needs frontend integration.
- Persistent chat REST/realtime delivery is not implemented yet.
- Migrations, privacy-safe public locations, Google Places, and production deployment remain upcoming phases.

### Chosen defaults

These decisions remove ambiguity and let implementation start:

1. **Node/Express + MySQL is the only authoritative backend.** Flask is not part of the production application.
2. **API contracts are versioned under `/api/v1`.** UUIDs remain strings everywhere.
3. **Google Places is the primary global search provider**, accessed through a server-side provider-neutral service. A configurable fallback (Photon/Nominatim or another approved provider) prevents vendor lock-in and supports local development.
4. **Map visibility means all eligible candidates**, not every database account. Eligibility is server-defined and includes active, approved, complete, discoverable, unblocked, age-valid, and policy-compatible accounts.
5. **Public map locations are coarse and stable.** Exact residence/GPS coordinates are never returned. The public point is locality/area-based with deterministic 1–3 km jitter.
6. **Up to five search centers** are supported. Results are the deduplicated union of centers and carry the nearest-center distance.
7. **Chat is available to all users after mutual connection/accepted interest in the first production version.** Premium styling is for everyone. Entitlements are designed now so usage limits or paid tiers can be added later without rewriting chat.
8. **Socket.io is preferred**, with long-polling fallback. Production hosting must pass a realtime capability check before this phase ships.
9. **Simple UI wins over feature density.** Default map controls are place search, selected locations, radius, result count, and one Filters button. Everything else is progressive disclosure.
10. **Mobile is a first-class experience.** Hover has an equivalent focus/tap interaction and sidebars become bottom sheets.

---

## 2. User promise and product principles

### Core promise

> “Search meaningful matches anywhere in the world, understand who is nearby without compromising anyone’s safety, and start a real conversation only after both sides agree.”

### Principles

- **Consent before communication:** sending interest does not unlock chat; accepting it does.
- **Privacy before precision:** location accuracy must never identify a home, workplace, or live movement.
- **Premium means calm and trustworthy:** fewer controls, clearer hierarchy, excellent typography, restrained animation, and accurate security claims.
- **Map and list are one search:** every map state has an accessible synchronized results list.
- **Backend is policy authority:** gender/preference rules, visibility, photo access, blocks, interests, and chat cannot be bypassed by client requests.
- **Truthful UI:** do not claim end-to-end encryption, government-ID verification, 256-bit protection, online presence, or AI accuracy unless implemented and evidenced.

---

## 3. Current project assessment

### Reusable foundations

| Capability | Existing implementation | Reuse plan |
|---|---|---|
| Leaflet map, satellite/street layers, custom pins | `src/components/MapView.jsx` | Keep Leaflet and visual language; split component |
| Radius circles and Haversine display | `MapView.jsx`, `src/utils/distance.js` | Keep client calculation for presentation only; server owns filtering |
| Profile details and actions | `ProfileDetailModal.jsx`, MapView sidebar | Reuse UI after API DTO/privacy integration |
| Auth endpoints and JWT middleware | `backend_node/routes/auth.js`, `middleware/authMiddleware.js` | Harden and connect to frontend |
| User/Profile/Preference/Interest/Visit/Message models | `backend_node/models/index.js` | Migrate and extend; stop schema auto-alter |
| Gemini match, smart search, chat starter, profile tips | `backend_node/routes/ai.js` | Wire into UI behind validation/consent |
| Inbox and polished chat UI | `DashboardInbox.jsx`, `FloatingChatWidget.jsx` | Keep presentation; replace all simulated data |
| Membership presentation | `MembershipPlans.jsx` | Keep as future entitlement display, not fake activation |
| GoDaddy deployment notes | `GODADDY_HOSTING_GUIDE.md` | Rewrite after target topology is proven |

### Mandatory P0 defects

These are not optional refinements:

1. `App.jsx` renders `AuthPage` without importing it.
2. `handleRegisterSuccess` calls undefined `setCurrentUser`.
3. Frontend users receive random IDs and fake JWTs instead of backend identities.
4. Interest sender can cycle its own request into accepted/declined; only the receiver may decide.
5. Accepting an incoming request removes a local row but does not create an accepted connection.
6. Profile/interest IDs are converted with `Number(id)`, breaking real UUIDs.
7. `App.jsx` and `MapView.jsx` maintain conflicting city/radius state and recompute different results.
8. One profile router is mounted under `/profiles`, `/matches`, `/visits`, and `/interests`; its internal paths conflict and `/:id` can capture static routes.
9. Profile list/detail responses expose exact coordinates and too much profile data.
10. Eligibility does not enforce approval, completeness, discoverability, self-exclusion, or blocks.
11. Verification meaning is inconsistent (`Profile.isVerified` vs email/mobile verification) while UI implies government verification.
12. `distance.js` treats latitude/longitude `0` as absent, breaking equator/prime-meridian places.
13. Public `/uploads` bypasses future photo-privacy rules.
14. `sequelize.sync({ alter: true })`, Node SQL, and Flask SQL are divergent schema authorities.
15. UI claims encrypted chat although no end-to-end encryption exists.
16. GoDaddy topology, API prefixes, ports, and persistent WebSocket support are inconsistent/unverified.

---

## 4. Target user journeys

### 4.1 New user

1. Register with email/mobile/Google.
2. Verify at least one contact method.
3. Complete mandatory profile and choose a **public location area** using Places search.
4. Choose photo privacy and map discoverability.
5. Enter map discovery with preference-compatible results.

### 4.2 Global multi-location discovery

1. Search “Sirsa, Haryana”, “Toronto, Canada”, “California, USA”, or a country.
2. Select up to five locations.
3. Choose shared radius presets: 25, 50, 100, 250, 500 km, or Region.
4. Map moves to selected bounds and returns clustered eligible candidates.
5. Results list and map update together; stale requests cancel.
6. Save the search for reuse (P2 feature, schema allowed in P1).

### 4.3 Profile discovery

- Desktop pointer/focus on pin → compact authorized preview.
- Mobile tap → preview bottom sheet.
- Click/Enter/View profile → authorized full details.
- Photo may be public, blurred, hidden, or request-only.
- Full view records one visit event with daily aggregation.

### 4.4 Interest and chat

1. Sender sends one pending interest with optional respectful message.
2. Recipient accepts or declines.
3. Acceptance transaction creates/unlocks one conversation.
4. Both users can chat; before acceptance all history/send/socket joins return 403.
5. Blocking immediately removes map/detail access and revokes chat.

---

## 5. Information architecture and premium UX

### Desktop layout

- **Top navigation:** logo, Discover, Interests, Messages, Visitors, account.
- **Full-bleed map:** occupies the main viewport.
- **Compact search dock (top-left):** global place search, selected location chips, radius, Filters.
- **Result summary (top-right):** count, search area, sort.
- **Profile rail (right):** collapsible synchronized list; selected profile replaces list with detail summary.
- **Pin preview:** 280–320 px card with photo, verification, age, occupation, coarse area, match score, distance, interest state.
- **No permanent legend:** use a small “Map key” disclosure to reduce noise.

### Mobile layout

- Full-screen map below compact navbar.
- Sticky top place-search field.
- Bottom controls: Results, Radius, Filters, Recenter.
- Tap marker → draggable bottom sheet at peek/half/full heights.
- Results button → virtualized list sheet.
- Chat → full-screen route/sheet, never a 420 px floating desktop widget.
- Respect safe-area insets and virtual keyboard.

### Visual system

- Keep the maroon/gold identity, but use gold only for high-value actions and selected states.
- Neutral warm surfaces, dark map overlays, 8/12/16/24 spacing rhythm.
- Typography hierarchy: display serif only for brand/major headings; readable sans-serif for all controls and data.
- 44×44 px minimum targets; non-color status labels and icons.
- Skeletons for map/list/detail; specific empty/error/offline states.
- Honor `prefers-reduced-motion`; avoid continuous selected-pin pulse for reduced-motion users.

### Progressive filters

**Always visible:** place, radius, result count.  
**Quick chips:** Verified, Online recently, NRI.  
**Advanced sheet:** age range, religion, community/mother tongue, caste (optional), education, occupation, income, diet, manglik, relocation, profile created by, photo availability, last active, sort.  

Sensitive filters should be optional, clearly explained, and reviewed for regional policy implications.

---

## 6. Eligibility, privacy, and authorization rules

### 6.1 Map eligibility predicate

A profile appears only when all are true:

- User is active and adult.
- Profile is complete and moderation-approved.
- `discoverability = visible` and `showOnMap = true`.
- Viewer is authenticated (recommended for member pins).
- Profile is not the viewer.
- Neither party has blocked the other.
- Candidate satisfies configured gender/preference policy.
- Candidate passes search filters.
- A valid public coarse location exists.
- Regional/legal policy permits display.

“Show all users” therefore means **all eligible candidates in the current search**, not anonymous access to every account.

### 6.2 Public location model

Store:

- Provider place ID.
- Locality, admin area, country code, display label.
- Provider centroid and bounds.
- Optional private coordinate only when genuinely required and consented.
- Stable public map point generated from locality centroid + keyed deterministic jitter.

Rules:

- Never return exact residence/work/live GPS.
- Jitter is stable so repeated requests cannot be averaged.
- Display distance as approximate (`~12 km`) and area as coarse locality.
- “Use my location” must convert browser GPS to a selected/coarse area and discard raw coordinates unless separately consented.
- Location sharing inside accepted chat is an explicit message action, never automatic.

### 6.3 Photo access policy

Policies:

- `public`
- `blur_until_accepted`
- `accepted_only`
- `request_only`
- `hidden`

The server returns an authorized variant or placeholder; it never returns an original URL and asks the frontend to hide it. Photos should live in private/object storage with signed or proxied variants, EXIF removed, image re-encoded, and content moderated.

### 6.4 Verification semantics

Separate badges:

- Email verified
- Mobile verified
- Photo verified
- Identity verified (only after a real process)
- Profile moderated

Never combine email/mobile into “Government ID verified.”

---

## 7. Target architecture

```text
Browser / React
  ├─ Auth/session bootstrap
  ├─ Global place autocomplete
  ├─ Map query state (one source of truth)
  ├─ Leaflet + bounded cluster payload
  ├─ Accessible synchronized profile list
  ├─ Profile detail / interests
  └─ Conversation REST + Socket.io client
          │
          ▼
Node / Express / API v1
  ├─ Auth and session service
  ├─ Place provider adapter + cache + quota
  ├─ Profile visibility policy service
  ├─ Geospatial search and cluster service
  ├─ Profile/photo authorization service
  ├─ Interest transaction service
  ├─ Conversation/message service
  ├─ Realtime gateway
  ├─ AI service adapter
  ├─ Moderation/block/report service
  └─ Entitlement policy service
          │
          ├─ MySQL (migrations, spatial indexes)
          ├─ Private image/object storage
          ├─ Google Places/Geocoding
          └─ Gemini (consented/minimized profile data)
```

### Frontend state

- One `DiscoverySearchState` owns centers, radius, bounds, filters, sort, selected profile, and result mode.
- Server state uses a query library or focused hooks with request cancellation, cache keys, retries, and explicit loading/error state.
- URL query parameters encode shareable non-sensitive search state.
- Do not retain full auth authority or sensitive profile data in localStorage.

### Backend layering

`route → validation → authentication → authorization/policy → service → repository/model → DTO serializer`

Do not return Sequelize models directly. Every endpoint returns an explicit DTO.

---

## 8. API v1 contract

### Auth and current user

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/otp/request`
- `POST /api/v1/auth/otp/verify`
- `GET /api/v1/auth/google`
- `GET /api/v1/auth/google/callback`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/me`
- `PATCH /api/v1/me/profile`
- `PATCH /api/v1/me/privacy`
- `DELETE /api/v1/me`

Preferred authentication: Secure, HttpOnly, SameSite cookies with short access and rotating refresh sessions. If bearer JWT remains, keep access tokens short-lived and out of persistent browser storage.

### Places

- `GET /api/v1/places/autocomplete?q=&sessionToken=&locale=&countryBias=`
- `GET /api/v1/places/:providerPlaceId?sessionToken=`

Provider-neutral response:

```json
{
  "id": "provider-place-id",
  "label": "Toronto, Ontario, Canada",
  "type": "locality",
  "center": { "lat": 43.6532, "lng": -79.3832 },
  "bounds": { "south": 43.58, "west": -79.64, "north": 43.86, "east": -79.12 },
  "countryCode": "CA"
}
```

Autocomplete is debounced, abortable, keyboard accessible, rate-limited, cost-capped, and uses provider session tokens. Country/state results use bounds; radius applies only when explicitly selected.

### Map search

`POST /api/v1/map/search`

```json
{
  "centers": [
    { "placeId": "abc", "lat": 29.532, "lng": 75.0318, "radiusKm": 100 }
  ],
  "viewport": { "south": 20, "west": 70, "north": 35, "east": 85 },
  "zoom": 7,
  "filters": {
    "ageMin": 24,
    "ageMax": 34,
    "verifiedOnly": false,
    "religion": [],
    "motherTongue": [],
    "isNri": null
  },
  "sort": "recommended",
  "cursor": null
}
```

Low-zoom response can contain clusters; high-zoom response contains safe pins:

```json
{
  "summary": { "total": 842, "inSearchArea": 418 },
  "features": [
    {
      "type": "pin",
      "profileId": "uuid-string",
      "publicPoint": { "lat": 29.54, "lng": 75.02 },
      "preview": {
        "displayName": "A. Sharma",
        "age": 28,
        "area": "Sirsa, Haryana",
        "occupation": "Software Engineer",
        "photo": { "mode": "blurred", "url": "/api/v1/media/..." },
        "verification": ["mobile", "photo"],
        "matchScore": 91,
        "distanceKmApprox": 12,
        "interestStatus": "none"
      }
    },
    {
      "type": "cluster",
      "clusterId": "cluster-token",
      "point": { "lat": 29.6, "lng": 75.1 },
      "count": 126
    }
  ],
  "nextCursor": null
}
```

Rules: max five centers, server validates ranges, deduplicates profiles, computes nearest center, caps result size, supports antimeridian, and never returns private points.

### Profiles and visits

- `GET /api/v1/profiles/:id` — authorized full DTO.
- `POST /api/v1/profiles/:id/visits` — idempotent/daily-aggregated visit.
- `POST /api/v1/profiles/:id/photo-request`
- `POST /api/v1/profiles/:id/shortlist`
- `DELETE /api/v1/profiles/:id/shortlist`

### Interests

- `POST /api/v1/interests` — sender creates pending interest.
- `GET /api/v1/interests?box=received|sent&status=`
- `POST /api/v1/interests/:id/accept` — receiver only.
- `POST /api/v1/interests/:id/decline` — receiver only.
- `POST /api/v1/interests/:id/cancel` — sender may cancel pending only.

Use idempotency keys and a unique pair/pending constraint. Accepting runs in a transaction and creates/unlocks a conversation exactly once.

### Conversations/messages

- `GET /api/v1/conversations`
- `GET /api/v1/conversations/:id/messages?cursor=&limit=`
- `POST /api/v1/conversations/:id/messages`
- `POST /api/v1/conversations/:id/read`

Socket events:

- client: `conversation:join`, `message:send`, `typing:start`, `typing:stop`, `message:read`
- server: `message:created`, `message:delivered`, `message:read`, `typing:changed`, `presence:changed`, `conversation:revoked`

Every HTTP action and socket join/send reloads conversation authorization. A client-provided room ID is never trusted.

### Safety and settings

- `POST /api/v1/profiles/:id/block`
- `DELETE /api/v1/profiles/:id/block`
- `POST /api/v1/profiles/:id/report`
- `GET/PATCH /api/v1/me/privacy`
- `GET /api/v1/me/entitlements`

---

## 9. Database and migration plan

Use migrations as the only schema source of truth. Do not deploy `sync({ alter: true })`. Keep generated schema documentation, but do not execute Flask SQL against this database.

### Extend users/profiles

- User: moderation status, deleted/deactivated timestamps, terms/privacy consent versions.
- Profile: discoverability, showOnMap, photoPrivacy, placeId, locality/admin/country codes, provider centroid/bounds, stable public point, location precision policy, last active, profile moderation status.
- Replace free-text annual income as filter authority with normalized range/category fields while retaining display text.

### New entities

- `conversations`: id, participantAId, participantBId, unlockedByInterestId, status, timestamps; canonical unordered unique pair.
- `messages`: conversationId FK, senderId, type, body/file reference, clientMessageId, sent/delivered/read timestamps, moderation state.
- `blocks`: blockerId, blockedId, reason, timestamps; unique pair.
- `reports`: reporterId, targetId, category, details, status, moderator audit.
- `photo_requests`: requester, profile, status.
- `shortlists`: owner, profile, unique pair.
- `privacy_settings` or profile columns for early release.
- `sessions/refresh_tokens` if cookie sessions are adopted.
- `plans`, `subscriptions`, `entitlements`, `usage_ledger` as P2 extensibility.
- `saved_searches` and `notification_preferences` as P2.
- `audit_events` for sensitive decisions.

### Critical indexes/constraints

- Spatial index on public point (MySQL-compatible SRID/POINT approach after version verification).
- Eligibility/filter composites around active/moderated/discoverable/gender/country.
- Unique interest pair according to retry policy.
- Unique canonical conversation participant pair.
- Message index `(conversation_id, created_at, id)`.
- Unique `(visitor_id, profile_id, visit_date)` (already conceptually present).
- Blocks in both lookup directions.
- Foreign keys and cascading/anonymizing deletion behavior explicitly defined.

---

## 10. Map search implementation

### Query behavior

- Search is server-side, not an in-browser scan of all profiles.
- At low zoom, request cluster summaries; at high zoom, request bounded safe pins.
- Debounce map movement 250–400 ms and cancel stale requests.
- Cache by rounded viewport/zoom/filter hash for short periods without leaking viewer-specific authorization.
- Deduplicate multi-center results and return nearest center/distance.
- Preserve selected profile while panning if still authorized.
- Never make radius color an entitlement decision on the client.

### Clustering choice

Start with Supercluster-compatible clustering. Client clustering is acceptable for a capped payload (for example ≤2,000 safe pins). Move clustering to the server when density or payload targets require it. Do not download the complete member table.

### Tile provider

Development may continue with OSM/Esri endpoints, but production must use a provider/plan whose terms, attribution, traffic capacity, caching, and token restrictions are suitable. Tile availability is independent of Google Places; using Google autocomplete does not require rewriting the Leaflet map.

### Search modes

- **Radius:** one or more point centers + distance.
- **Region:** state/country provider bounds or normalized region code.
- **Current area:** viewport search.
- **Near me:** user-authorized coarse area, not continuous live tracking.

---

## 11. Real-time chat design

### Unlock rule

Acceptance is necessary and sufficient in v1. Premium plans may later add quotas, but no plan bypasses acceptance.

### Acceptance transaction

1. Lock/fetch pending Interest.
2. Confirm authenticated user is receiver.
3. Confirm users remain eligible and unblocked.
4. Set interest accepted.
5. Create or unlock canonical Conversation.
6. Commit.
7. Publish notification/conversation event.

### Message lifecycle

- Client creates `clientMessageId` for retries.
- Server validates conversation, content/type/size/rate, stores once, emits created.
- Delivery means receiving client/server session acknowledged it.
- Read means recipient opened/acknowledged the conversation.
- Reconnect fetches cursor-paginated history.
- Offline recipients receive an in-app notification; push/email can come later.

### Attachments

P1 supports text only unless secure storage/scanning is ready. Image/file/location/voice UI must remain disabled until backend authorization, content validation, private storage, signed delivery, malware scanning, and retention are implemented.

### AI icebreakers

Reuse `/api/ai/chat-starters`, but only after a connection is unlocked or while composing an interest message. Send minimized authorized profile fields, label suggestions as AI-generated, let the user edit before sending, and rate-limit requests.

---

## 12. Security, safety, and compliance baseline

- Secure auth cookies/session rotation or hardened short-lived bearer tokens.
- CSRF protection for cookie-authenticated mutations.
- Exact CORS origins; trusted-proxy configuration; no production default secrets.
- OTP hashing, expiration, atomic consumption, attempt/resend limits, provider failure handling.
- OAuth state/PKCE/account-linking; no tokens or user JSON in query strings.
- Input validation using a schema library on every endpoint.
- Authorization policy reused by map, profile, interest, photo, chat, AI, and media endpoints.
- Upload MIME sniffing, re-encoding, EXIF removal, private storage, moderation.
- Rate limits per identity/IP/action, not only global route limits.
- Block/report/moderation and emergency conversation revocation.
- Data export, account deactivation, deletion/anonymization, and retention rules.
- Explicit consent/minimization before sending matrimonial profile data to Gemini.
- Secrets restricted by domain/IP/API, never committed or returned to browser.
- Remove `/api/admin/schema` from public production routes.
- Do not claim E2E encryption unless client-side key management is actually built.

---

## 13. Accessibility requirements

Target WCAG 2.2 AA.

- Places search follows ARIA combobox/listbox behavior with keyboard selection.
- Every marker action is also available in a keyboard-readable synchronized results list.
- Hover preview also opens on focus; mobile uses tap.
- Dialogs/sheets use semantic roles, focus trap, Escape/close, and restore focus.
- Range controls have programmatic labels and displayed values.
- Toasts use an appropriate live region.
- Status is never color-only.
- Contrast meets AA; touch targets ≥44 px.
- Reduced motion supported.
- Map instructions and non-map alternative available.

---

## 14. Performance and reliability targets

### Initial SLOs

- Warm map search API p95 ≤500 ms for representative regional queries.
- Place suggestions p95 ≤350 ms excluding provider outage.
- Profile detail p95 ≤400 ms.
- Message send acknowledgement p95 ≤500 ms in-region.
- Map interaction maintains perceived 50–60 fps on target mid-range devices.
- Initial map/list payload target ≤300 KB compressed.
- App availability target 99.9% after production stabilization.

### Scale validation

- Seed at least 10,000 eligible profiles across India and international cities.
- Validate dense metro clusters and sparse rural/global areas.
- Load test map search, place proxy quotas, interest idempotency, conversation authorization, and socket reconnect.
- Add request IDs, structured logs, API metrics, database query timing, provider latency/cost metrics, and error tracking.

---

## 15. Delivery phases and dependencies

### Phase A — Stabilize prototype (P0, 2–3 days)

**Goal:** remove runtime defects and misleading behavior before integration.

- Import `AuthPage`; remove undefined `setCurrentUser` path.
- Stop sender-side interest status cycling.
- Remove UUID numeric coercion.
- Remove fake unrestricted chat launcher/demo contacts in production mode.
- Remove false E2E/government verification claims.
- Fix zero-coordinate checks.
- Document Node as the sole backend.

**Exit gate:** current frontend builds/lints, auth/register actions do not crash, and demo mode is clearly isolated.

### Phase B — Backend normalization + migrations (P0, 4–6 days)

**Goal:** one safe, testable `/api/v1` backend.

- Split routers: auth, profiles, map, places, interests, visits, conversations, safety, AI.
- Add validation/error/DTO conventions.
- Add migrations and initial schema corrections.
- Add eligibility and authorization services.
- Remove `sync alter` and public schema endpoint in production.
- Add readiness separate from liveness.

**Depends on:** Phase A decisions.  
**Exit gate:** contract/integration tests prove route paths, UUID behavior, eligibility, and authorization.

### Phase C — Real auth/profile integration (P0, 4–6 days)

**Goal:** frontend uses real identity and profiles.

- Add API client/session bootstrap.
- Connect email/OTP/Google flows.
- Connect onboarding/profile update/photo privacy.
- Replace `mockProfiles` in production path.
- Introduce explicit DTO adapters/query hooks.

**Depends on:** Phase B.  
**Exit gate:** refresh restores real session; logout/revocation works; map shell receives safe DB profiles.

### Phase D — Global place and multi-center search (P1, 4–6 days)

**Goal:** any city/state/country worldwide.

- Provider-neutral Places service, server proxy, rate/cost limits, session tokens.
- Accessible search UI; up to five locations.
- Shared/per-center radius model and region mode.
- Consolidate duplicate App/Map search state.
- Wire existing AI smart search as optional secondary input, with validation/geocoding.

**Depends on:** Phase B/C and Google/fallback credentials.  
**Exit gate:** Toronto, California, Punjab, Sirsa, and international diacritic cases resolve correctly.

### Phase E — Privacy-safe scalable map (P1, 5–7 days)

**Goal:** all eligible candidates represented safely and smoothly.

- Public-location migration and deterministic jitter service.
- Spatial/viewport map endpoint.
- Clustering, request cancellation, bounded payloads.
- Pointer/focus hover card; click full profile; mobile bottom sheet.
- Server-authorized photo variants, verified labels, blocks/discoverability.
- Loading, empty, provider-error, offline, and retry states.

**Depends on:** Phase D and private media strategy.  
**Exit gate:** 10k seed test, no private coords/media in network payload, mobile/keyboard flows pass.

### Phase F — Correct interests + accepted-only chat (P1, 6–9 days)

**Goal:** persisted, authorized communication.

- Interest API with receiver-only accept/decline and idempotency.
- Conversation migration + acceptance transaction.
- REST history/send and authenticated Socket.io/polling.
- Refactor inbox/chat onto backend; presence/read/typing only from real events.
- Block/deactivate/revoke behavior.
- AI icebreakers with user edit/consent.

**Depends on:** real auth, migration layer, and hosting realtime decision.  
**Exit gate:** two-account test proves 403 before accept, realtime persistence after accept, immediate revoke on block.

### Phase G — Premium UI, safety, accessibility (P1/P2, 4–7 days)

**Goal:** polished launch experience for every user.

- Simplify search dock/filters/results rail.
- Mobile bottom sheets and full-screen chat.
- Photo request, report/block, privacy settings.
- Complete WCAG semantics/focus/contrast/reduced motion.
- Entitlement service returns capabilities, even if all accepted chat is enabled initially.

**Depends on:** D–F.  
**Exit gate:** usability walkthrough, 320 px mobile, keyboard-only flow, Lighthouse accessibility ≥90 and no critical axe issues.

### Phase H — Production hardening and staged rollout (P1, 4–6 days)

- Prove host WebSocket/polling behavior or move realtime API to a capable service.
- Staging environment, migration release step, backups and restore test.
- CSP, secure cookies, CORS, secret restrictions, logs/alerts.
- Load/security/privacy review.
- Feature flags: live API, places, map clusters, hover, chat.
- Internal → limited users → 25% → 100% rollout with rollback criteria.

**Exit gate:** operational checklist and acceptance suite pass in staging and production-like proxy.

### Estimated delivery

- **Usable real global map MVP:** Phases A–E, approximately 4–6 focused weeks for one experienced full-stack developer.
- **Accepted real-time chat + launch polish:** Phases F–H, another 3–5 weeks.
- Parallel backend/frontend work can reduce elapsed time, but privacy/auth foundations must not be skipped.

---

## 16. File-level implementation map

### Refactor existing frontend

- `src/App.jsx`: reduce orchestration; remove mock business state; add route/page composition.
- `src/context/AuthContext.jsx`: real session state only.
- `src/components/AuthPage.jsx`: real API flows.
- `src/components/MapView.jsx`: split into map shell; one discovery state.
- `src/components/SearchFilters.jsx`: advanced sheet, server filters.
- `src/components/ProfileDetailModal.jsx`: authorized DTO + real AI unavailable state.
- `src/components/DashboardInbox.jsx`: server interests/conversations.
- `src/components/FloatingChatWidget.jsx`: socket/REST; responsive presentation.
- `src/components/MembershipPlans.jsx`: server capabilities; no toast-based upgrade.
- `src/components/DeleteAccountModal.jsx`: real deactivation/deletion workflow.
- `src/utils/distance.js`: robust null/zero handling; display use only.

### New frontend modules

- `src/api/client.js`, `auth.js`, `profiles.js`, `map.js`, `places.js`, `interests.js`, `conversations.js`
- `src/hooks/useSession.js`, `useMapSearch.js`, `usePlaceAutocomplete.js`, `useConversation.js`
- `src/components/map/DiscoveryMap.jsx`
- `src/components/map/PlaceSearch.jsx`
- `src/components/map/MultiCenterControl.jsx`
- `src/components/map/ClusterLayer.jsx`
- `src/components/map/ProfilePin.jsx`
- `src/components/map/PinPreview.jsx`
- `src/components/map/ProfileResultsRail.jsx`
- `src/components/map/MobileProfileSheet.jsx`
- `src/components/map/DiscoveryFilters.jsx`
- `src/components/common/AsyncState.jsx`, `ToastRegion.jsx`, `Modal.jsx`

### Refactor backend

- `backend_node/server.js`: API v1 mounts, HTTP server/socket attachment, health/readiness, production safety.
- `backend_node/routes/profiles.js`: profile-only routes and DTOs.
- `backend_node/routes/auth.js`: session/security hardening.
- `backend_node/routes/ai.js`: service adapter, validation, consent/minimization.
- `backend_node/models/index.js`: split models over time; associations/constraints.
- `backend_node/.env.example`: places, session, socket, storage, observability settings.

### New backend modules

- `routes/map.js`, `places.js`, `interests.js`, `visits.js`, `conversations.js`, `privacy.js`, `safety.js`, `entitlements.js`
- `services/profileVisibilityService.js`
- `services/publicLocationService.js`
- `services/mapSearchService.js`
- `services/placeService.js`
- `services/interestService.js`
- `services/conversationService.js`
- `services/photoAuthorizationService.js`
- `middleware/validate.js`, `requireProfileAccess.js`, `requireConversationAccess.js`, `requireEntitlement.js`
- `socket/chatSocket.js`
- `migrations/*`, `seeders/*`

---

## 17. Test strategy

Although the prototype currently has no tests, production implementation requires them.

### Unit

- Distance and antimeridian calculations.
- Stable jitter determinism/bounds.
- Eligibility/photo/privacy policies.
- Canonical participant pair and conversation authorization.
- Interest state transitions and entitlement decisions.
- DTO serializers never expose forbidden fields.

### API integration

- Registration/session/profile lifecycle.
- Map eligibility, multi-center dedupe, radius boundaries, pagination/clusters.
- Sender cannot accept; receiver can; retries are idempotent.
- Block/discoverability removes profile across all endpoints.
- Chat history/send forbidden before accept and after revoke.

### Realtime

- JWT/session handshake rejection.
- Unauthorized room joins.
- Persist/emit ordering, duplicate client IDs, reconnect/history.
- Typing/read/presence and block revocation.

### UI/E2E

- Search/select/remove five locations.
- Radius and region modes.
- Desktop pointer/focus preview and click details.
- Mobile marker → bottom sheet.
- Photo privacy variants.
- Two-user interest → accept → chat.
- Keyboard and screen-reader-oriented navigation.
- Provider/API/offline/error states.

### Performance/security

- 10k+ profile spatial dataset.
- Dense cluster query/load tests.
- Rate-limit and quota tests.
- Authorization matrix and media URL leakage inspection.
- Dependency/security scan and production headers review.

---

## 18. Analytics and product measurement

Track privacy-safe events, never exact user coordinates or message content:

- `discovery_opened`
- `place_searched`, `place_selected` (normalized region category; minimize raw query retention)
- `radius_changed`, `filter_applied`
- `cluster_opened`, `pin_previewed`, `profile_opened`
- `interest_sent`, `interest_accepted`, `interest_declined`
- `conversation_opened`, `message_sent` (no content)
- `photo_request_sent`
- `block_created`, `report_created`
- Search zero-result and provider-error rate

Primary funnel: map session → profile view → interest sent → accepted → first message.  
Safety metrics: block/report rate, unauthorized-access denials, location/privacy incidents.  
Reliability metrics: map latency, provider latency/cost, socket connection/reconnect rate, message failures.

---

## 19. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Exact map pins enable stalking | Critical | Mandatory stable coarse location, server-only private data |
| “All users” causes huge payload | High | Eligibility + viewport + clusters + caps + spatial indexes |
| Google costs/quota outage | High | Proxy, sessions, limits, monitoring, provider adapter/fallback |
| Shared hosting cannot sustain sockets | High | Capability test before build; polling fallback or move realtime service |
| Mock/backend field divergence | High | API DTOs, UUID strings, adapters, contract tests |
| Interest/chat bypass | Critical | Transactional acceptance and authorization on every HTTP/socket action |
| Public photo URLs bypass privacy | Critical | Private media variants, server authorization, signed/proxied delivery |
| Schema drift/data loss | High | Migrations only, backups, staging migration rehearsal |
| UI remains too dense | Medium | Progressive disclosure and mobile-first usability checks |
| False trust claims | High | Truthful labels and evidence-based verification/security copy |
| AI leaks sensitive data or hallucinates | High | Consent, minimization, validation, graceful unavailable state, no fabricated scores |

---

## 20. Definition of done

The feature is done only when all are true:

### Real integration

- No production path uses `mockProfiles`, fake JWTs, timed OTP, fabricated AI scores, demo interests, demo contacts, auto-replies, or toast-only upgrades.
- Runtime route paths match documented `/api/v1` contracts.
- UUIDs remain strings across UI/API/database.

### Map/search

- Any supported global city/state/country can be searched and selected.
- Up to five centers work with deduplicated radius/region results.
- All eligible candidates in the returned search are represented by pin or cluster.
- Map movement is smooth with 10k seed data and bounded payloads.
- Pointer/focus preview shows image + safe details; click/Enter opens authorized complete details; mobile has an equivalent tap/sheet flow.

### Privacy/safety

- Network inspection never exposes exact/private coordinates or unauthorized media.
- Discoverability, photo policies, blocks, deactivation, and moderation apply consistently to map, detail, interest, and chat.
- Verification/security wording is accurate.

### Accepted-only chat

- Sender cannot accept its own interest.
- Chat REST and socket access return 403 before acceptance.
- Acceptance atomically unlocks one conversation.
- Messages persist and synchronize between two real accounts.
- Decline/block/deactivation revokes access immediately.

### Quality/operations

- Core flow works at 320 px, desktop, keyboard-only, and screen-reader-oriented navigation.
- Relevant unit, API, realtime, E2E, load, and authorization tests pass.
- Staging migrations, backup restore, secure config, provider restrictions, readiness, logs, alerts, socket proxy/reconnect, rollback, and feature flags are verified.

---

## 21. Immediate next implementation slice

Phase A and the first backend-normalization slice are complete. Continue with **Phase B migrations and Phase C live frontend integration**:

1. Add a versioned migration runner and baseline migration; make migrations the only deployed schema authority.
2. Add discoverability, map visibility, photo privacy, moderation, normalized place fields, and a stable public-location point to the profile model.
3. Implement the reusable profile-visibility policy across profile, match, visit, and interest services.
4. Add frontend session bootstrap (`GET /api/v1/auth/me`) and authenticated profile/feed hooks.
5. Replace production `mockProfiles`, local interests, visitors, and notification state with API state while retaining an explicit development fixture mode.
6. Add provider-neutral Places autocomplete/details routes with Google as primary and a configured development fallback.
7. Implement `POST /api/v1/map/search` returning only privacy-safe `MapPinDTO`/cluster records.

This sequence establishes a durable schema and real server state before adding global place search, clustering, and hover previews.
