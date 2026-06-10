# Forms, Server Actions, and Zod

Forms are where Next.js becomes full-stack.

## URL Search Forms

For search that updates URL params, use Next's `Form` component:

```tsx
import Form from 'next/form'

export function SearchForm({ query }: { query?: string }) {
  return (
    <Form action="/" scroll={false} className="search-form">
      <input name="query" defaultValue={query ?? ''} placeholder="Search startups" />
      <button type="submit">Search</button>
    </Form>
  )
}
```

This keeps search state shareable in the URL:

```txt
/?query=health
```

The page reads it:

```tsx
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const { query } = await searchParams
  const startups = await getStartups(query)
  return <StartupGrid startups={startups} />
}
```

## Mutation Forms

For writes, use a Server Action.

```ts
'use server'

export async function createPitch(_: unknown, formData: FormData) {
  const values = Object.fromEntries(formData)
  // validate, authorize, write, revalidate
}
```

Client form with `useActionState`:

```tsx
'use client'

import { useActionState } from 'react'

export function StartupForm() {
  const [state, action, isPending] = useActionState(createPitch, {
    status: 'INITIAL',
  })

  return (
    <form action={action}>
      <input name="title" />
      <button disabled={isPending}>Submit</button>
      {state.status === 'ERROR' ? <p>{state.error}</p> : null}
    </form>
  )
}
```

## Zod Boundary

Use Zod at every untrusted boundary:

```ts
import { z } from 'zod'

const pitchSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(40),
  imageUrl: z.string().url(),
  pitch: z.string().min(10),
})
```

Server Action:

```ts
const parsed = pitchSchema.safeParse({
  title: formData.get('title'),
  description: formData.get('description'),
  category: formData.get('category'),
  imageUrl: formData.get('imageUrl'),
  pitch,
})

if (!parsed.success) {
  return {
    status: 'ERROR',
    fieldErrors: parsed.error.flatten().fieldErrors,
  }
}
```

## Form Reset Gotcha

React form actions can reset fields after submission. If you want to preserve
values after validation errors, put submitted values into action state and feed
them back as `defaultValue`.

Interview answer:

> I validate on the server even if the client validates too. Client validation
> is UX; server validation is security and data integrity.

