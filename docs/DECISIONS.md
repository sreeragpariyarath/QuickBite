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
