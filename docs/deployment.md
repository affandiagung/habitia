# Deployment

Habitia targets Vercel with Supabase Auth, Supabase Postgres, and Prisma.

## Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://your-production-domain.vercel.app
DATABASE_URL=
DIRECT_URL=
```

Use `http://localhost:3000` only for local development. In Vercel, `NEXT_PUBLIC_SITE_URL` must be the production URL, for example:

```bash
NEXT_PUBLIC_SITE_URL=https://habitia.vercel.app
```

If you use a custom domain, use that domain instead:

```bash
NEXT_PUBLIC_SITE_URL=https://app.yourdomain.com
```

## Build Steps

```bash
npm install
npx prisma generate
npm run build
```

`prisma generate` also runs automatically through the `postinstall` script during Vercel installs.

## Supabase Notes

- Enable email auth in Supabase Auth.
- Configure the production URL as an allowed redirect URL.
- Add these redirect URLs in Supabase Auth URL settings:
  - `http://localhost:3000/auth/callback`
  - `https://your-production-domain.vercel.app/auth/callback`
  - `https://your-custom-domain.com/auth/callback` if using a custom domain
- Run Prisma migrations against Supabase Postgres before the first production deploy.
- Add RLS policies through Supabase SQL migrations before opening the app to real users.
