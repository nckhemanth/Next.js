# Project Setup and Versioning

The video flow starts with `create-next-app`, TypeScript, ESLint, Tailwind, App
Router, and Turbopack. That remains a solid starting point.

```bash
npx create-next-app@latest .
```

Recommended answers for this project style:

| Prompt | Choice |
|---|---|
| TypeScript | Yes |
| ESLint | Yes |
| Tailwind CSS | Yes |
| `src/` directory | Optional; this guide uses root `app/` |
| App Router | Yes |
| Turbopack | Yes for dev |
| Import alias | Keep default `@/*` |

## Versions Matter

Next.js APIs move. A good repo should say which version it targets.

At creation time for this guide:

```txt
next: 16.2.9
react: 19.2.7
ai: 6.0.199
```

The transcript covered several Next 15-era patterns:

- `experimental_ppr`
- `experimental.after`
- route-level `revalidate`
- `fetch(..., { next: { revalidate } })`

Those are still useful to understand, but current Next.js docs emphasize Cache
Components for the newest App Router caching model:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

With Cache Components, you mark cached work explicitly:

```ts
export async function getStartup(id: string) {
  'use cache'
  // fetch from CMS/database
}
```

## Package Overrides

The video adds overrides so nested packages cannot pull incompatible React
versions. That idea is reasonable when mixing beta packages:

```json
{
  "overrides": {
    "react": "$react",
    "react-dom": "$react-dom",
    "next": "$next"
  }
}
```

Use this when dependency resolution actually causes duplicate React versions.
Do not add overrides blindly if the package manager is already resolving cleanly.

## Environment Files

Typical project variables:

```bash
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_VERSION=
SANITY_WRITE_TOKEN=

SENTRY_AUTH_TOKEN=
AI_GATEWAY_API_KEY=
```

Rules:

- `.env.local` is local only.
- `NEXT_PUBLIC_*` is visible in the browser.
- Write tokens are never public.
- AI provider keys stay in route handlers or Server Actions.

## Build Discipline

The transcript temporarily disables TypeScript/ESLint build failures to get a
deployment through. That can be useful for a tutorial demo, but it is not a
professional default.

Better answer in an interview:

> I would keep TypeScript and lint checks enabled in production builds. If a
> tutorial disables them, I treat that as a temporary escape hatch, then fix the
> actual errors before shipping.

