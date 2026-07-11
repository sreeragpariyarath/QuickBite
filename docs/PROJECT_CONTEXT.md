# Project Context

## What is QuickBite?

QuickBite is a food ordering platform for the Indian market, built as a real product. Customers order food from local restaurants using their phone number (OTP login, the Indian standard); restaurant owners manage menus and fulfil orders.

**Positioning:** hyper-local launch (one town, campus, or cloud-kitchen collective) with restaurant self-delivery — not a Swiggy/Zomato competitor at day one. The wedge is a small market those platforms underserve, with lower commission.

**Stack:** NestJS microservices, PostgreSQL (database-per-service), Next.js frontend, deployed on a single VPS + Vercel until scale demands more.

---

## Business Domain

QuickBite connects **customers** with **restaurants**. Customers browse menus and place orders; restaurant owners manage their restaurants and fulfill incoming orders.

---

## User Roles

### Customer

| Permissions | Restrictions |
|---|---|
| Register and log in with phone + OTP | Cannot create or manage restaurants |
| Browse restaurants and menus | Cannot manage menu items |
| Create orders | Cannot view other customers' orders |
| View own order history | — |

### Owner

| Permissions | Restrictions |
|---|---|
| Register and log in | Cannot access another owner's restaurant |
| Create and manage restaurants | Cannot place customer orders |
| Manage menu items and categories | — |
| View, accept, and reject incoming orders | — |

---

## Current Phase

**Phase 1 — Complete the core loop** (order-service: place, accept/reject, track)

See [ROADMAP.md](ROADMAP.md) for the full product roadmap and launch phases.
