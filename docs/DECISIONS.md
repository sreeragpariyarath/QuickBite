# Architectural Decisions

A log of significant architectural decisions made in this project. New decisions are added as they arise.

---

## D-001 — Use NestJS over Express

**Date:** 2026-06
**Status:** Accepted

**Context:**
Needed a Node.js backend framework for building multiple microservices. The two main candidates were Express and NestJS.

**Decision:**
Use NestJS.

**Reasons:**
- TypeScript-first with full decorator and metadata support out of the box
- Built-in dependency injection — essential for clean microservice architecture
- Native microservice transport support (RabbitMQ, Redis, TCP, gRPC) via `@nestjs/microservices`
- Enforces consistent structure (modules, controllers, services) — reduces architecture drift as services multiply

**Consequences:**
Slightly higher initial learning curve than Express. The enforced structure and built-in microservice tooling pay off significantly as the service count grows.

---

## D-002 — Use Prisma as the ORM

**Date:** 2026-06
**Status:** Accepted

**Context:**
Needed a database access layer for PostgreSQL. Options included raw SQL, Knex, TypeORM, and Prisma.

**Decision:**
Use Prisma.

**Reasons:**
- Auto-generated, fully type-safe query client — eliminates a whole class of runtime type errors
- Schema-first with built-in migration tracking per service
- Readable, concise schema syntax compared to TypeORM's decorator-heavy approach
- Generates a client local to each service — aligns with the database-per-service pattern

**Consequences:**
Each service maintains its own Prisma schema and migration history independently. The generated client is service-local and not shared across services.

---

## D-003 — Use UUIDs for all primary keys

**Date:** 2026-06
**Status:** Accepted

**Context:**
Needed to choose a primary key strategy for all database tables across all services.

**Decision:**
Use UUID v4 for all primary keys (`@id @default(uuid()) @db.Uuid`).

**Reasons:**
- Distributed-system safe — IDs can be generated in any service without a central sequence
- No sequential ID leakage — integer IDs reveal record counts to clients
- Future-proof for sharding or cross-database references

**Consequences:**
Slightly larger index size than integer PKs. The distributed-system and security benefits outweigh this cost.

---

## D-004 — Single users table with role enum

**Date:** 2026-06
**Status:** Accepted

**Context:**
Users can be either customers or restaurant owners. Decision needed on whether to maintain separate tables per role or a unified users table.

**Decision:**
Use a single `users` table with a `role` column (`CUSTOMER` | `OWNER` enum).

**Reasons:**
- Avoids duplicating authentication and credential fields across two tables
- Role-based access control is cleaner against a unified identity model
- Simpler JWT payload — one user type, one token shape, one guard
- Registration and login flows are identical regardless of role

**Consequences:**
If role-specific profile fields are needed in the future, they can live in separate `customer_profiles` or `owner_profiles` tables that reference `users`. This does not change the core decision.

---

## D-005 — Use Cloudinary for image storage

**Date:** 2026-07
**Status:** Accepted

**Context:**
Restaurant and menu item images need to be stored somewhere. Options were AWS S3, Cloudinary, and storing binary data in PostgreSQL. Project has no budget (learning project).

**Decision:**
Use Cloudinary free tier.

**Reasons:**
- Permanent free tier (25 GB storage, 25 GB bandwidth/month) — no cost
- Auto image resizing and compression out of the box
- Simpler SDK than S3 — no AWS account or IAM setup needed
- Sufficient scale for a portfolio project

**Consequences:**
`imageUrl String?` fields on `Restaurant` and `MenuItem` store the Cloudinary URL. Images are served directly from Cloudinary CDN, not through the services. Upload endpoint to be implemented in Sprint 6.

---

## D-006 — JWT validation is service-local, not via auth-service

**Date:** 2026-07
**Status:** Accepted

**Context:**
Every service needs to know who is making a request (user ID and role). Two options: call auth-service on every request, or validate the JWT locally in each service.

**Decision:**
Each service validates the JWT independently using the shared `JWT_SECRET`. No network call to auth-service per request.

**Reasons:**
- Calling auth-service on every request creates tight coupling and a single point of failure
- JWT is self-contained — signature verification proves authenticity without a network call
- Follows standard microservices JWT pattern

**Consequences:**
`JWT_SECRET` must be available as an environment variable in every service. Token revocation before expiry requires a Redis blocklist (planned for Sprint 5).

---

## D-007 — Order items are stored as snapshots

**Date:** 2026-07
**Status:** Accepted

**Context:**
Order service needs to record what a customer ordered. It could store just the `menuItemId` and look up the current price from restaurant-service, or snapshot the data at order time.

**Decision:**
Snapshot the item name and price into `OrderItem` at the moment the order is placed.

**Reasons:**
- Prices and menu items change over time — historical orders must reflect what the customer actually paid
- Avoids a cross-service dependency at query time
- Consistent with how real order systems work (receipts are immutable)

**Consequences:**
`OrderItem` stores `name`, `price`, and `quantity` directly. `menuItemId` is kept as a reference only — not a foreign key, not queried for display.

---

## D-008 — No cross-service foreign keys

**Date:** 2026-07
**Status:** Accepted

**Context:**
Services reference data from other services (e.g. restaurant-service stores `ownerId` from auth-service). Decision needed on whether these are enforced foreign keys or plain UUID references.

**Decision:**
Cross-service IDs are stored as plain `UUID` fields — no database-level foreign keys across service boundaries.

**Reasons:**
- Services own their own databases — enforcing FK constraints across databases is not possible
- Referential integrity is enforced at the application level via JWT claims and API validation
- Keeps service databases truly independent

**Consequences:**
Application code is responsible for validating that referenced IDs are valid. Each service trusts the JWT payload for user identity rather than querying auth-service.

---

## D-009 — Phone OTP is the primary authentication method

**Date:** 2026-07
**Status:** Accepted

**Context:**
QuickBite pivoted from learning project to product targeting the Indian market, where phone-OTP login is the standard for food apps (Swiggy, Zomato). Email+password had already been built.

**Decision:**
Phone number + OTP is the primary registration/login flow for both CUSTOMER and OWNER roles. Email+password remains as a secondary option.

**Details:**
- `users.phone` is unique and nullable; `email`/`password` are now optional
- OTPs are 6-digit, sha256-hashed at rest, expire in 5 minutes, single-use
- Rate limits: 3 OTP requests per phone per 15 minutes, 5 verify attempts per OTP
- Verify auto-registers unknown phones (`isNewUser` flag in the response)

**Consequences:**
The frontend needs only one auth screen (phone → OTP). Users may exist with no email. Account recovery is inherently solved (possession of the phone).

---

## D-010 — MSG91 for SMS, behind a provider interface

**Date:** 2026-07
**Status:** Accepted

**Context:**
OTP delivery in India requires a DLT-registered SMS provider. MSG91 is the market standard (~₹0.20/SMS). Development must not depend on paid credentials being present.

**Decision:**
SMS goes through an `SmsProvider` interface. `Msg91SmsProvider` uses MSG91's SendOTP API (`/api/v5/otp`) with **our** generated OTP passed as a parameter, so OTP verification stays in our OtpService (hash compare) — MSG91 is delivery only. Provider selection:

- `MSG91_AUTH_KEY` + `MSG91_TEMPLATE_ID` → DLT template (production)
- `MSG91_AUTH_KEY` only → MSG91's default OTP template (trial mode — delivers only to the phone number verified on the MSG91 account; usable before DLT registration)
- neither → `ConsoleSmsProvider` logs the OTP and the API response includes `devOtp`

**Consequences:**
Real SMS to the developer's own phone works before DLT. Going fully live requires business + DLT registration and setting `MSG91_TEMPLATE_ID` — zero code changes. The same interface will later serve order-status SMS notifications.

---

## D-011 — Roles frozen at CUSTOMER and OWNER through Phase 2

**Date:** 2026-07
**Status:** Accepted

**Context:**
Food delivery platforms typically add delivery-partner and admin roles. Each new role multiplies auth logic, guards, dashboards, and testing surface while the core loop is still unproven.

**Decision:**
Only `CUSTOMER` and `OWNER` exist until Phase 2 exit criteria are met (a person with a phone can order without Postman). Restaurants self-deliver at launch.

**Consequences:**
No delivery-partner onboarding, assignment, or tracking in v1. The `UserRole` enum stays two-valued; adding a role later is a single enum migration plus guards. Admin needs are handled directly in the database until an admin panel is justified.

---

## D-012 — Verified email auth alongside phone OTP

**Date:** 2026-07
**Status:** Accepted

**Context:**
Email + password existed as unverified endpoints. Making email a trustworthy secondary auth method requires verification; sending email requires a provider with zero-cost dev workflow.

**Decision:**
- `POST /auth/register/email` creates an unverified user and emails a 24h single-use verification link; login is blocked (`409`) until verified. The old unverified `/auth/register` and `/auth/login` endpoints were **replaced** (existing users backfilled as verified).
- Verification tokens are random 32-byte values stored sha256-hashed, single-use, deleted on use/resend; resends are rate-limited to one per 60s.
- `GET /auth/verify-email` redirects to `FRONTEND_URL/auth/verified`. Email-first users are auto-logged-in via a `refresh_token` HttpOnly cookie; phone users attaching an email (`PATCH /auth/me/email`) keep their existing session — no new tokens.
- **Hybrid refresh transport:** `/auth/refresh` and `/auth/logout` accept the refresh token from the body (Postman/mobile) or the cookie (future web frontend).
- Email delivery goes through an `EmailProvider` interface: Resend (free tier) when `RESEND_API_KEY` is set, console provider logging the link (and returning `devVerificationUrl`) otherwise — mirrors D-010.

**Consequences:**
One auth surface with no unverified back door. A future web frontend needs CORS with `credentials: true`. Email sending can move behind RabbitMQ into notification-service in Phase 4 without changing the interface.

---

## D-013 — Order placement does a synchronous read of restaurant-service

**Date:** 2026-07
**Status:** Accepted

**Context:**
Placing an order requires trusted menu prices (D-007 snapshots) and the restaurant's owner id. The client cannot be trusted to send prices, and order-service has no access to `restaurant_db` (D-008).

**Decision:**
At order time, order-service performs one synchronous HTTP GET against restaurant-service's **public** restaurant-detail endpoint (`RESTAURANT_SERVICE_URL`), validates the restaurant is active and every requested menu item exists/is available, snapshots names + prices, computes the total server-side, and stores `ownerId` on the order.

**Reasons:**
- A read-only query at command time is not command coupling — restaurant-service stays unaware of orders
- Snapshotting `ownerId` lets owners list incoming orders without cross-service joins
- Events (RabbitMQ) can't answer a synchronous "what does this cost right now" question

**Consequences:**
Order placement fails with 503 when restaurant-service is down (10s timeout) — an acceptable coupling for the core loop. Status-change notifications remain event-driven work for Phase 4.

---

## D-014 — Restaurant identity: names are not unique; (owner, name, address) is

**Date:** 2026-07
**Status:** Accepted

**Context:**
Real markets have many same-name restaurants ("Hotel Krishna" in every town), and one owner may run branches. Meanwhile dev data showed the same owner accidentally creating identical restaurants repeatedly.

**Decision:**
- No global or per-city uniqueness on restaurant `name` — `id` is the identifier, customers disambiguate via address/city (and later photos/ratings).
- Same owner + same name at a **different address** is allowed (branches).
- Same owner + same name + same address is blocked by a DB unique constraint `(ownerId, name, address)`, surfaced as a friendly `409`.
- `city` is a required field, indexed, filterable via `GET /restaurants?city=` (case-insensitive) — the discovery basis until geolocation exists.

**Consequences:**
Accidental duplicates are impossible at the database level, not just the app level. Frontend listings must always show address/city next to the name.

---

## D-011 — Phased release discipline (feature freeze per phase)

**Date:** 2026-07
**Status:** Accepted

**Context:**
Solo developer, ~14 hours/week available (10pm–12am weeknights + Sundays).
The bigger risk to shipping isn't under-building — it's scope creep from
adding "just one more feature" before the current phase is usable and
deployed.

**Decision:**
Each roadmap phase has a frozen feature list before coding starts on it.
No feature is added to the active phase once work begins; new ideas are
logged into a later phase's backlog instead.

**Reasons:**
- A shippable, demoable product at the end of each phase beats a
  perpetually in-progress one — both for portfolio purposes and for actual
  usability
- Matches how real product teams scope releases (MVP → hardening →
  expansion) rather than building the end-state architecture up front
- Prevents a mid-build domain rewrite — e.g. introducing multi-branch
  organizations or fine-grained RBAC before Owner→Restaurant is even
  shipped and working

**Consequences:**
Enterprise-style features (multi-tenant organizations, branches,
permission-based RBAC beyond the CUSTOMER/OWNER enum, inventory,
analytics, subscriptions/billing) are deliberately out of scope until a
future phase explicitly calls for them. See [ROADMAP.md](ROADMAP.md)
"Standing rules" for the phase-gating rule this formalizes.