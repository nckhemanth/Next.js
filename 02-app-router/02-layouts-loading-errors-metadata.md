# Layouts, Loading, Errors, and Metadata

The App Router uses file conventions to attach behavior to a route segment.

| File | Purpose |
|---|---|
| `layout.tsx` | Persistent wrapper for child routes |
| `page.tsx` | UI for a route |
| `loading.tsx` | Suspense fallback for loading route content |
| `error.tsx` | Client error boundary for a segment |
| `global-error.tsx` | Global error boundary |
| `not-found.tsx` | UI for `notFound()` |
| `route.ts` | HTTP route handler |

## Layouts

Root layout is required:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

Segment layout:

```tsx
export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  )
}
```

Interview point: layouts preserve state and do not rerender like pages on every
navigation. Put persistent UI there; keep page-specific fetches in pages or
leaf components.

## Loading UI

`loading.tsx` is an automatic Suspense fallback:

```tsx
export default function Loading() {
  return <p>Loading...</p>
}
```

For dynamic islands inside an otherwise fast page, use explicit Suspense:

```tsx
import { Suspense } from 'react'

export default function StartupPage() {
  return (
    <>
      <StartupStaticContent />
      <Suspense fallback={<ViewsSkeleton />}>
        <Views startupId="abc" />
      </Suspense>
    </>
  )
}
```

## Error UI

Segment error boundaries must be Client Components:

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </section>
  )
}
```

Errors bubble to the nearest parent `error.tsx`. You do not see every error file
on the path; the closest boundary wins.

## Metadata

Static metadata:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YC Directory',
  description: 'Pitch, discover, and analyze startup ideas.',
}
```

Dynamic metadata:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const startup = await getStartup(id)

  return {
    title: startup.title,
    description: startup.description,
    openGraph: {
      images: [startup.image],
    },
  }
}
```

File-based metadata like `favicon.ico`, `opengraph-image.tsx`, `robots.ts`, and
`sitemap.ts` can override config metadata. In production projects, use config
metadata for route-specific content and file metadata for global assets.

