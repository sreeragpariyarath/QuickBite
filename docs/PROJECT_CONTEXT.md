# QuickBite

## Project Overview

QuickBite is a microservices-based food delivery platform built to learn:

- Microservices Architecture
- NestJS
- RabbitMQ
- Redis
- Docker
- CI/CD
- AWS

The project is intended to be production-grade and portfolio-worthy.

---

## Business Domain

QuickBite allows customers to browse restaurants and place food orders.

Restaurant owners can manage restaurants and menu items.

---

## User Roles

### CUSTOMER

Permissions:

- Register
- Login
- Browse restaurants
- Browse menus
- Create orders
- View own orders

Restrictions:

- Cannot create restaurants
- Cannot manage menus

---

### OWNER

Permissions:

- Register
- Login
- Create restaurants
- Manage menus
- View incoming orders
- Accept orders
- Reject orders

Restrictions:

- Cannot access another owner's restaurant

---

## Current Phase

Current Sprint:
Sprint 1

Current Focus:
Auth Service

Current Goals:

- Setup PostgreSQL
- Setup Prisma
- User Registration
- Login
- JWT
- Refresh Tokens