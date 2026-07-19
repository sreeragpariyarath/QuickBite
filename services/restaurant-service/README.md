# Restaurant Service

Manages restaurants, categories, and menu items for QuickBite.

**API docs:** http://localhost:3001/docs (Swagger UI) · http://localhost:3001/docs-json (OpenAPI) · `pnpm openapi` exports to `docs/openapi/restaurant-service.openapi.json`

---

## Responsibilities

- Restaurant CRUD (owner-scoped — an owner can only manage their own restaurants)
- Category management
- Menu item CRUD with availability flag
- Public browse endpoints for customers

Authorization is enforced locally by validating the JWT issued by auth-service — no network call to auth-service is made.

---

## Database

PostgreSQL — `restaurant_db`

| Table | Key Columns |
|---|---|
| `restaurants` | `id` (UUID), `ownerId` (from JWT, no FK), `name`, `description`, `address`, `city` (indexed), `imageUrl`, `isActive` — UNIQUE `(ownerId, name, address)` |
| `categories` | `id`, `restaurantId` → restaurants, `name` |
| `menu_items` | `id`, `restaurantId`, `categoryId?`, `name`, `description`, `price` (Decimal 10,2), `imageUrl`, `isAvailable` |

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://quickbite:quickbite123@localhost:5432/restaurant_db` |
| `PORT` | Port the service listens on | `3001` |
| `JWT_SECRET` | Must match auth-service's secret | `dev-only-change-me-in-production` |

---

## Running Locally

**1. Start Postgres** (from repo root)

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

**2. Install, generate, migrate, run**

```bash
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm start:dev
```

Service is available at `http://localhost:3001`.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service + database health check |
| `GET` | `/restaurants` | Public | List active restaurants (`?city=` filter, case-insensitive) |
| `GET` | `/restaurants/:id` | Public | Restaurant detail with categories and available menu items |
| `POST` | `/restaurants` | OWNER | Create a restaurant |
| `PATCH` | `/restaurants/:id` | OWNER (own) | Update restaurant fields |
| `POST` | `/restaurants/:id/categories` | OWNER (own) | Add a category |
| `POST` | `/restaurants/:id/menu-items` | OWNER (own) | Add a menu item |
| `PATCH` | `/restaurants/:id/menu-items/:itemId` | OWNER (own) | Update a menu item |
| `DELETE` | `/restaurants/:id/menu-items/:itemId` | OWNER (own) | Delete a menu item (204) |
