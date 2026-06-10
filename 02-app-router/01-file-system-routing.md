# File-system Routing

In the App Router, folders define route segments and special files define
behavior.

```txt
app/
  page.tsx                  -> /
  about/page.tsx            -> /about
  dashboard/page.tsx        -> /dashboard
  dashboard/users/page.tsx  -> /dashboard/users
```

The route is created by the folder path. The UI for that route is exported from
`page.tsx`.

## Dynamic Segments

Use square brackets when part of the URL changes:

```txt
app/
  startup/
    [id]/
      page.tsx              -> /startup/:id
```

```tsx
export default async function StartupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <h1>Startup {id}</h1>
}
```

The exact `params` typing changed across Next versions. Current App Router
examples often type `params` as a `Promise` in async pages. If your project uses
an older version, check that version's docs.

## Route Groups

Parentheses organize folders without changing the URL:

```txt
app/
  (marketing)/
    layout.tsx
    page.tsx                -> /
    about/page.tsx          -> /about
  (dashboard)/
    layout.tsx
    dashboard/page.tsx      -> /dashboard
```

Use route groups when you need different layouts or ownership boundaries but do
not want the folder name in the URL.

## Project Route Tree

YC Directory shape:

```txt
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
    auth/[...nextauth]/route.ts
    ai/pitch-analysis/route.ts
```

Why:

- `(root)/layout.tsx` owns public navigation.
- `startup/[id]` owns startup details.
- `startup/create` owns authenticated mutation UI.
- `user/[id]` owns profile and submitted startups.
- API routes are reserved for external clients, auth callbacks, AI, webhooks, or
  cases where a Server Action is not the right boundary.

## Common Mistakes

- Creating `about.tsx` instead of `about/page.tsx`.
- Putting route groups in links, e.g. linking to `/(root)/startup/123`.
- Creating duplicate route paths in two route groups.
- Forgetting that `layout.tsx` persists across navigation while `template.tsx`
  remounts.

