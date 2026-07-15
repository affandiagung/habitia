# Habitia

Habitia is a family goal and habit tracking SaaS application.

## Approved Stack

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- Supabase Auth
- Supabase Postgres
- Prisma ORM
- Vercel deployment target

## Development Flow

This project is built incrementally. Each major feature requires approval before implementation.

Completed steps:

1. Project setup
2. Folder architecture

Next step after approval: **3. Database design**

## Folder Architecture

The application uses a feature-oriented structure with shared platform layers.

```text
src/
  app/                 Next.js App Router routes and route groups
    (auth)/            Public authentication routes
    (dashboard)/       Authenticated product routes
  components/
    layout/            App shell, navigation, and page layout components
    ui/                Reusable low-level UI primitives
  config/              Runtime-safe app configuration
  constants/           Shared static values and option lists
  features/            Product modules grouped by business capability
    activities/
    calendar/
    checklist/
    dashboard/
    family/
    goals/
    reports/
    settings/
  hooks/               Shared React hooks
  lib/
    prisma/            Prisma client and database helpers
    supabase/          Supabase browser/server clients
  server/              Server-only application services
  styles/              Shared style assets beyond app globals
  types/               Shared TypeScript types
  utils/               Generic utilities without product ownership
prisma/                Prisma schema and migrations later
supabase/migrations/   Supabase SQL migrations and policies later
public/images/         Static image assets
```

### Design Decisions

- Feature modules keep product logic close to the domain that owns it. Family, goals, activities, checklist, dashboard, calendar, reports, and settings can evolve independently.
- `app/` stays focused on routing, layouts, loading states, and route composition. Business logic should not accumulate directly inside pages.
- `components/ui` is reserved for reusable primitives such as buttons, inputs, dialogs, and cards. Product-specific components should live inside their feature folders.
- `lib/prisma` and `lib/supabase` are separated because Prisma owns application data access while Supabase owns authentication and platform clients.
- `server/` is reserved for server-only services that coordinate multiple features or external systems.

### Trade-offs

- This structure has more folders than a tiny app, but it prevents a SaaS product from becoming a flat collection of unrelated files.
- Feature folders add a small amount of upfront ceremony, but they make later modules easier to test, review, and refactor.
- Shared folders are intentionally narrow. If code belongs to one domain, it should stay in that feature instead of becoming global too early.

## Getting Started

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
DIRECT_URL=
```

`DATABASE_URL` will be used by Prisma. `DIRECT_URL` is reserved for Supabase direct database connections when migrations require it.
