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
