# Habitia - Family Goal & Habit Tracking SaaS

**Live App:** [habitia-one.vercel.app](https://habitia-one.vercel.app/)  
**GitHub:** [github.com/affandiagung/habitia](https://github.com/affandiagung/habitia)

Habitia is a family-focused goal and habit tracking SaaS application. It helps one family account manage members, goals, activities, daily checklist progress, calendar history, and analytics reports in one shared workspace.

Unlike a normal todo app, Habitia is designed around long-running family goals and measurable daily habits. One logged-in account manages the family workspace, while family members are tracked as internal profiles without separate login accounts.

---

## Preview

> Screenshots can be added to `public/images/portfolio/` and referenced here.

| Dashboard | Daily Checklist |
| --- | --- |
| ![Habitia dashboard](public/images/portfolio/dashboard.png) | ![Habitia daily checklist](public/images/portfolio/checklist.png) |

| Goals | Calendar |
| --- | --- |
| ![Habitia goals](public/images/portfolio/goals.png) | ![Habitia calendar](public/images/portfolio/calendar.png) |

Recommended screenshots:

- `public/images/portfolio/dashboard.png`
- `public/images/portfolio/family.png`
- `public/images/portfolio/goals.png`
- `public/images/portfolio/activities.png`
- `public/images/portfolio/checklist.png`
- `public/images/portfolio/calendar.png`
- `public/images/portfolio/reports.png`

---

## Product Problem

Families often track goals informally through notes, chats, or todo apps. That works for simple tasks, but it does not work well for habits and long-term goals that involve multiple family members.

Habitia solves this by providing:

- One shared family workspace.
- Member-based progress tracking.
- Goal and activity structure.
- Daily checklist recording.
- Historical calendar visibility.
- Progress analytics and reports.

The core product idea is simple: a family should be able to define what they want to build together, record progress every day, and see meaningful patterns over time.

---

## Target Users

Habitia is designed for families where one parent or account owner manages daily progress for everyone.

Example structure:

```text
Family Account
└── Family Workspace
    ├── Father
    ├── Mother
    ├── Child 1
    └── Child 2
```

Family members do not need separate accounts. This keeps the product simpler, easier to manage, and more realistic for household routines.

---

## Key Features

### Authentication

- Supabase Auth registration and login.
- Email verification flow.
- Forgot password and reset password flow.
- Protected dashboard routes.
- Authenticated users are redirected to the dashboard automatically.

### Family Module

- Create and manage one family workspace.
- Edit family name, description, avatar URL, and timezone.
- Add family members.
- Track member role, nickname, gender, birth date, and color theme.

### Goals Module

- Create custom goals.
- Create template-based goals.
- Edit goals after creation.
- Delete goals safely with related activity/checklist cleanup.
- Define goal category, color, icon, start date, and end date.

### Activities Module

- Create activities under goals.
- Support multiple activity types:
  - Checkbox
  - Number
  - Duration
  - Distance
  - Text
  - Rating
- Set target values and units.
- Mark activities as required or optional.
- Automatically generate pending checklist records based on the goal date range.

### Daily Checklist

- Select checklist date.
- Record progress for each family member.
- Save each member/activity record independently.
- Support statuses:
  - Pending
  - Completed
  - Skipped
  - Missed
- Enforce goal date boundaries, so activities can only be recorded inside the goal period.
- Automatically calculate daily completion rate.

### Dashboard

- Today's family progress.
- Active goals summary.
- Required activity summary.
- Current goals.
- Family ranking.
- Recent activity feed.

### Calendar

- Monthly progress calendar.
- Color-coded day status:
  - Green: completed
  - Yellow: partial
  - Red: missed
  - Gray: no record
- Selected date detail panel.

### Reports

- Average completion.
- Days tracked.
- Completed and missed records.
- Most active member.
- Member-level report.
- Goal-level report.

### Settings

- Account summary.
- Family profile settings.
- Session sign out.

---

## Technical Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- Custom reusable UI primitives
- Server Components by default
- Client Components for interactive forms and navigation

### Backend

- Next.js Server Actions
- Supabase Auth
- Supabase Postgres
- Prisma ORM
- Zod validation

### Deployment

- Vercel
- Supabase hosted PostgreSQL
- Environment-based production configuration

---

## Architecture Highlights

The codebase uses a feature-oriented folder structure:

```text
src/
  app/                 Next.js routes and route groups
  components/          Shared layout and UI primitives
  features/            Product modules
    auth/
    family/
    goals/
    activities/
    checklist/
    dashboard/
    calendar/
    reports/
    settings/
  lib/
    prisma/
    supabase/
  utils/
```

This structure keeps product logic close to the domain that owns it. For example, goal validation, actions, queries, and UI live inside `src/features/goals`.

---

## Database Design

Habitia uses Supabase Auth for identity and Prisma-managed tables for application data.

Core relationship model:

```text
Supabase Auth User
└── AppProfile
    └── Family
        ├── FamilyMembers
        ├── Goals
        │   └── Activities
        └── DailyEntries
            └── ActivityRecords
```

Important design decisions:

- Supabase Auth owns login credentials.
- Prisma manages application tables in the public schema.
- Family members are not auth users.
- Daily progress is normalized into `DailyEntry` and `ActivityRecord` tables.
- Completion rates are recalculated from required activities.
- Goal date ranges control which activities appear in the checklist.

---

## UX Decisions

Habitia uses a calm, dashboard-style SaaS interface with a light blue visual direction.

Design goals:

- Clear daily workflow.
- Minimal visual noise.
- Responsive layout for desktop and mobile.
- Sidebar navigation on desktop.
- Bottom navigation on mobile.
- Card-based analytics sections.
- Helpful empty states.

The UI intentionally avoids making the product feel like a generic todo list. Goals, activities, and reports are structured around long-term progress instead of one-off task completion.

---

## Engineering Decisions

### Server-first Data Loading

Most pages load data through Server Components and Prisma queries. This reduces client-side complexity and keeps sensitive database access on the server.

### Server Actions for Mutations

Create, update, delete, and checklist recording flows use Server Actions. This keeps form handling close to the related feature module.

### Ownership Checks

Server actions resolve the current family from the authenticated Supabase session. The app does not trust posted ownership IDs from forms.

### Validation

Zod schemas validate user input for:

- Family profile updates.
- Family member creation.
- Goal creation and updates.
- Activity creation.
- Checklist record updates.

### Date-bound Checklist Logic

Activities are tied to their parent goal period. If a goal runs from July 10 to July 20, its activities are generated and editable only within that date range.

---

## Challenges Solved

### 1. Family Members Without Separate Login Accounts

The product needed to track multiple people while keeping authentication simple. The solution was to separate Supabase Auth users from internal family members.

### 2. Goal-based Checklist Generation

Activities must follow their parent goal date range. When an activity is created, pending checklist records are generated for every family member across the goal period.

### 3. Accurate Completion Calculation

Completion must ignore optional activities. The app recalculates daily completion based only on required active activities scheduled for that date.

### 4. Historical Reporting

Daily checklist data is stored as durable history instead of being derived only from current goal state. This enables calendar views and reports.

---

## Verification

The project currently passes:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Testing currently includes unit tests for checklist date helpers, with room to expand into validation, server action, and E2E coverage.

---

## Future Improvements

- Supabase Storage avatar uploads.
- Member edit/archive flows.
- Goal archive instead of destructive deletion.
- Drag-and-drop activity ordering.
- Weekly and daily calendar views.
- Chart-based reports.
- Reminder notifications.
- RLS policies for production hardening.
- Playwright E2E smoke tests.
- Materialized report summaries for larger datasets.

---

## Project Links

- **Live App:** [https://habitia-one.vercel.app/](https://habitia-one.vercel.app/)
- **Repository:** [https://github.com/affandiagung/habitia](https://github.com/affandiagung/habitia)
