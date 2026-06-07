# Development Rules

## TypeScript

- Strict mode enabled.
- Never use any.
- Prefer explicit types.

## NestJS

- Controllers must be thin.
- Services contain business logic.
- Validation through DTOs.

Bad:

Controller contains business logic.

Good:

Controller calls service.

## Prisma

- UUID primary keys.
- Migrations required.
- No raw SQL unless approved.

## Error Handling

Use NestJS exceptions.

Bad:

throw new Error()

Good:

throw new NotFoundException()