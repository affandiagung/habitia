# Deployment

Habitia targets Vercel with Supabase Auth, Supabase Postgres, and Prisma.

## Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
DATABASE_URL=
DIRECT_URL=
```

## Build Steps

```bash
npm install
npx prisma generate
npm run build
```

## Supabase Notes

- Enable email auth in Supabase Auth.
- Configure the production URL as an allowed redirect URL.
- Run Prisma migrations against Supabase Postgres before the first production deploy.
- Add RLS policies through Supabase SQL migrations before opening the app to real users.
