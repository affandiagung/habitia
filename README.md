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
8. Family module
9. Goals module
10. Activities module
11. Daily Checklist
12. Dashboard
13. Calendar
14. Reports
15. Settings
16. Deployment
17. Testing
18. Performance optimization

All planned incremental build steps are complete for the current baseline.

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

## Family Module

The Family module is available at `/family` and is the first domain module in the authenticated app.

### Features Implemented

- Automatically creates an `AppProfile` for the current Supabase user when needed.
- Automatically creates the user's single `Family` workspace when needed.
- Allows editing family name, description, avatar URL, and timezone.
- Allows adding family members with name, nickname, role, gender, birth date, color theme, and avatar URL.
- Lists existing family members with role, nickname, birth date state, and color marker.
- Enables Family in desktop and mobile navigation.

### Implementation Details

- Prisma client singleton lives in `src/lib/prisma/client.ts`.
- Family queries live in `src/features/family/queries.ts`.
- Family server actions live in `src/features/family/actions.ts`.
- Zod validation schemas live in `src/features/family/validation.ts`.
- Family form options live in `src/features/family/options.ts`.
- Family UI lives in `src/features/family` and the route entry is `src/app/(dashboard)/family/page.tsx`.

### Design Decisions

- The logged-in Supabase user owns one application profile and one family workspace.
- Family members are internal app records and do not have Supabase Auth accounts.
- Server actions always resolve the owned family from the current session instead of trusting posted ownership IDs.
- Family timezone is editable because daily checklist boundaries depend on local household date.
- Member deletion is intentionally deferred because later historical checklist and report records need a clear archive/delete policy.

### Validation

- Family name and member name require at least 2 characters.
- Avatar fields accept empty values or valid URLs.
- Role, gender, and color theme are restricted to known values.
- Birth date accepts an empty value or a valid date.

### Edge Cases

- If the profile exists but the family does not, the Family page creates the missing family.
- If a user signs in before an app profile exists, the Family page creates it from Supabase Auth data.
- If an unauthenticated user visits `/family`, middleware and the dashboard layout redirect to `/login`.

### Future Improvements

- Member edit flow.
- Member archive/delete flow with historical data protection.
- Avatar upload through Supabase Storage instead of raw avatar URLs.
- Richer empty states and onboarding prompts after the Layout and Dashboard modules mature.

## Goals Module

The Goals module is available at `/goals` and creates the family-level goal containers that activities will belong to.

### Features Implemented

- Lists goals owned by the current family.
- Creates custom goals.
- Creates template-based goals from editable preset values.
- Stores title, description, icon label, color, category, type, status, start date, and optional end date.
- Enables Goals in desktop and mobile navigation.
- Protects `/goals` through middleware and the authenticated app layout.

### Implementation Details

- Goal queries live in `src/features/goals/queries.ts`.
- Goal server actions live in `src/features/goals/actions.ts`.
- Zod validation lives in `src/features/goals/validation.ts`.
- Template and option values live in `src/features/goals/options.ts`.
- Goal creation UI lives in `src/features/goals/create-goal-form.tsx`.
- Goal list UI lives in `src/features/goals/goal-list.tsx`.
- Route entry is `src/app/(dashboard)/goals/page.tsx`.

### Design Decisions

- Goals belong to the family, not individual members, matching the initial product brief.
- Templates are code-level presets for now. Selecting one fills editable fields and saves a normal user-owned goal.
- Created goals start as `ACTIVE` because this form represents intentional creation, not draft saving.
- Activities are intentionally not created in this step. The next module owns activity types, targets, units, and validation.
- Server actions resolve the current family from the authenticated session and never trust posted family IDs.

### Validation

- Goal title requires at least 2 characters.
- Category, type, and color are restricted to known values.
- Start date is required.
- End date is optional but must not be before start date.

### Edge Cases

- If a user reaches `/goals` before a Family exists, the shared family ownership helper creates the missing profile/family records.
- Goals can exist without activities until Step 10 is implemented.
- Template-based goals are stored as normal goals, so future edits do not depend on the original preset.

### Future Improvements

- Goal edit flow.
- Goal pause/archive flow.
- Database-seeded templates and template activities.
- Goal detail page with attached activities and progress analytics.

## Activities Module

The Activities module is available at `/activities` and defines measurable actions inside goals.

### Features Implemented

- Lists activities grouped by goal.
- Creates activities under an existing family-owned goal.
- Supports activity types: checkbox, number, duration, distance, text, and rating.
- Stores title, description, type, target value, target unit, sort order, and required/optional completion rule.
- Enables Activities in desktop and mobile navigation.
- Protects `/activities` through middleware and the authenticated app layout.

### Implementation Details

- Activity queries live in `src/features/activities/queries.ts`.
- Activity server actions live in `src/features/activities/actions.ts`.
- Zod validation lives in `src/features/activities/validation.ts`.
- Activity type options live in `src/features/activities/options.ts`.
- Activity creation UI lives in `src/features/activities/create-activity-form.tsx`.
- Activity list UI lives in `src/features/activities/activity-list.tsx`.
- Route entry is `src/app/(dashboard)/activities/page.tsx`.

### Design Decisions

- Activities must belong to a goal. The page shows a helpful empty state if no goals exist yet.
- Server actions verify that the selected goal belongs to the current authenticated family before creating an activity.
- Numeric target validation is required for number, duration, distance, and rating activity types.
- Checkbox and text activities can omit numeric targets.
- Rating targets are capped at 5 to match the product brief.
- Required/optional is explicit because optional activities should not unfairly reduce completion later.

### Validation

- Activity title requires at least 2 characters.
- Goal ID must be a valid UUID and owned by the current family.
- Type is restricted to supported activity types.
- Numeric activity targets must be greater than zero.
- Rating target cannot be greater than 5.
- Sort order must be zero or greater.

### Edge Cases

- If a user has no goals, the create form is replaced by a message asking them to create a goal first.
- If a posted goal ID does not belong to the current family, the server action rejects it.
- Activities can exist before daily records. Daily completion state starts in the Daily Checklist step.

### Future Improvements

- Activity edit flow.
- Activity archive flow instead of destructive deletion.
- Drag-and-drop sorting.
- Type-specific form controls with richer units.
- Goal detail pages that manage activities in context.

## Daily Checklist

The Daily Checklist is available at `/checklist` and records per-member progress for a selected calendar date.

### Features Implemented

- Selects the checklist date through a date input and `?date=` URL state.
- Shows every family member.
- Groups active goal activities under each member.
- Saves each member/activity record independently.
- Supports record statuses: pending, completed, skipped, and missed.
- Stores typed values for checkbox, number, duration, distance, text, and rating activities.
- Upserts `DailyEntry` records by member and date.
- Upserts `ActivityRecord` records by daily entry and activity.
- Recalculates member daily completion rate after every save.
- Enables Checklist in desktop and mobile navigation.

### Implementation Details

- Date utilities live in `src/features/checklist/date.ts`.
- Checklist queries live in `src/features/checklist/queries.ts`.
- Checklist server actions live in `src/features/checklist/actions.ts`.
- Zod validation lives in `src/features/checklist/validation.ts`.
- Date picker UI lives in `src/features/checklist/checklist-date-form.tsx`.
- Per-activity record UI lives in `src/features/checklist/activity-record-form.tsx`.
- Per-member checklist grouping lives in `src/features/checklist/member-checklist.tsx`.
- Route entry is `src/app/(dashboard)/checklist/page.tsx`.

### Completion Calculation

- Completion is calculated per member per date.
- Only required activities from active goals count toward the percentage.
- Completed required activities increase completion.
- Pending, skipped, and missed required activities do not count as completed.
- Optional activities can be recorded but do not reduce completion.

### Design Decisions

- Each activity row saves independently. This keeps progress recording resilient and avoids losing a whole page of changes if one row has invalid data.
- The URL owns the selected date so refreshes and future calendar links can open a specific day.
- The checklist uses normalized `DailyEntry` and `ActivityRecord` rows so Dashboard, Calendar, and Reports can query durable history later.
- Checkbox completion stores a boolean derived from completed status.

### Edge Cases

- If there are no family members, the page asks the user to add members first.
- If there are no active activities, the page asks the user to create goals and activities first.
- If a posted member or activity does not belong to the current family, the server action rejects it.
- If a date is invalid or missing, the page falls back to today's date.

### Future Improvements

- Bulk save for a member's whole day.
- Faster inline controls for checkbox activities.
- Undo toast after recording changes.
- Family timezone-aware date helpers instead of UTC date parsing.
- Stronger history behavior when activities are archived later.

## Dashboard

The Dashboard is available at `/dashboard` and now uses real family, goal, activity, and checklist data.

### Features Implemented

- Today's average family completion.
- Active goal count.
- Activity and required activity totals.
- Current goal summary.
- Family ranking by today's completion.
- Recent checklist activity.
- Loading skeleton for dashboard route transitions.

### Trade-offs

- Dashboard aggregates are calculated directly with Prisma queries for now. Summary tables can be added later when data volume grows.
- Streak calculations are deferred because they need a careful date/timezone model.

## Calendar

The Calendar is available at `/calendar` and displays monthly daily progress summaries.

### Features Implemented

- Month grid for the selected date's month.
- Color indicators: green completed, yellow partial, red missed, gray no record.
- Selected date details with member completion and activity statuses.
- Date navigation through `?date=` links.

### Trade-offs

- Monthly view is implemented first because it gives the highest value for historical scanning. Weekly and daily dedicated views can be layered on top later.

## Reports

Reports are available at `/reports` and summarize historical checklist data.

### Features Implemented

- Average family completion.
- Days tracked.
- Completed and missed record totals.
- Most active member.
- Member report.
- Goal report.

### Trade-offs

- Reports use simple visual bars and cards instead of a charting dependency. A chart library can be added after requirements stabilize.

## Settings

Settings are available at `/settings`.

### Features Implemented

- Account summary from the app profile.
- Family profile settings reuse.
- Session sign out.

### Trade-offs

- Destructive account deletion is not implemented yet because it needs policy, confirmations, auditability, and Supabase Auth cleanup decisions.

## Deployment

Deployment configuration and notes live in `vercel.json` and `docs/deployment.md`.

### Design Decisions

- Vercel remains the deployment target.
- Supabase redirect URLs and Prisma generation are documented as explicit deployment requirements.
- RLS policies are called out as required before real production use.

## Testing

Testing notes live in `docs/testing.md`.

### Implemented

- Added Vitest script.
- Added a first unit test for checklist date helpers.

### Trade-offs

- Broad automated coverage is intentionally staged. Dependency installation is still required before tests can run locally.

## Performance Optimization

Performance notes live in `docs/performance.md`.

### Current Optimizations

- Server Components by default.
- Client Components only for interactive forms/navigation.
- Family-scoped Prisma queries.
- Serialized Decimal values before client-facing props.

### Future Optimizations

- Pagination for long histories.
- Summary tables or materialized views for reports.
- Query-plan-based indexes after real Supabase usage data.

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
