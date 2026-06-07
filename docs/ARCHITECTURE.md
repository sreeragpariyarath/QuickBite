# System Architecture

## Monorepo Structure

QuickBite/

apps/
services/
infrastructure/
docs/

---

## Service Architecture

Auth Service
Restaurant Service
Order Service
Notification Service

---

## Service Responsibilities

### Auth Service

Responsible for:

- Registration
- Authentication
- Authorization
- JWT Management
- Refresh Tokens

Owns:

- Users
- Refresh Tokens

Database:

auth_db

### Restaurant Service

Responsible for:

- Restaurants
- Categories
- Menu Items

Database:

restaurant_db