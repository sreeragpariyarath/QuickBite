# Roadmap

## Philosophy

We are not building the final product first. We are building the smallest
version a restaurant could actually use, shipping it, and evolving it in
place. Nothing in V1 gets deleted later — V2 wraps and extends V1, it does
not replace it.

Three releases. Not two, not five.

```
V1   — Portfolio MVP        (2–3 months)
V1.5 — Production Hardening (no new features)
V2   — Enterprise SaaS      (Organizations, RBAC, Branches)
```

---

## V1 — MVP

**Goal:** a restaurant should be able to use QuickBite today. Not perfect.
Usable, deployed, demoable.

### Roles (frozen)

```
Customer
Restaurant Owner
```

No Manager, Cashier, Kitchen Staff, or Delivery Staff yet. The Owner does
everything on the restaurant side in V1. This is intentional — see V2.

### Authentication

Phone number is the primary identity. Email is optional and secondary.

| Flow | Detail |
|---|---|
| Signup | Phone number + OTP (SMS). This is the account identity. |
| Login | Phone + OTP, every time — no password to manage for phone auth |
| Email (optional) | User may add an email later; triggers a verification link via Resend |
| Email use | Order receipts / notifications only — **never required to place an order** |
| JWT | Access token + refresh token (httpOnly cookie), same pattern regardless of phone or email path |
| Rate limiting | OTP request and email-verification-resend both rate-limited (1 per 60s per user) |

Email verification reuses the Resend integration already proven on Faradex —
no new email infrastructure needed for V1.

### Modules (15 core features — frozen)

1. Authentication (phone OTP + optional email)
2. Customer profile
3. Restaurant (create/update, single restaurant per owner)
4. Categories
5. Menu items + availability
6. Browse restaurants / menu (customer)
7. Cart
8. Checkout — **COD only**, no payment gateway yet
9. Orders

   ```
   PENDING → ACCEPTED → PREPARING → READY → DELIVERED
   ```

   (Owner changes status manually — no dispatch/delivery role yet)
10. Order tracking (customer view)
11. Order history (customer)
12. Owner dashboard (incoming orders, accept/reject)
13. Image upload (restaurant logo, menu item photos)
14. Deployment (single VPS + Vercel)
15. Docs + tests for the critical paths (auth, checkout, order status)

**Anything not on this list does not get built in V1. No exceptions, no
"just this one small thing."**

### Infrastructure (V1)

- NestJS microservices, database-per-service (PostgreSQL)
- Docker, Nginx, single VPS + Vercel
- No Redis, no RabbitMQ, no Kubernetes yet — these are justified by scale,
  and V1 doesn't have scale yet

### Build order (sprints, each ends deployed)

**Sprint 1 — Foundation**
Auth (phone OTP + optional email verification) → Customer profile → Restaurant → Categories → Menu
→ *deploy*

**Sprint 2 — Customer-facing loop**
Browse → Cart → Checkout (COD)
→ *deploy*

**Sprint 3 — Fulfilment loop**
Orders → Owner dashboard → Order status updates → Order tracking/history
→ *deploy*

**Sprint 4 — Ship it**
Image upload, docs, critical-path tests, final deployment polish
→ *deploy, pin on GitHub, put on resume*

Owner-side before customer-side within each sprint where there's a
dependency — customer browsing is meaningless against empty restaurant/menu
data.

---

## V1.5 — Production Hardening

**No new features.** This phase exists to make V1 look and behave like
production software, because recruiters and interviewers notice this even
if end users never do.

- Redis (caching, session/OTP state)
- RabbitMQ (event-driven order status, notification queue)
- CI/CD pipeline
- Structured logging (Winston — same tool used at work)
- Monitoring (Sentry or equivalent)
- Test coverage expansion
- Docker Compose cleanup

---

## V2 — Enterprise SaaS

Do not start this until V1 is deployed and V1.5 is stable. Written here so
scope is defined, not so it's tempting to build early.

### Roles

```
Super Admin
Organization Owner
Branch Manager
Cashier
Kitchen Staff
Delivery Staff
Support Agent
Customer
```

### Domain shift

```
V1:  Owner → Restaurant

V2:  Organization → Restaurant → Branch
```

Restaurant is wrapped, not deleted.

### RBAC

```
Permissions → Roles → Users
```

Example permissions: `menu:create`, `order:refund`, `staff:create`,
`analytics:view`, `billing:update` — roles are granted permission sets,
endpoints check permissions, not role strings.

### New modules

Inventory, Coupons, Analytics, Subscriptions, Billing, Audit Logs, Support,
Reviews, Tables, Reservations, Kitchen Display, Delivery dispatch.

---

## Explicitly deferred to V2 (no discussion until V1 ships)

Managers, Cashiers, Kitchen Staff, Delivery Staff, Support Agent roles ·
Organizations/Branches · Fine-grained permissions/RBAC · Inventory · Coupons
· Analytics · Subscriptions · Billing · Audit logs · Payment gateway
(Razorpay/Stripe) · Multiple restaurants per owner

---

## Current Phase

**Sprint 1 — Foundation.** Finishing Authentication (phone OTP + optional
email verification) before moving to Customer Profile.

See [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for vision and role
definitions, [ARCHITECTURE.md](ARCHITECTURE.md) for service boundaries.