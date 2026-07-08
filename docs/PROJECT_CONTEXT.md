# Project Context

## What is QuickBite?

QuickBite is a microservices-based food delivery platform built to be production-grade and portfolio-worthy. It serves as a practical vehicle for learning:

- Microservices architecture
- NestJS
- RabbitMQ
- Redis
- Docker
- CI/CD with GitHub Actions
- AWS deployment

---

## Business Domain

QuickBite connects **customers** with **restaurants**. Customers browse menus and place orders; restaurant owners manage their restaurants and fulfill incoming orders.

---

## User Roles

### Customer

| Permissions | Restrictions |
|---|---|
| Register and log in | Cannot create or manage restaurants |
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

**Sprint 1 — Auth Service**

Current focus:

- PostgreSQL and Prisma setup
- User registration
- Login with email and password
- JWT access tokens
- Refresh tokens

See [ROADMAP.md](ROADMAP.md) for the full sprint plan.
