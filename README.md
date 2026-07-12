# QuickBite

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
| `order-service` | Order lifecycle management | Planned | — |
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
| CI/CD | GitHub Actions |
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

**Authorize in Swagger:** click **Authorize**, paste the JWT from login/OTP verify (without the `Bearer ` prefix) — all protected endpoints then send it automatically.

**Export OpenAPI specs** (writes to `docs/openapi/*.openapi.json`):

```bash
cd services/auth-service && pnpm openapi
cd services/restaurant-service && pnpm openapi
```

**Import into Postman:** `File → Import` → pick `docs/openapi/<service>.openapi.json` (or paste the live `/docs-json` URL). Re-import after adding endpoints — no manual collection maintenance.

**Token auto-save in Postman (optional, one-time):** after importing, open the collection → Scripts → Post-response and paste:

```js
try {
  const b = pm.response.json();
  if (b.accessToken) pm.environment.set('access_token', b.accessToken);
  if (b.refreshToken) pm.environment.set('refresh_token', b.refreshToken);
  if (b.devOtp) pm.environment.set('dev_otp', b.devOtp);
} catch (e) {}
```

Set the collection's auth to Bearer `{{access_token}}` and every login/OTP response feeds the next request.

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
