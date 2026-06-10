# Cheatsheet

## File Conventions

```txt
page.tsx          route UI
layout.tsx        persistent wrapper
loading.tsx       Suspense fallback
error.tsx         segment error boundary, client component
not-found.tsx     notFound() UI
route.ts          HTTP endpoint
```

## Routing

```txt
app/about/page.tsx          /about
app/startup/[id]/page.tsx   /startup/:id
app/(root)/page.tsx         /, group not in URL
```

## Server vs Client

Server by default:

```tsx
export default async function Page() {
  const data = await getData()
  return <pre>{JSON.stringify(data)}</pre>
}
```

Client only when needed:

```tsx
'use client'
```

## Search Params

```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const { query } = await searchParams
}
```

## Dynamic Params

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
}
```

## Server Action

```ts
'use server'

export async function action(_: unknown, formData: FormData) {
  // auth, validate, mutate, revalidate
}
```

## Zod Form Boundary

```ts
const parsed = schema.safeParse(Object.fromEntries(formData))
if (!parsed.success) {
  return { status: 'ERROR', fieldErrors: parsed.error.flatten().fieldErrors }
}
```

## AI SDK Structured Output (provider-agnostic; Claude shown)

```ts
// Stable: generateObject → validated, typed `object`
const { object } = await generateObject({
  model: anthropic('claude-opus-4-8'),
  schema,
  prompt,
})

// Beside text: generateText + Output.object({ schema })
const { experimental_output } = await generateText({
  model: anthropic('claude-opus-4-8'),
  experimental_output: Output.object({ schema }), // AI SDK 6: output / { output }
  prompt,
})
```

## Caching Decision

| Need | Choice |
|---|---|
| Static content | Cache/prerender |
| Public CMS content | Cache with lifetime/tag |
| Auth/session | Fresh server read |
| View counter | Dynamic/streamed island |
| After write | Revalidate tag/path or fresh read |

## Deployment Fixes

- Vercel env vars match local names.
- GitHub OAuth callback URL uses production domain.
- Sanity CORS includes production domain.
- TypeScript and lint pass.
- No `.env.local` in git.

