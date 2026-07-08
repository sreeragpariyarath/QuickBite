# Development Rules

Conventions and rules that apply to every service in this monorepo.

---

## TypeScript

- Strict mode is enabled in every service — do not disable it.
- Never use `any`. Use `unknown` and narrow it, or define a proper type/interface.
- Prefer explicit return types on all public functions and class methods.
- Use dependency injection — never instantiate services with `new` inside other services.

---

## NestJS

**Feature-based modules.** Each domain feature gets its own module.

```
auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
└── dto/
    ├── register.dto.ts
    └── login.dto.ts
```

**Thin controllers.** Controllers only parse the request and call the service. No business logic.

Bad:
```typescript
@Post('register')
async register(@Body() body: any) {
  const exists = await this.prisma.user.findUnique({ where: { email: body.email } });
  if (exists) throw new Error('Email taken');
  return this.prisma.user.create({ data: body });
}
```

Good:
```typescript
@Post('register')
async register(@Body() dto: RegisterDto) {
  return this.authService.register(dto);
}
```

**DTO validation is required** on every endpoint that accepts a body or query params. Use `class-validator` decorators.

---

## Prisma

- UUID primary keys on all models: `@id @default(uuid()) @db.Uuid`
- All schema changes require a migration — never modify the database manually.
- No raw SQL unless explicitly approved. Use the Prisma query API.
- Use soft delete (`deletedAt DateTime?`) where data retention matters.

---

## API

- REST only.
- Consistent response shape across all endpoints.
- Use correct HTTP status codes:
  - `200` — success (GET, PATCH)
  - `201` — resource created (POST)
  - `204` — success with no body (DELETE)
  - `400` — bad request / validation failure
  - `401` — unauthenticated
  - `403` — authenticated but not permitted
  - `404` — resource not found
  - `409` — conflict (e.g. email already registered)

---

## Error Handling

Always use NestJS built-in HTTP exceptions. Never throw a generic `Error`.

Bad:
```typescript
throw new Error('User not found');
```

Good:
```typescript
throw new NotFoundException('User not found');
```

Common exceptions:

| Exception | When to use |
|---|---|
| `BadRequestException` | Invalid input or validation failure |
| `UnauthorizedException` | Request is not authenticated |
| `ForbiddenException` | Authenticated but lacks permission |
| `NotFoundException` | Resource does not exist |
| `ConflictException` | Duplicate resource (e.g. email already registered) |
