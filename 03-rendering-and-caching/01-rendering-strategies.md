# Rendering Strategies

Rendering is the answer to: **when and where is the HTML produced?**

## Client-side Rendering

```txt
server sends shell -> browser downloads JS -> JS fetches data -> UI appears
```

Good for:

- Highly interactive private dashboards.
- Widgets whose content is not SEO-relevant.
- Browser-only behavior.

Weaknesses:

- Slower first content.
- Worse SEO if the meaningful content appears only after client fetch.
- More JavaScript shipped.

## Server-side Rendering

```txt
request arrives -> server fetches data -> server renders HTML -> browser receives content
```

Good for:

- Fresh data per request.
- Personalized pages.
- Authenticated views.
- SEO pages that cannot be stale.

Tradeoff: more server work and less CDN reuse.

## Static Generation

```txt
build/deploy -> HTML generated -> CDN serves it quickly
```

Good for:

- Docs.
- Marketing pages.
- Blog posts.
- Pages where content changes rarely.

Tradeoff: content can be stale until rebuild or revalidation.

## Incremental Static Regeneration

ISR lets a static page refresh after deployment.

Previous model:

```tsx
export const revalidate = 60
```

Or per fetch:

```tsx
await fetch('https://example.com/api/startups', {
  next: { revalidate: 60 },
})
```

Use it when most requests can see cached content but the cache should refresh on
a predictable interval.

## Partial Pre-rendering / Cache Components

The core idea:

```txt
static/cached shell is sent fast -> dynamic islands stream in when ready
```

In the transcript, this was explained with `experimental_ppr` and Suspense. In
current Next.js, Cache Components make this model more explicit:

- Enable `cacheComponents`.
- Mark cacheable work with `"use cache"`.
- Use Suspense around uncached dynamic work.
- Use cache tags/lifetimes for invalidation and freshness.

Conceptually, the YC Directory startup details page becomes:

```tsx
export default async function StartupPage({ id }: { id: string }) {
  return (
    <>
      <CachedStartupDetails id={id} />
      <Suspense fallback={<ViewsSkeleton />}>
        <FreshViewsCounter id={id} />
      </Suspense>
    </>
  )
}
```

## Decision Table

| Page/data | Strategy |
|---|---|
| Static hero text | Static / cached |
| Startup details from CMS | Cached server work with revalidation/tag invalidation |
| View counter | Dynamic server render or streamed island |
| Create form | Client UI + Server Action |
| Auth session navbar | Server read; small client UI only if needed |
| Search results | Server read from URL params; live updates if CMS supports it |

