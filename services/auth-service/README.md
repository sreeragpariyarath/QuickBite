# Auth Service

Handles all authentication and identity concerns for QuickBite.

---

## Responsibilities

- User registration (CUSTOMER and OWNER roles)
- Login with email and password
- JWT access token issuance and verification
- Refresh token lifecycle management
- Authorization guards consumed by other services

---

## Database

PostgreSQL — `auth_db`

| Table | Key Columns |
|---|---|
| `users` | `id` (UUID), `email`, `password`, `role`, `createdAt`, `updatedAt` |
| `refresh_tokens` | _(planned)_ `id`, `token`, `expiresAt`, `userId` |

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://quickbite:quickbite123@localhost:5432/auth_db` |
| `PORT` | Port the service listens on | `3000` |
| `JWT_SECRET` | _(planned)_ Secret for signing access tokens | `supersecret` |
| `JWT_EXPIRES_IN` | _(planned)_ Access token expiry | `15m` |
| `REFRESH_SECRET` | _(planned)_ Secret for signing refresh tokens | `refreshsecret` |
| `REFRESH_EXPIRES_IN` | _(planned)_ Refresh token expiry | `7d` |

---

## Running Locally

**1. Start Postgres**

```bash
docker compose -f ../../infrastructure/docker/docker-compose.yml up -d
```

**2. Install dependencies and start in watch mode**

```bash
pnpm install
pnpm start:dev
```

Service is available at `http://localhost:3000`.

---

## API Endpoints

| Method | Path | Description | Status |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | Planned |
| `POST` | `/auth/login` | Login and receive access + refresh tokens | Planned |
| `POST` | `/auth/refresh` | Exchange refresh token for a new access token | Planned |
| `POST` | `/auth/logout` | Revoke the refresh token | Planned |

---

## Testing

```bash
# unit tests
pnpm test

# watch mode
pnpm test:watch

# e2e tests
pnpm test:e2e

# coverage report
pnpm test:cov
```
