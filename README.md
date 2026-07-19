# QuickBite

![CI](https://github.com/sreeragpariyarath/QuickBite/actions/workflows/ci.yml/badge.svg)

A production-grade, microservices-based food delivery platform.

Customers browse restaurants and place orders. Restaurant owners manage menus and fulfill them.

---

## System Architecture

```
                        ┌──────────────────┐
                        │  Next.js Client  │
                        └────────┬─────────┘
                                 │ HTTPS
                        ┌────────▼─────────┐
                        │      Nginx       │
                        │  (Reverse Proxy) │
                        └──┬───┬───┬───┬───┘
                           │   │   │   │
              ┌────────────┘   │   │   └─────────────┐
              │           ┌────┘   └────┐             │
     ┌────────▼──┐  ┌─────▼──────┐  ┌──▼──────┐  ┌───▼──────────┐
     │   Auth    │  │ Restaurant │  │  Order  │  │ Notification │
     │  Service  │  │  Service   │  │ Service │  │   Service    │
     └────────┬──┘  └─────┬──────┘  └──┬──────┘  └──────────────┘
              │            │            │
         ┌────▼───┐  ┌─────▼───┐  ┌────▼───┐
         │auth_db │  │ rest_db │  │ ord_db │
         └────────┘  └─────────┘  └────────┘
                           │
                    ┌──────▼───────┐
                    │   RabbitMQ   │
                    └──────────────┘
```

---

## Services

| Service | Responsibility | Status | Port |
|---|---|---|---|
| `auth-service` | Registration, authentication, JWT | Live | `3000` |
| `restaurant-service` | Restaurants, categories, menus | Live | `3001` |
| `order-service` | Order lifecycle management | Live | `3002` |
| `notification-service` | Email and SMS alerts | Planned | — |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (database-per-service) |
| Messaging | RabbitMQ |
| Caching | Redis |
| Containers | Docker |
| CI/CD | GitHub Actions — CI live (typecheck, build, tests per service); CD in Phase 2 |
| Deployment | AWS EC2 |

---

## Documentation

| Document | Description |
|---|---|
| [Project Context](docs/PROJECT_CONTEXT.md) | Product overview, user roles, and goals |
| [Architecture](docs/ARCHITECTURE.md) | System design and service breakdown |
| [Roadmap](docs/ROADMAP.md) | Sprint plan and progress |
| [Decisions](docs/DECISIONS.md) | Architectural decision log |
| [Development Rules](docs/DEVELOPMENT_RULES.md) | Coding standards and conventions |

---

## API Documentation

The backend is the single source of truth — Swagger docs are generated from controller/DTO decorators.

| Service | Swagger UI | OpenAPI JSON |
|---|---|---|
| auth-service | http://localhost:3000/docs | http://localhost:3000/docs-json |
| restaurant-service | http://localhost:3001/docs | http://localhost:3001/docs-json |
| order-service | http://localhost:3002/docs | http://localhost:3002/docs-json |

**Authorize in Swagger:** click **Authorize**, paste the JWT from login/OTP verify (without the `Bearer ` prefix) — all protected endpoints then send it automatically.

### Postman workflow

```
NestJS controllers → Swagger decorators → OpenAPI JSON → generated Postman collections → Import
```

Postman collections are **build artifacts** — never edit them by hand.

**1. After changing endpoints, regenerate everything with one command (repo root):**

```bash
pnpm generate:api
```

(This runs `pnpm openapi` in every service, then converts the specs to Postman collections.)

**2. Import into Postman:** `File → Import` → pick both files from `postman/generated/` → choose **Replace** when prompted.

The generated collections already include:
- Collection-level auth: `Bearer {{accessToken}}` (all guarded requests inherit it)
- A collection-level post-response script that auto-saves `accessToken`, `refreshToken`, `userId`, `restaurantId`, `categoryId`, `menuItemId`, `orderId`, and `devOtp` to the active environment whenever a response contains them
- Requests organized in folders by backend module (Swagger tags)
- Base URLs via variables — no hardcoded hosts

**3. Environment:** select the existing **Local** environment. It must define:

| Variable | Value |
|---|---|
| `authBaseUrl` | `http://localhost:3000` |
| `restaurantBaseUrl` | `http://localhost:3001` |
| `orderBaseUrl` | `http://localhost:3002` |
| `accessToken`, `refreshToken`, `userId`, `restaurantId`, `categoryId`, `menuItemId`, `orderId`, `devOtp` | empty — filled automatically |

Typical session: `OTP Request` → `OTP Verify` (tokens saved) → any guarded request just works.

## Getting Started

**Prerequisites:** Docker, Node.js, pnpm

**1. Start infrastructure**

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

**2. Run the auth service**

```bash
cd services/auth-service
pnpm install
pnpm start:dev
```

Service will be available at `http://localhost:3000`.
