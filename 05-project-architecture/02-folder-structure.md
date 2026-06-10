# Folder Structure

Recommended project repo layout:

```txt
nextjs-yc-directory/
  app/
    layout.tsx
    globals.css
    (root)/
      layout.tsx
      page.tsx
      startup/
        [id]/page.tsx
        create/page.tsx
      user/
        [id]/page.tsx
    api/
      ai/pitch-analysis/route.ts
  components/
    navbar.tsx
    search-form.tsx
    startup-card.tsx
    startup-form.tsx
    views.tsx
  lib/
    actions.ts
    auth.ts
    data.ts
    validation.ts
    utils.ts
  sanity/
    lib/
      client.ts
      queries.ts
      write-client.ts
    schemaTypes/
      author.ts
      playlist.ts
      startup.ts
  schemas/
    ai.ts
    pitch.ts
  types/
    index.ts
```

## Folder Responsibilities

| Folder | Owns |
|---|---|
| `app/` | Routes, layouts, route handlers, metadata |
| `components/` | Reusable UI |
| `lib/` | Server actions, validation, auth config, helpers |
| `sanity/` | CMS clients, queries, schema definitions |
| `schemas/` | Zod contracts shared by actions/routes |
| `types/` | App-level TypeScript types |
| `docs/` | Project-specific architecture notes |

## Why Not Put Everything in `app/`?

`app/` should reveal routing. If every helper, schema, query, and UI component
lives there, the route tree becomes harder to reason about.

Good split:

- `app/(root)/page.tsx` orchestrates route-level data.
- `components/startup-card.tsx` renders repeated UI.
- `sanity/lib/queries.ts` owns GROQ.
- `lib/actions.ts` owns mutations.
- `schemas/pitch.ts` owns validation contracts.

## Import Rule

Server-only modules should be impossible to accidentally use on the client:

```ts
// sanity/lib/write-client.ts
import 'server-only'
```

Then importing it from a Client Component fails fast.

## Naming Rule

Use names that describe domain behavior:

- `createPitch`
- `getStartupById`
- `getStartupsByAuthor`
- `pitchAnalysisSchema`
- `authorByGithubIdQuery`

Avoid names like:

- `handler`
- `data`
- `helper`
- `doStuff`

