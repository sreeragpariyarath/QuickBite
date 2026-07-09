# Roadmap

---

## Sprint 1 — Auth Service _(current)_

**Goal:** Functional authentication with JWT access and refresh tokens.

- [x] Initialize monorepo (pnpm + Turborepo)
- [x] Scaffold auth-service with NestJS
- [x] Set up PostgreSQL with Docker
- [x] Set up Prisma with User schema and initial migration
- [x] User registration endpoint (`POST /auth/register`)
- [x] Password hashing with bcrypt
- [x] Login endpoint (`POST /auth/login`)
- [x] JWT access token issuance
- [x] Refresh token flow (`POST /auth/refresh`)
- [x] JWT auth guard (used by `POST /auth/logout`)
- [ ] Role decorator (`@Roles('OWNER')`) — needed from Sprint 2

---

## Sprint 2 — Restaurant Service

**Goal:** Owners can create and manage restaurants and menus.

- [ ] Scaffold restaurant-service
- [ ] Restaurant CRUD (owner-scoped)
- [ ] Category management
- [ ] Menu item CRUD
- [ ] OWNER role guard integration

---

## Sprint 3 — Order Service

**Goal:** Customers can place orders; owners can accept or reject them.

- [ ] Scaffold order-service
- [ ] Create order endpoint
- [ ] Order status transitions (`PENDING` → `ACCEPTED` → `PREPARING` → `DELIVERED`)
- [ ] Customer order history
- [ ] Owner incoming order view

---

## Sprint 4 — RabbitMQ

**Goal:** Asynchronous, event-driven communication between services.

- [ ] Add RabbitMQ to Docker Compose
- [ ] Scaffold notification-service
- [ ] Publish `order.created` event from order-service
- [ ] Consume events in notification-service
- [ ] Define event contracts (message schemas)

---

## Sprint 5 — Redis

**Goal:** Caching and rate limiting.

- [ ] Add Redis to Docker Compose
- [ ] Cache refresh token validation in auth-service
- [ ] Rate limiting on auth endpoints

---

## Sprint 6 — Docker

**Goal:** Full containerization of all services and infrastructure.

- [ ] Dockerfile per service
- [ ] Multi-service Docker Compose
- [ ] Nginx reverse proxy config
- [ ] Environment-based configuration per service

---

## Sprint 7 — AWS Deployment

**Goal:** Production deployment on AWS EC2 with CI/CD.

- [ ] GitHub Actions CI pipeline (lint, test, build)
- [ ] GitHub Actions CD pipeline (deploy to EC2)
- [ ] Secrets management
- [ ] Domain and HTTPS setup
