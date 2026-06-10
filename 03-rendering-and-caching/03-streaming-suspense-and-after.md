# Streaming, Suspense, and Background Work

Streaming lets the server send useful UI before every async dependency has
finished.

## Suspense Boundary

```tsx
import { Suspense } from 'react'

export default function StartupDetailsPage() {
  return (
    <main>
      <StaticPitchContent />
      <Suspense fallback={<ViewsSkeleton />}>
        <Views />
      </Suspense>
    </main>
  )
}
```

The fallback appears while `Views` resolves. This is the core trick behind a
fast page with one dynamic piece.

## View Counter Pattern

The transcript's view counter pattern:

1. Fetch current views dynamically.
2. Show the current number.
3. Increment views after the response so UI is not blocked.

In Next 15 this was demonstrated with `unstable_after`. In current Next, check
the version-specific API before using it; the concept remains:

- Do not block first paint on analytics-style writes.
- Keep write clients server-only.
- Make the dynamic component small.

Conceptual code:

```tsx
export async function Views({ startupId }: { startupId: string }) {
  const views = await getFreshViews(startupId)

  scheduleAfterResponse(async () => {
    await incrementViews(startupId, views + 1)
  })

  return <p>{views} views</p>
}
```

## What Should Stream?

Good candidates:

- View counters.
- Personalized recommendations.
- Related content.
- User-specific buttons.
- Slow analytics-derived summaries.

Poor candidates:

- Primary title.
- Main article body.
- Critical form fields.
- Anything whose absence makes the page feel broken.

## Fallback Quality

Use skeletons where shape is known:

```tsx
export function StartupCardSkeleton() {
  return <li className="h-80 rounded-lg bg-slate-200 animate-pulse" />
}
```

Use text fallback only for truly small UI.

## Interview Answer

> Suspense is not just a loading spinner. In the App Router it is a rendering
> boundary. It lets static or cached content reach the user while uncached
> dynamic work streams later. For a startup details page, I would stream the
> view counter or recommendations, not the main pitch content.

