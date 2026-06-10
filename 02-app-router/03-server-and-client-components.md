# Server and Client Components

Next.js App Router defaults components to Server Components.

That default is one of the biggest differences from a client-only React app.

## Server Components

Server Components:

- Run on the server.
- Can read files, databases, CMS clients, and secrets.
- Do not ship their component code to the browser.
- Cannot use browser-only hooks like `useState` or `useEffect`.
- Can render Client Components as children.

Example:

```tsx
export default async function HomePage() {
  const startups = await getStartups()
  return <StartupGrid startups={startups} />
}
```

## Client Components

Client Components start with `"use client"`:

```tsx
'use client'

import { useState } from 'react'

export function SearchDraft() {
  const [query, setQuery] = useState('')
  return <input value={query} onChange={event => setQuery(event.target.value)} />
}
```

Use a Client Component when you need:

- `useState`, `useReducer`, `useEffect`, `useRef`.
- Event handlers like `onClick`.
- Browser APIs like `window`, `document`, `localStorage`.
- Third-party components that depend on the DOM.

## Boundary Rule

Once a file is marked `"use client"`, its imports become part of the client
bundle unless they are type-only or otherwise tree-shaken safely.

Bad:

```tsx
'use client'

import { writeClient } from '@/sanity/lib/write-client'
```

Good:

```tsx
// Server action file
'use server'

import { writeClient } from '@/sanity/lib/write-client'
```

Then call the action from a form or client UI.

## Serialization Rule

Props crossing from Server Component to Client Component must be serializable.

Good:

```tsx
<Editor initialPitch={startup.pitch} startupId={startup.id} />
```

Risky:

```tsx
<Editor client={sanityClient} createdAt={new Date()} />
```

Pass IDs and plain data. Keep clients, connections, and functions on the server.

## Interview Answer

> Server Components reduce client JavaScript and let the server fetch data
> directly. Client Components are still necessary for browser interactivity. A
> strong Next.js design keeps most of the route server-rendered and isolates
> interactive parts behind small client boundaries.

