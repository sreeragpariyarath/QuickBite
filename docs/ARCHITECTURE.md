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

Each service owns its own database. No service queries another service's database directly. Cross-service data needs are fulfilled through API calls or RabbitMQ events.

| Service | Database |
|---|---|
| auth-service | `auth_db` |
| restaurant-service | `restaurant_db` |
| order-service | `order_db` |
| notification-service | — (stateless, event-driven) |

---

## Service Breakdown

### Auth Service

**Status:** In progress

Responsibilities:
- User registration and login
- Password hashing and verification
- JWT access token issuance and verification
- Refresh token lifecycle management

Owns:
- `users` — UUID PK, email, hashed password, role (`CUSTOMER` | `OWNER`), timestamps
- `refresh_tokens` — token hash, expiry, user FK _(planned)_

Database: `auth_db`

---

### Restaurant Service

**Status:** Planned (Sprint 2)

Responsibilities:
- Restaurant creation and management (owner-scoped)
- Category management
- Menu item CRUD

Owns:
- `restaurants` — name, owner ID, address, metadata
- `categories` — restaurant-scoped groupings
- `menu_items` — name, description, price, category, availability flag

Database: `restaurant_db`

---

### Order Service

**Status:** Planned (Sprint 3)

Responsibilities:
- Order creation from customer
- Order status transitions (`PENDING` → `ACCEPTED` → `PREPARING` → `DELIVERED`)
- Order history for customers and owners

Owns:
- `orders` — customer ID, restaurant ID, menu snapshot, status, total

Database: `order_db`

---

### Notification Service

**Status:** Planned (Sprint 4+)

Responsibilities:
- Email and SMS delivery triggered by domain events
- Consumes events from RabbitMQ (e.g. `order.created`, `order.accepted`)

Owns: No persistent database — stateless, event-driven.

---

## Inter-Service Communication

Services communicate asynchronously via **RabbitMQ** for event-driven flows.

Example flow:
```
Customer places order
  → order-service publishes order.created
    → notification-service sends confirmation email to customer
    → notification-service sends new order alert to owner
```

Synchronous HTTP between services is avoided. Each service is independently deployable and loosely coupled.

---

## Frontend

A **Next.js** application will serve as the customer-facing and owner-facing UI, communicating with backend services through an **Nginx** reverse proxy.

**Status:** Planned
