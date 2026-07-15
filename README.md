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
3. Database design
4. Prisma schema
5. Authentication
6. Layout
7. UI Components

Next step after approval: **8. Family module**

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

## Database Design

Habitia uses Supabase Auth for login identity and Supabase Postgres for application data. Prisma will manage the application tables in the `public` schema. Supabase-owned authentication tables stay outside Prisma ownership.

### Core Ownership Model

One Supabase auth user represents one family account.

```text
auth.users
  -> app_profiles
    -> families
      -> family_members
      -> goals
        -> activities
      -> daily_entries
        -> activity_records
```

The app stores the Supabase auth user ID as `authUserId` on the application profile. We do not let Prisma modify Supabase's internal `auth.users` table.

### Main Entities

#### App Profile

Represents the logged-in account inside the application.

Fields:

- `id`
- `authUserId`
- `email`
- `displayName`
- `createdAt`
- `updatedAt`

Why it exists:

- Keeps app-specific user data separate from Supabase Auth internals.
- Gives every owned record a stable application-level owner.

#### Family

Represents the household workspace.

Fields:

- `id`
- `profileId`
- `name`
- `description`
- `avatarUrl`
- `timezone`
- `createdAt`
- `updatedAt`

Rule:

- One profile owns one family for the initial product scope.

Trade-off:

- A strict one-family model matches the brief and keeps onboarding simple. If we later need multi-family accounts, the relationship can become one-to-many without changing the child data model much.

#### Family Member

Represents a person managed inside the family. Members are not login accounts.

Fields:

- `id`
- `familyId`
- `name`
- `nickname`
- `avatarUrl`
- `gender`
- `birthDate`
- `role`
- `colorTheme`
- `createdAt`
- `updatedAt`

Design decision:

- Family members do not reference `auth.users` because only the account owner signs in.

#### Goal

Represents a family goal or habit program.

Fields:

- `id`
- `familyId`
- `title`
- `description`
- `icon`
- `color`
- `category`
- `type`
- `status`
- `startDate`
- `endDate`
- `createdAt`
- `updatedAt`

Design decision:

- Goal templates are presets only. Once created, a template-based goal becomes a normal goal.

#### Activity

Represents a measurable action inside a goal.

Fields:

- `id`
- `goalId`
- `title`
- `description`
- `type`
- `targetValue`
- `targetUnit`
- `sortOrder`
- `isRequired`
- `createdAt`
- `updatedAt`

Supported activity types:

- Checkbox
- Number
- Duration
- Distance
- Text
- Rating

Design decision:

- Activities carry a flexible target value and unit so future activity types can be added without redesigning the entire database.

#### Daily Entry

Represents a member's progress for a specific date.

Fields:

- `id`
- `familyId`
- `memberId`
- `entryDate`
- `completionRate`
- `createdAt`
- `updatedAt`

Rule:

- One daily entry per family member per calendar date.

Design decision:

- Daily progress is grouped by member and date so dashboard, calendar, and reports can query historical progress efficiently.

#### Activity Record

Represents the recorded result for one activity on one daily entry.

Fields:

- `id`
- `dailyEntryId`
- `activityId`
- `status`
- `booleanValue`
- `numberValue`
- `textValue`
- `ratingValue`
- `completedAt`
- `createdAt`
- `updatedAt`

Design decision:

- Multiple value columns avoid storing everything as untyped JSON. This makes reporting and chart queries easier later.

Trade-off:

- This is less flexible than a pure JSON value field, but it is much better for analytics, filtering, and validation.

#### Goal Template

Represents optional starter templates.

Fields:

- `id`
- `title`
- `description`
- `icon`
- `color`
- `category`
- `defaultDurationDays`
- `isActive`
- `createdAt`
- `updatedAt`

Template activities can be modeled separately as `goal_template_activities`.

Design decision:

- Templates are global presets, not user-owned goals. Copying a template creates editable user-owned goal and activity records.

### Relationship Summary

- `AppProfile` has one `Family`.
- `Family` has many `FamilyMember` records.
- `Family` has many `Goal` records.
- `Goal` has many `Activity` records.
- `FamilyMember` has many `DailyEntry` records.
- `DailyEntry` has many `ActivityRecord` records.
- `Activity` has many `ActivityRecord` records.

### Status and Enum Direction

Likely enums for the Prisma schema:

- `FamilyMemberRole`: father, mother, son, daughter, grandparent, other
- `Gender`: male, female, other, prefer_not_to_say
- `GoalType`: custom, template
- `GoalStatus`: draft, active, paused, completed, archived
- `GoalCategory`: health, religion, learning, finance, lifestyle, custom
- `ActivityType`: checkbox, number, duration, distance, text, rating
- `ActivityRecordStatus`: pending, completed, skipped, missed

### Constraints and Indexes

Important constraints:

- Unique `AppProfile.authUserId`
- Unique `Family.profileId` for the one-family-per-account rule
- Unique daily entry by `memberId` and `entryDate`
- Unique activity record by `dailyEntryId` and `activityId`

Important indexes:

- `families.profileId`
- `family_members.familyId`
- `goals.familyId`
- `activities.goalId`
- `daily_entries.familyId, entryDate`
- `daily_entries.memberId, entryDate`
- `activity_records.activityId`

### Supabase Auth and RLS Direction

Supabase Auth provides the authenticated user ID. Application rows are owned through `AppProfile.authUserId`.

RLS policy direction:

- A user can read and write only rows connected to their own `auth.uid()`.
- Family-owned tables should verify ownership through the family -> profile -> auth user relationship.
- Template tables can be readable by authenticated users, but writable only by service/admin flows.

Design decision:

- Ownership checks should happen in database policies, not only in application code. The Next.js server and Prisma still validate access, but RLS provides a second boundary.

### Reporting Considerations

The schema intentionally stores normalized daily records instead of only deriving progress from current goal state.

Why:

- Calendar views need historical daily snapshots.
- Reports need completion rates by member, goal, week, month, and year.
- Streaks and missed activities are easier to calculate from durable records.

Future optimization:

- Add summary tables or materialized views for large datasets if dashboard/report queries become expensive.

### Edge Cases

- If a goal changes after historical records exist, old daily records should remain valid.
- If an activity is deleted, historical records should either be preserved with a soft delete strategy or protected by archive behavior.
- Timezone must belong to the family because daily checklist boundaries depend on the household's local date.
- Completion should handle optional activities so skipped optional work does not unfairly reduce progress.

### Future Improvements

- Multi-family ownership under one login.
- Member-specific goals instead of every goal being family-wide.
- Reminder schedules and notification preferences.
- Audit log for sensitive changes.
- Materialized reporting views for high-volume analytics.

## Prisma Schema

The Prisma schema lives in `prisma/schema.prisma` and implements the database design above.

### Schema Decisions

- Prisma manages only application tables in the `public` schema. Supabase Auth remains the source of truth for login identity.
- Primary keys use Postgres UUIDs generated by `gen_random_uuid()`.
- Prisma model names use PascalCase while database tables use snake_case through `@@map` and `@map`.
- Calendar fields such as `startDate`, `endDate`, `birthDate`, and `entryDate` use Postgres `date` columns instead of timestamps.
- Auditing fields use timezone-aware timestamps through `@db.Timestamptz(6)`.
- Progress and measurable values use `Decimal` instead of floating point numbers to avoid rounding surprises in reports.
- Enums are used for roles, statuses, categories, goal types, activity types, and record statuses.
- Historical `ActivityRecord` rows restrict activity deletion. Product flows should archive activities later instead of deleting records that reports depend on.

### Migration Notes

- Supabase must have the `pgcrypto` extension available for `gen_random_uuid()`.
- RLS policies are not represented in Prisma and should be added through Supabase SQL migrations.
- The schema expects both `DATABASE_URL` and `DIRECT_URL` environment variables for Supabase-compatible Prisma workflows.

## Authentication

Supabase Auth handles registration, login, logout, email verification, forgot password, and password reset. The app does not store or validate passwords directly.

### Routes

- `/login` signs in an existing family account.
- `/register` creates a new Supabase Auth account.
- `/forgot-password` sends a Supabase password reset email.
- `/reset-password` lets a verified reset session choose a new password.
- `/auth/callback` exchanges Supabase email verification codes for an app session.
- `/dashboard` is the first protected route and currently acts as the post-login placeholder.

### Implementation Decisions

- Supabase browser, server, and middleware clients live in `src/lib/supabase`.
- Auth forms live in `src/features/auth` because authentication is a product feature with its own actions and UI.
- Server actions call Supabase Auth APIs so credentials are never handled by custom API routes.
- Middleware refreshes sessions and protects authenticated routes.
- Authenticated users are redirected away from auth pages to `/dashboard`.
- Unauthenticated users visiting protected routes are redirected to `/login?next=...`.
- Registration stores `display_name` in Supabase Auth user metadata. Creating `AppProfile` and `Family` records will happen after authentication is stable and onboarding rules are implemented.

### Trade-offs

- The current auth UI is intentionally simple. The full app shell, navigation, and premium responsive layout belong to the Layout and UI Components steps.
- Middleware protects route access early, while database RLS still needs to be added later through Supabase migrations.
- Server actions keep auth flows compact, but form validation is currently minimal. Zod validation can be added when form patterns are standardized.

## Layout

The authenticated product area uses a shared app shell around the `(dashboard)` route group.

### Layout Structure

- `src/app/(dashboard)/layout.tsx` verifies the Supabase session and wraps protected pages in the app shell.
- `src/components/layout/app-shell.tsx` owns the main authenticated page frame.
- `src/components/layout/app-navigation.tsx` owns desktop sidebar, mobile top bar, and mobile bottom navigation.

### Responsive Behavior

- Desktop and large laptop screens use a persistent left sidebar.
- Mobile and tablet screens use a sticky top bar with a fixed bottom navigation.
- Future modules appear as disabled navigation items until their implementation steps are approved.
- Main content uses a constrained max width with responsive padding and extra bottom padding on mobile so content does not sit under the bottom navigation.

### Design Decisions

- The layout is quiet and dashboard-oriented instead of marketing-like. It prioritizes repeat daily use.
- The sidebar reserves space for the family account identity and product modules.
- Mobile navigation surfaces the highest-frequency destinations: dashboard, goals, checklist, calendar, and reports.
- The dashboard page now sits inside the app shell and only contains placeholder summary panels. Real dashboard widgets remain part of the Dashboard step.

### Trade-offs

- Navigation is visible before all modules exist, but disabled states make the product direction clear without creating unfinished pages.
- The layout uses local Tailwind styles for now. Reusable button, card, input, dialog, and navigation primitives will be standardized in the UI Components step.
- A drawer is not implemented yet because the current module list fits the sidebar/mobile-bottom pattern. A drawer can be added when Settings or secondary actions need more room.

## UI Components

The first UI component layer is a small shadcn-inspired primitive set in `src/components/ui`.

### Components Added

- `Button` and `buttonClasses` for actions and link-style buttons.
- `Input` for text, email, and password fields.
- `Label` for accessible form labeling.
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` for framed content.
- `Badge` for compact status indicators.
- `Alert` for success, default, and danger messages.
- `Skeleton` for loading placeholders.
- `cn` utility in `src/utils/cn.ts` using `clsx` and `tailwind-merge`.

### Design Decisions

- Components are intentionally low-level primitives, not product-specific widgets.
- Styling uses neutral surfaces, 8px radius, soft borders, and accessible focus rings.
- Components support dark mode through Tailwind dark variants.
- `buttonClasses` exists so links can look like buttons without invalid button/link nesting.
- Existing auth forms and dashboard placeholders now use the shared primitives.

### Trade-offs

- No Radix-based dialogs, dropdowns, tabs, or menus were added yet because those interactions are not needed until later feature steps.
- The primitive set is small, which keeps the design system easy to change before many modules depend on it.
- Form validation UI remains basic. Zod and React Hook Form patterns should be standardized when feature forms become more complex.

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
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=
DIRECT_URL=
```

`DATABASE_URL` will be used by Prisma. `DIRECT_URL` is reserved for Supabase direct database connections when migrations require it.
