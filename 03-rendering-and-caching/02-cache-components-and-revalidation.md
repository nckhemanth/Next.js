# Cache Components and Revalidation

Caching changed significantly across Next.js versions. Interviewers care less
about memorized syntax and more about whether you understand the model.

## Two Models You Must Recognize

### Previous App Router caching model

You often used:

```tsx
export const revalidate = 60
```

```tsx
await fetch(url, { cache: 'no-store' })
```

```tsx
await fetch(url, { next: { revalidate: 60, tags: ['startups'] } })
```

```tsx
import { revalidatePath, revalidateTag } from 'next/cache'
```

### Cache Components model

You enable:

```ts
const nextConfig = {
  cacheComponents: true,
}
```

Then cache at the function/component level:

```tsx
import { cacheLife, cacheTag } from 'next/cache'

export async function getStartup(id: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag(`startup:${id}`)

  return fetchStartupFromCms(id)
}
```

Dynamic work that is not cached should be behind Suspense when mixed into a
route that otherwise prerenders.

## Time-based vs On-demand Revalidation

Time-based:

```tsx
// Previous model
await fetch(url, { next: { revalidate: 3600 } })
```

On-demand:

```tsx
import { revalidateTag } from 'next/cache'

export async function publishStartup(id: string) {
  'use server'
  await writeStartup(id)
  revalidateTag(`startup:${id}`)
}
```

Use time-based revalidation when "eventually fresh" is acceptable. Use
on-demand invalidation after writes, CMS webhooks, admin edits, or critical
state changes.

## Avoiding Cache Bugs

Common failure from the transcript:

1. Auth callback creates a Sanity author.
2. JWT callback immediately queries Sanity for that author.
3. Query reads from CDN cache and misses the just-created document.
4. Session ID becomes undefined.

Fix: use a non-CDN server read when read-after-write consistency matters.

```ts
const author = await client
  .withConfig({ useCdn: false })
  .fetch(authorByGithubIdQuery, { id })
```

Rule:

| Situation | Use CDN/cache? |
|---|---|
| Public feed | Yes, usually |
| Details page content | Yes with tags/lifetimes |
| Immediately after a write | No |
| Auth/session enrichment | No |
| Admin preview/draft | No or preview-specific |

## Interview Answer

> I treat caching as part of the data contract. Public content can be cached and
> invalidated by time or tags. Auth, writes, and read-after-write flows need
> fresh server reads. When mixing cached and uncached work in one route, I isolate
> the dynamic work behind Suspense so the static shell can stream quickly.

