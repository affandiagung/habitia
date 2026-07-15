# Testing

Testing starts with fast unit tests around pure helpers, then expands toward integration tests for server actions and feature flows.

## Commands

```bash
npm run typecheck
npm run lint
npm run test
```

## Current Coverage

- Checklist date helper unit tests.

## Next Test Targets

- Zod validation schemas for family, goals, activities, and checklist records.
- Server action ownership checks.
- Dashboard/report aggregate calculations.
- Playwright smoke tests after the app can run locally.
