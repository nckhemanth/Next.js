# Next.js Interview Question Bank

## Foundations

### What does Next.js add over React?

Routing, rendering strategies, Server Components integration, backend route
handlers, Server Actions, metadata, image/font/script optimization, caching, and
deployment conventions.

### Server Component vs Client Component?

Server Components run on the server, can access server resources, and do not
ship their component code to the browser. Client Components run/hydrate in the
browser and are needed for state, effects, event handlers, and browser APIs.

### When do you add `"use client"`?

Only when that component needs browser interactivity or a browser-only API. Keep
the boundary as low as possible.

## App Router

### How do dynamic routes work?

A folder in square brackets creates a dynamic segment:

```txt
app/startup/[id]/page.tsx -> /startup/:id
```

The page reads `params`.

### What are route groups?

Folders wrapped in parentheses organize code or layouts without affecting the
URL, e.g. `app/(root)/page.tsx` still maps to `/`.

### How do layouts differ from pages?

Pages render route content. Layouts wrap child routes and persist across
navigation. Root layout is required.

### Why does `error.tsx` need `"use client"`?

It is a React error boundary and uses client-side reset behavior.

## Rendering and Caching

### SSR vs SSG vs ISR?

SSR renders per request. SSG renders at build time. ISR serves static output but
revalidates after a time window or invalidation event.

### What is PPR/Cache Components conceptually?

A static or cached shell is sent quickly while uncached dynamic islands stream
through Suspense boundaries.

### When do you use `cache: 'no-store'` or uncached reads?

When data must be fresh per request: auth/session, read-after-write, view
counters, user-specific state, admin previews.

### How do you avoid a cache bug after creating an author in Sanity?

Read with `useCdn: false` for the callback/JWT path because CDN reads can miss
just-written documents.

## Full-stack

### Server Action vs route handler?

Use Server Actions for app-owned form mutations. Use route handlers for HTTP API
boundaries: webhooks, external clients, AI endpoints, OAuth/library callbacks,
uploads, streaming.

### Why validate with Zod if TypeScript already exists?

TypeScript is compile-time only. Form input, request JSON, CMS data, and AI
responses are runtime data and must be validated at runtime.

### How would you secure a Sanity write token?

Keep it in a server-only module, never prefix it with `NEXT_PUBLIC_`, import
`server-only`, and call it only from Server Actions, route handlers, or server
code.

### How do you implement AI structured output?

Define a Zod schema, validate the request input, call AI SDK structured output
with `Output.object({ schema })`, and return only the validated object.

## Deployment

### What breaks after Vercel deployment most often?

Missing environment variables, OAuth callback URL mismatch, Sanity CORS missing
the production origin, and build errors hidden during local dev.

### Would you disable TypeScript errors to deploy?

Only as a temporary tutorial/debug escape hatch. In a real project I fix the
errors and keep quality gates enabled.

