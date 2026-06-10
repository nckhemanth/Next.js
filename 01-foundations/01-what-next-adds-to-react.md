# What Next.js Adds to React

React is a UI library. Next.js is a production framework around React.

React gives you components, state, effects, context, and rendering primitives.
Next.js adds the application system around them:

- File-system routing.
- Server Components and Client Component boundaries.
- Data fetching on the server.
- Route handlers for backend endpoints.
- Server Actions / Server Functions for mutations.
- Rendering strategies: static, dynamic, cached, streamed.
- Metadata, image/font/script optimizations.
- Deployment conventions for serverless and edge runtimes.

## The Interview Answer

Next.js solves the production concerns that plain React leaves to the team:
routing, rendering strategy, bundling, code splitting, SEO, server-side data
access, API endpoints, and deployment integration. You still write React, but
the framework decides where code runs and how the response is produced.

## The Main Shift

Old React mental model:

```txt
browser downloads JS -> React fetches data -> React renders UI
```

Next.js App Router mental model:

```txt
server renders route tree -> cached/static/dynamic parts are resolved -> browser hydrates only client islands
```

That difference matters because it changes the default place for work:

| Work | Default in a mature Next app |
|---|---|
| Read from database/CMS | Server Component or cached server function |
| Validate form submission | Server Action / route handler |
| Use `useState`, click handlers, browser APIs | Client Component |
| Show SEO/indexable content | Server-rendered HTML |
| Keep API keys safe | Server-only module |

## Server-first Does Not Mean Client-never

Server Components are the default because they reduce client JavaScript and can
access server-only resources. Client Components still matter for interaction:

- Search input that manages live keystrokes.
- Markdown editor.
- Menus, dialogs, drag/drop, timers.
- Components using `useState`, `useEffect`, `useRef`, or browser APIs.

The senior pattern is to keep the interactive island small:

```tsx
// Server Component
export default async function StartupPage() {
  const startup = await getStartup()

  return (
    <>
      <StartupDetails startup={startup} />
      <BookmarkButton startupId={startup.id} />
    </>
  )
}
```

```tsx
'use client'

export function BookmarkButton({ startupId }: { startupId: string }) {
  const [saved, setSaved] = useState(false)
  return <button onClick={() => setSaved(!saved)}>Save {startupId}</button>
}
```

The whole page does not become client-side just because one button needs state.

## What to Avoid

- Do not put `"use client"` at the top of every file.
- Do not fetch server data in `useEffect` by default.
- Do not expose secrets through `NEXT_PUBLIC_` variables.
- Do not build API routes just to call your own database from a Server Component.
- Do not disable TypeScript/ESLint build failures as a normal deployment strategy.

## Project Rule

For a YC Directory style app:

- Home feed: server-rendered, search driven by URL params.
- Startup details: mostly cached/static, view counter dynamic/streamed.
- Create form: client component for editor state, Server Action for mutation.
- Auth callbacks and Sanity write client: server-only.
- AI pitch analysis: route handler or Server Action, Zod schema on input and output.

