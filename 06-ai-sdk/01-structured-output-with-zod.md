# Vercel AI SDK: Structured Output with Zod

This is the requested AI block:

> Connect TypeScript + Zod + Next.js to a real AI flow using a structured output
> path end to end.

In AI SDK 6, the current structured-output path is `generateText` with
`Output.object({ schema })`. This is the current equivalent to the older
`generateObject` mental model.

## Contract First

Define the schema before writing the route:

```ts
import { z } from 'zod'

export const pitchAnalysisSchema = z.object({
  score: z.number().int().min(1).max(10),
  summary: z.string().min(20),
  strengths: z.array(z.string()).min(1).max(5),
  risks: z.array(z.string()).min(1).max(5),
  suggestedCategory: z.enum([
    'AI',
    'Developer Tools',
    'Healthcare',
    'Education',
    'Fintech',
    'Consumer',
    'Other',
  ]),
  founderQuestions: z.array(z.string()).min(1).max(5),
})

export type PitchAnalysis = z.infer<typeof pitchAnalysisSchema>
```

## Validate Input Too

```ts
export const pitchAnalysisRequestSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(2).max(40),
  pitch: z.string().min(20).max(6000),
})
```

## Next.js Route Handler

```ts
import { generateText, Output } from 'ai'
import { z } from 'zod'
import {
  pitchAnalysisRequestSchema,
  pitchAnalysisSchema,
} from '@/schemas/ai'

export async function POST(request: Request) {
  const json = await request.json()
  const parsed = pitchAnalysisRequestSchema.safeParse(json)

  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid pitch input', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { title, description, category, pitch } = parsed.data

  const { output } = await generateText({
    model: 'openai/gpt-4.1-mini',
    output: Output.object({
      name: 'PitchAnalysis',
      description: 'Structured startup pitch analysis for a YC Directory clone.',
      schema: pitchAnalysisSchema,
    }),
    prompt: `
Analyze this startup pitch.

Title: ${title}
Category: ${category}
Description: ${description}
Pitch:
${pitch}
    `.trim(),
  })

  return Response.json(output)
}
```

## Why This Is Better Than Plain Text

Plain text:

- Needs parsing.
- Breaks when wording changes.
- Can silently omit fields.
- Pushes validation problems downstream.

Structured output:

- Uses the Zod schema as the contract.
- Produces a typed output.
- Fails when the model cannot satisfy the shape.
- Can be consumed directly by UI, storage, or tests.

## Interview Answer

> I do not trust an LLM response just because I asked for JSON. I define the
> expected object with Zod, pass that schema to the AI SDK structured-output API,
> and validate both the user input and model output. The route returns typed JSON
> only after the schema succeeds.

