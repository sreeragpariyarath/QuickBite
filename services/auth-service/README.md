# Auth Service

Handles all authentication and identity concerns for QuickBite.

**API docs:** http://localhost:3000/docs (Swagger UI) · http://localhost:3000/docs-json (OpenAPI) · `pnpm openapi` exports to `docs/openapi/auth-service.openapi.json`

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
| `refresh_tokens` | `id`, `token` (sha256 hash), `userId`, `expiresAt`, `createdAt` |

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://quickbite:quickbite123@localhost:5432/auth_db` |
| `PORT` | Port the service listens on | `3000` |
| `JWT_SECRET` | Secret for signing access tokens | `dev-only-change-me-in-production` |
| `JWT_EXPIRES_IN_SECONDS` | Access token expiry in seconds | `900` |
| `REFRESH_EXPIRES_IN_DAYS` | Refresh token expiry in days | `7` |
| `MSG91_AUTH_KEY` | MSG91 auth key (empty → console SMS provider) | `""` |
| `MSG91_TEMPLATE_ID` | DLT-approved MSG91 template with `##otp##` var | `""` |
| `RESEND_API_KEY` | Resend API key (empty → console email provider) | `""` |
| `EMAIL_FROM` | Sender identity for verification emails | `QuickBite <onboarding@resend.dev>` |
| `APP_URL` | Public base URL of this service (used in email links) | `http://localhost:3000` |
| `FRONTEND_URL` | Redirect target after email verification | `http://localhost:3100` |

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
| `GET` | `/health` | Service + database health check | Live |
| `POST` | `/auth/otp/request` | Send a 6-digit OTP to a phone (`+91XXXXXXXXXX`) | Live |
| `POST` | `/auth/otp/verify` | Verify OTP → tokens; auto-registers new phones | Live |
| `POST` | `/auth/register/email` | Register with email + password; sends verification link | Live |
| `GET` | `/auth/verify-email` | Verify from email link → redirect (+auto-login cookie for email-first users) | Live |
| `POST` | `/auth/login/email` | Login with email + password (verified email required) | Live |
| `POST` | `/auth/email/resend` | Resend the verification email (60s cooldown) | Live |
| `PATCH` | `/auth/me/email` | Attach email to a phone account (Bearer token) | Live |
| `POST` | `/auth/refresh` | New access token — token from body or HttpOnly cookie | Live |
| `POST` | `/auth/logout` | Revoke the refresh token (body or cookie) | Live |

OTP limits: 5-minute expiry, single-use, 3 requests per phone per 15 minutes, 5 verify attempts.
Email verification: 24-hour single-use links, sha256-hashed at rest, one resend per 60 seconds.
Dev mode: without MSG91/Resend credentials, responses include `devOtp` / `devVerificationUrl`.

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
