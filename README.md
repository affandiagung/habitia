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

Current step: **1. Project setup**

Next step after approval: **2. Folder architecture**

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
