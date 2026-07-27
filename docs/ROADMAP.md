# Product Roadmap

QuickBite is being built as a real product, not a learning exercise. The roadmap is organized by launch phases, not technology sprints: each phase ends with something a user can touch.

**Launch strategy:** start hyper-local (one town/campus or a cloud-kitchen collective). Restaurants self-deliver at launch — no delivery-partner logistics in v1.

---

## Phase 0 — Foundation ✅ (done)

- [x] Monorepo (pnpm + Turborepo), Docker Postgres, database-per-service
- [x] auth-service: phone OTP registration/login via Firebase Auth (exchanging Firebase ID Token for local JWT),
      email+password as secondary, JWT access + refresh tokens, logout, rate limiting
- [x] Google Auth integration (Google Sign-In via Firebase Auth provider)
- [x] restaurant-service: owner-scoped restaurant/category/menu CRUD,
      role guards, public browse endpoints
- [x] Postman collection with automated token/ID handling

## Phase 1 — Complete the core loop ✅ (done 2026-07-19)

**Exit criteria: a customer can order food and the owner can fulfil it, end to end. — MET**

- [x] order-service (port 3002, `order_db`)
  - [x] Place order with menu snapshot (name + price copied at order time)
  - [x] Status flow: `PENDING → ACCEPTED → PREPARING → DELIVERED`, `REJECTED`, `CANCELLED`
  - [x] Customer order history; owner incoming-order list
  - [x] Payment fields on order: `paymentMethod` (COD at launch), `paymentStatus` (PAID on delivery)
- [x] Restaurant discovery basics: required `city` field + `GET /restaurants?city=` filter (case-insensitive); duplicate protection via `(ownerId, name, address)` unique (D-014)
- [x] User profile: `GET /auth/me` + `PATCH /auth/me` (name capture after first OTP login)

## Phase 2 — A product people can use (current)

**Exit criteria: a person with a phone can order without Postman.**

- [/] Next.js customer app
  - [x] Responsive Auth screens (Phone OTP, Email Login, Signup, Forgot/Reset Password)
  - [x] Restaurant discovery & browsing pages (`/` homepage, `/r/[id]` category/menu lists)
  - [x] User profile settings (`/welcome` first name setup)
  - [ ] Cart, checkout, and order status tracking pages
- [ ] Next.js owner dashboard (menu management, incoming orders, accept/reject)
- [ ] Nginx API gateway — one public origin, services not exposed directly
- [ ] Notifications v1: order status via MSG91 SMS (reuse SMS provider)
- [ ] Deploy: frontend on Vercel free tier, services + Postgres on a single EC2/VPS
      with Docker Compose, HTTPS via Let's Encrypt
- [ ] Security hardening: production JWT secret, CORS allowlist, helmet,
      request logging

## Phase 3 — Money and trust

- [ ] Razorpay integration (UPI/cards) alongside COD
- [ ] Order cancellation/refund policy and flow
- [ ] Ratings and reviews
- [ ] Email verification + transactional email via notification-service
- [ ] Basic owner analytics (orders/day, revenue)

## Phase 4 — Scale when it hurts

Introduce only when real usage demands it:

- [ ] RabbitMQ for order events (order.created → notifications) — replaces direct SMS calls
- [ ] Redis: session/token cache, hot restaurant listing cache, distributed rate limiting
- [x] CI: GitHub Actions — per-service typecheck, build, unit tests on every push/PR (added early, 2026-07; `.github/workflows/ci.yml`)
- [ ] CD: GitHub Actions deploy pipeline (needs a deploy target — Phase 2)
- [ ] Observability: Sentry (errors) + structured logs + uptime monitoring
- [ ] Delivery-partner role and assignment, live order tracking

---

## Standing rules

- Nothing ships to a phase before the previous phase's exit criteria are met.
- Every new endpoint lands with validation, role guards, and Swagger decorators; `pnpm openapi` regenerates the specs Postman imports.
- Infrastructure (queues, caches) is added in response to a real bottleneck, not upfront.

---

## Reference

Roles are frozen at **Customer** and **Owner** through at least Phase 2 —
see [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for the full role/permission
table and [DECISIONS.md](DECISIONS.md) (D-009, D-011) for the reasoning
behind phone-primary auth and the phase-freeze discipline.