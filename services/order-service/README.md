# Order Service

Order lifecycle for QuickBite — this service completes the core loop.

**API docs:** http://localhost:3002/docs (Swagger UI) · http://localhost:3002/docs-json (OpenAPI) · `pnpm openapi` exports to `docs/openapi/order-service.openapi.json`

---

## Responsibilities

- Order placement (CUSTOMER): validates the restaurant + menu items via a synchronous read of restaurant-service's public API, snapshots item names/prices, computes the total server-side (D-007, D-013)
- Status machine with per-state validation:
  `PENDING → ACCEPTED → PREPARING → DELIVERED` · `PENDING → REJECTED` · `PENDING/ACCEPTED → CANCELLED` (customer)
- COD payments: `paymentStatus` flips to `PAID` on delivery
- Customer order history; owner incoming-order list (via `ownerId` snapshot — no cross-service joins)

JWTs from auth-service are validated locally (shared `JWT_SECRET`) — no per-request auth calls.

---

## Database

PostgreSQL — `order_db`

| Table | Key Columns |
|---|---|
| `orders` | `id`, `customerId`, `restaurantId`, `ownerId` (snapshot), `status`, `total`, `paymentMethod` (COD), `paymentStatus`, timestamps |
| `order_items` | `id`, `orderId` → orders (cascade), `menuItemId` (ref only), `name` (snapshot), `price` (snapshot), `quantity` |

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://quickbite:quickbite123@localhost:5432/order_db` |
| `PORT` | Port the service listens on | `3002` |
| `JWT_SECRET` | Must match auth-service's secret | `dev-only-change-me-in-production` |
| `RESTAURANT_SERVICE_URL` | Public restaurant-service base URL | `http://localhost:3001` |

---

## Running Locally

```bash
# from repo root: Postgres first
docker compose -f infrastructure/docker/docker-compose.yml up -d

# then (restaurant-service must also be running for order placement)
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm start:dev
```

---

## API Endpoints

All endpoints require `Authorization: Bearer <token>`.

| Method | Path | Who | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service + database health check |
| `POST` | `/orders` | CUSTOMER | Place an order |
| `GET` | `/orders` | both | Customer: own orders / Owner: incoming orders |
| `GET` | `/orders/:id` | both | Order detail (participants only) |
| `PATCH` | `/orders/:id/accept` | OWNER | `PENDING → ACCEPTED` |
| `PATCH` | `/orders/:id/reject` | OWNER | `PENDING → REJECTED` |
| `PATCH` | `/orders/:id/prepare` | OWNER | `ACCEPTED → PREPARING` |
| `PATCH` | `/orders/:id/deliver` | OWNER | `PREPARING → DELIVERED` + COD `PAID` |
| `PATCH` | `/orders/:id/cancel` | CUSTOMER | `PENDING/ACCEPTED → CANCELLED` |
