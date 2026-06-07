# Decisions

## D-001

Decision:
Use NestJS instead of Express.

Reason:
Better microservice support.
Better architecture.
TypeScript-first.

---

## D-002

Decision:
Use Prisma.

Reason:
Focus on microservices instead of SQL boilerplate.

---

## D-003

Decision:
Use UUIDs.

Reason:
Distributed system compatibility.

---

## D-004

Decision:
Single users table.

Roles:

- CUSTOMER
- OWNER

Reason:
Avoid duplication.