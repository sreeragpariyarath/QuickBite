# Product Roadmap

QuickBite is being built as a real product, not a learning exercise. The roadmap is organized by launch phases, not technology sprints: each phase ends with something a user can touch.

**Launch strategy:** start hyper-local (one town/campus or a cloud-kitchen collective). Restaurants self-deliver at launch — no delivery-partner logistics in v1.

---

## Phase 0 — Foundation ✅ (done)

- [x] Monorepo (pnpm + Turborepo), Docker Postgres, database-per-service
- [x] auth-service: phone OTP registration/login (MSG91, console fallback in dev),
      email+password as secondary, JWT access + refresh tokens, logout, rate limiting
- [x] restaurant-service: owner-scoped restaurant/category/menu CRUD,
      role guards, public browse endpoints
- [x] Postman collection with automated token/ID handling

## Phase 1 — Complete the core loop (current)

**Exit criteria: a customer can order food and the owner can fulfil it, end to end.**

- [ ] order-service (port 3002, `order_db`)
  - [ ] Place order with menu snapshot (name + price copied at order time)
  - [ ] Status flow: `PENDING → ACCEPTED → PREPARING → DELIVERED`, `REJECTED`, `CANCELLED`
  - [ ] Customer order history; owner incoming-order list
  - [ ] Payment fields on order: `paymentMethod` (COD at launch), `paymentStatus`
- [ ] Restaurant discovery basics: city/area field on restaurants + filtered listing
- [ ] User profile: name capture after first OTP login (`PATCH /auth/me`)

## Phase 2 — A product people can use

**Exit criteria: a person with a phone can order without Postman.**

- [ ] Next.js customer app (browse → cart → order → track status)
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
- [ ] CI/CD: GitHub Actions test + deploy pipelines
- [ ] Observability: Sentry (errors) + structured logs + uptime monitoring
- [ ] Delivery-partner role and assignment, live order tracking

---

## Standing rules

- Nothing ships to a phase before the previous phase's exit criteria are met.
- Every new endpoint lands with validation, role guards, and a Postman entry.
- Infrastructure (queues, caches) is added in response to a real bottleneck, not upfront.
