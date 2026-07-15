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

Next step after approval: **4. Prisma schema**

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
