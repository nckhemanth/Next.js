# Route Handlers

Route handlers are backend endpoints inside the App Router.

```txt
app/api/books/route.ts          -> /api/books
app/api/books/[id]/route.ts     -> /api/books/:id
```

```ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello from the backend' })
}
```

## HTTP Methods

```ts
export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ received: body }, { status: 201 })
}
```

Supported method exports include `GET`, `POST`, `PUT`, `PATCH`, `DELETE`,
`HEAD`, and `OPTIONS`.

## When to Use Route Handlers

Use route handlers for:

- Webhooks.
- AI endpoints called by the browser.
- OAuth provider callbacks handled by a library.
- Public APIs for external clients.
- File uploads or streaming responses.

Do not create route handlers just so your own Server Component can call them.
Server Components can call server data functions directly.

Bad:

```tsx
const res = await fetch('http://localhost:3000/api/startups')
```

Better:

```tsx
const startups = await getStartups()
```

## AI Route Handler Example

```ts
import { generateText, Output } from 'ai'
import { z } from 'zod'

const schema = z.object({
  score: z.number().min(1).max(10),
  summary: z.string(),
})

export async function POST(request: Request) {
  const { pitch } = await request.json()

  const { output } = await generateText({
    model: 'openai/gpt-4.1-mini',
    output: Output.object({ schema }),
    prompt: `Score this startup pitch: ${pitch}`,
  })

  return Response.json(output)
}
```

The real project repo includes this pattern with input validation too.

