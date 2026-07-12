# System Architecture

## Monorepo Structure

```
QuickBite/
├── apps/                     # Frontend applications (Next.js)
├── services/                 # Backend microservices
│   ├── auth-service/         # Authentication and user management
│   ├── restaurant-service/   # Restaurant and menu management (planned)
│   ├── order-service/        # Order lifecycle management (planned)
│   └── notification-service/ # Event-driven notifications (planned)
├── infrastructure/
│   ├── docker/               # Docker Compose definitions
│   ├── nginx/                # Reverse proxy config (planned)
│   └── scripts/              # Utility scripts (planned)
└── docs/                     # Project documentation
```

---

## Database Strategy

Each service owns its own database. No service queries another service's database directly. Cross-service data needs are fulfilled through API calls or RabbitMQ events. Cross-service IDs are plain UUID references — no database-level foreign keys across service boundaries.

| Service | Database |
|---|---|
| auth-service | `auth_db` |
| restaurant-service | `restaurant_db` |
| order-service | `order_db` |
| notification-service | — (stateless, event-driven) |

---

## JWT Strategy

Every service validates the JWT **independently** using the shared `JWT_SECRET`. No service calls auth-service on every request.

```
Client sends: Authorization: Bearer <token>

Each service:
  1. Verifies signature with JWT_SECRET
  2. Reads { userId, role } from payload
  3. Makes authorization decisions locally — no network call
```

Token payload:
```json
{
  "sub": "<userId>",
  "role": "CUSTOMER | OWNER",
  "iat": 1234567890,
  "exp": 1234568790
}
```

---

## Data Models

### Auth Service — `auth_db`

```
User
  id          UUID        PK
  phone       String?     UNIQUE — primary identifier (OTP auth)
  email       String?     UNIQUE — secondary auth
  password    String?     bcrypt hashed (only for email auth)
  name        String?
  role        CUSTOMER | OWNER
  createdAt   DateTime
  updatedAt   DateTime

RefreshToken
  id          UUID        PK
  token       String      sha256 hashed
  userId      UUID        → User (cascades on delete)
  expiresAt   DateTime
  createdAt   DateTime

Otp
  id          UUID        PK
  phone       String      indexed
  codeHash    String      sha256 of 6-digit code
  attempts    Int         max 5 verify attempts
  expiresAt   DateTime    5-minute TTL
  createdAt   DateTime
```

---

### Restaurant Service — `restaurant_db`

```
Restaurant
  id           UUID        PK
  ownerId      UUID        from JWT — no FK to auth_db
  name         String
  description  String?
  address      String
  imageUrl     String?     Cloudinary URL
  isActive     Boolean     default true
  createdAt    DateTime
  updatedAt    DateTime

Category
  id           UUID        PK
  restaurantId UUID        → Restaurant
  name         String
  createdAt    DateTime
  updatedAt    DateTime

MenuItem
  id           UUID        PK
  restaurantId UUID        → Restaurant
  categoryId   UUID?       → Category
  name         String
  description  String?
  price        Decimal
  imageUrl     String?     Cloudinary URL
  isAvailable  Boolean     default true
  createdAt    DateTime
  updatedAt    DateTime
```

---

### Order Service — `order_db`

```
Order
  id            UUID        PK
  customerId    UUID        from JWT — no FK to auth_db
  restaurantId  UUID        reference only — no FK to restaurant_db
  status        PENDING | ACCEPTED | REJECTED | PREPARING | DELIVERED | CANCELLED
  total         Decimal
  createdAt     DateTime
  updatedAt     DateTime

OrderItem
  id          UUID        PK
  orderId     UUID        → Order
  menuItemId  UUID        reference only — no FK to restaurant_db
  name        String      SNAPSHOT at order time
  price       Decimal     SNAPSHOT at order time
  quantity    Int
```

Order status transitions:
```
PENDING → ACCEPTED → PREPARING → DELIVERED
PENDING → REJECTED
ACCEPTED → CANCELLED  (by customer)
```

---

### Notification Service — no database

Stateless. Consumes RabbitMQ events and sends emails via Resend (the same
transactional email provider already proven on Faradex — no new email
infrastructure needed). No persistence needed.

Events consumed:

| Event | Trigger | Recipients |
|---|---|---|
| `order.created` | Customer places order | Customer (confirmation) + Owner (new order alert) |
| `order.accepted` | Owner accepts order | Customer |
| `order.rejected` | Owner rejects order | Customer |
| `order.delivered` | Order delivered | Customer |

---

## Image Storage

Images for restaurants and menu items are stored on **Cloudinary** (free tier). Services store only the Cloudinary URL string in the database. Images are served directly from the Cloudinary CDN — not through the backend services.

Upload endpoint to be implemented in Sprint 6.

---

## Inter-Service Communication

Services communicate asynchronously via **RabbitMQ** for event-driven flows.

```
Customer places order
  → order-service creates order (status: PENDING)
  → order-service publishes order.created
    → notification-service emails customer (confirmation)
    → notification-service emails owner (new order alert)

Owner accepts order
  → order-service updates status to ACCEPTED
  → order-service publishes order.accepted
    → notification-service emails customer
```

Synchronous HTTP between services is avoided. Each service is independently deployable and loosely coupled.

---

## Service Breakdown

### Auth Service

**Status:** In progress (Sprint 1)

Responsibilities:
- User registration and login
- Password hashing and verification (bcrypt)
- JWT access token issuance
- Refresh token lifecycle management

Endpoints:
| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/otp/request` | Send OTP to phone (primary flow) |
| `POST` | `/auth/otp/verify` | Verify OTP → tokens; auto-registers new phones |
| `POST` | `/auth/register` | Register with email+password (secondary) |
| `POST` | `/auth/login` | Login with email+password (secondary) |
| `POST` | `/auth/refresh` | Exchange refresh token for new access token |
| `POST` | `/auth/logout` | Revoke refresh token |

SMS delivery: `SmsProvider` interface → MSG91 in production, console logger in dev (see D-010).

---

### Restaurant Service

**Status:** Planned (Sprint 2)

Responsibilities:
- Restaurant CRUD (owner-scoped, OWNER role required)
- Category management
- Menu item CRUD with image upload

Endpoints:
| Method | Path | Description |
|---|---|---|
| `POST` | `/restaurants` | Create a restaurant |
| `GET` | `/restaurants` | List all active restaurants |
| `GET` | `/restaurants/:id` | Get restaurant detail |
| `PATCH` | `/restaurants/:id` | Update restaurant (owner only) |
| `POST` | `/restaurants/:id/categories` | Add a category |
| `POST` | `/restaurants/:id/menu-items` | Add a menu item |
| `PATCH` | `/restaurants/:id/menu-items/:itemId` | Update a menu item |
| `DELETE` | `/restaurants/:id/menu-items/:itemId` | Remove a menu item |

---

### Order Service

**Status:** Planned (Sprint 3)

Responsibilities:
- Order creation from customer
- Order status transitions
- Order history for customers and owners

Endpoints:
| Method | Path | Description |
|---|---|---|
| `POST` | `/orders` | Place an order |
| `GET` | `/orders` | List own orders (customer or owner) |
| `GET` | `/orders/:id` | Get order detail |
| `PATCH` | `/orders/:id/accept` | Accept order (owner only) |
| `PATCH` | `/orders/:id/reject` | Reject order (owner only) |
| `PATCH` | `/orders/:id/cancel` | Cancel order (customer only) |

---

### Notification Service

**Status:** Planned (Sprint 4)

Responsibilities:
- Consume RabbitMQ events
- Send emails via Resend (reusing the Faradex integration)

---

## Frontend

A **Next.js** application will serve as the customer-facing and owner-facing UI, communicating with backend services through an **Nginx** reverse proxy.

**Status:** Planned