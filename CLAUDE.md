# QuickBite — Claude Instructions

## Response format

@CLAUDE_RESPONSE_FORMAT.md

## Project conventions

- Docs in `docs/` are the source of truth: PROJECT_CONTEXT (product), ARCHITECTURE (design), DECISIONS (ADR log), ROADMAP (phases), DEVELOPMENT_RULES (code standards).
- Every new endpoint ships with DTO validation, role guards where applicable, and full Swagger decorators (`@ApiOperation`, `@ApiProperty` with examples on DTOs, response decorators, `@ApiBearerAuth` on guarded routes). No undocumented endpoints.
- After adding endpoints, run `pnpm openapi` in the service to refresh `docs/openapi/*.openapi.json`, then `pnpm postman` at the root to regenerate `postman/generated/*.postman_collection.json` (injects collection auth + auto-save scripts). Postman collections are build artifacts — never hand-edit them.
- Each service generates its Prisma client into its own `node_modules/@prisma-app/client` — never use the default shared output (pnpm monorepo conflict).
- `prisma migrate dev` fails in non-interactive shells — write migration SQL manually and apply with `prisma migrate deploy`.
- Commit and push after each completed chunk of work.
- The user runs services in his own terminals — provide commands instead of starting long-running dev servers for him.
