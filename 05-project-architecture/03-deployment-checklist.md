# Deployment Checklist

The final video chapter deploys to Vercel, then fixes CORS and OAuth callback
configuration. That is a real production lesson: most deploy failures are
environment/config mismatches, not React bugs.

## Before Deploy

- `npm run typecheck` passes.
- `npm run lint` passes if lint script exists.
- No raw transcript or private notes are committed.
- `.env.local` is not committed.
- `.env.example` lists required secret names only.
- Server-only modules import `server-only`.

## Vercel Environment Variables

Add variables for production and preview environments:

```bash
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_VERSION=
SANITY_WRITE_TOKEN=
AI_GATEWAY_API_KEY=
SENTRY_AUTH_TOKEN=
```

## GitHub OAuth

Local:

```txt
Homepage URL: http://localhost:3000
Callback URL: http://localhost:3000/api/auth/callback/github
```

Production:

```txt
Homepage URL: https://your-app.vercel.app
Callback URL: https://your-app.vercel.app/api/auth/callback/github
```

If these do not match, login fails even when your code is correct.

## Sanity CORS

Add your production origin in Sanity project settings:

```txt
https://your-app.vercel.app
```

Allow credentials if the app needs authenticated Sanity requests from the
browser. Prefer server-side reads/writes when credentials or tokens are involved.

## Do Not Disable Quality Gates Permanently

Tutorials often suggest:

```ts
typescript: { ignoreBuildErrors: true },
eslint: { ignoreDuringBuilds: true },
```

Treat that as a temporary rescue only. The professional move is to fix the
errors and keep the gates on.

## Smoke Test After Deploy

1. Home page loads.
2. Search updates URL and results.
3. Startup details page loads.
4. View counter changes without breaking cached content.
5. Login works.
6. Create page redirects unauthenticated users.
7. Authenticated user can submit a startup.
8. New startup appears after cache refresh/live update.
9. AI pitch analysis route returns structured JSON.
10. Sentry receives a test error in the right environment.

