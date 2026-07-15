# Performance

The app currently favors server-rendered pages and scoped Prisma queries.

## Current Decisions

- Server Components are used by default for data-heavy pages.
- Client Components are limited to forms and interactive navigation.
- Dashboard, Calendar, and Reports query only the family owned by the current session.
- Decimal values are normalized before crossing into client-facing props.

## Optimization Backlog

- Add pagination for long activity and report histories.
- Add materialized views or summary tables for high-volume reports.
- Cache stable template data.
- Add database indexes after observing query plans in Supabase.
- Add route-level loading states for Calendar and Reports if queries grow heavier.
