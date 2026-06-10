# Vercel AI SDK: Structured Output with Zod

This is the requested AI block:

> Connect TypeScript + Zod + Next.js to a real AI flow using a structured output
> path end to end.

The Vercel **AI SDK** (`ai` package) is provider-agnostic — the same code runs on
Anthropic, OpenAI, Google, etc.; you only swap the `model`. Examples here default to
**Claude** (`@ai-sdk/anthropic`); the one-line provider swap is shown at the end.

There are two structured-output APIs. Lead with `generateObject` — it's the stable,
unambiguous one and what most interviewers expect — then use the `generateText` +
`Output.object` path when you want structured data *alongside* a normal text generation.

## Contract First

Define the output schema before writing the route. `.describe()` on fields becomes part
of the instruction the model sees:

```ts
import { z } from 'zod'

export const pitchAnalysisSchema = z.object({
  score: z.number().int().min(1).max(10).describe('Investment-readiness, 1–10'),
  summary: z.string().min(20),
  strengths: z.array(z.string()).min(1).max(5),
  risks: z.array(z.string()).min(1).max(5),
  suggestedCategory: z.enum([
    'AI', 'Developer Tools', 'Healthcare', 'Education', 'Fintech', 'Consumer', 'Other',
  ]),
  founderQuestions: z.array(z.string()).min(1).max(5),
})

export type PitchAnalysis = z.infer<typeof pitchAnalysisSchema>
```

## Validate Input Too

Zod guards **both** ends — the untrusted request *and* the model's output:

```ts
export const pitchAnalysisRequestSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(2).max(40),
  pitch: z.string().min(20).max(6000),
})
```

## Primary path — `generateObject` (stable)

`generateObject` takes a Zod `schema` and returns a typed, schema-validated `object`. Use
`schemaName` / `schemaDescription` to name the structure for the model.

```ts
// app/api/analyze/route.ts
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import {
  pitchAnalysisRequestSchema,
  pitchAnalysisSchema,
} from '@/schemas/ai'

export async function POST(request: Request) {
  const parsed = pitchAnalysisRequestSchema.safeParse(await request.json())
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid pitch input', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }
  const { title, description, category, pitch } = parsed.data

  const { object } = await generateObject({
    model: anthropic('claude-opus-4-8'),
    schema: pitchAnalysisSchema,
    schemaName: 'PitchAnalysis',
    schemaDescription: 'Structured startup pitch analysis for a YC Directory clone.',
    prompt: `Analyze this startup pitch.
Title: ${title}
Category: ${category}
Description: ${description}
Pitch:
${pitch}`,
  })

  // `object` is already validated against the schema and typed as PitchAnalysis.
  return Response.json(object)
}
```

Streaming variant: `streamObject({ model, schema, prompt })` for incremental UI updates.

## Variant — `generateText` + `Output.object` (structured output beside text)

When you want the model to produce free-form text *and* a structured object in one call,
attach `Output.object({ schema })` to `generateText`. The schema goes in `Output.object` —
nothing else:

```ts
import { generateText, Output } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { pitchAnalysisSchema } from '@/schemas/ai'

const { experimental_output } = await generateText({
  model: anthropic('claude-opus-4-8'),
  experimental_output: Output.object({ schema: pitchAnalysisSchema }),
  prompt: `Analyze this startup pitch: ${pitch}`,
})

return Response.json(experimental_output)
```

> Version note: in the shipped AI SDK this is `experimental_output` (input) and
> `experimental_output` (result). AI SDK 6 stabilizes it to `output` /
> `{ output }` — same `Output.object({ schema })` shape either way. If you're unsure
> which version you're on, prefer `generateObject` above; it's stable across all of them.

## As a Server Action (instead of a route)

Same flow, no route handler — call it from a form:

```ts
'use server'
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { pitchAnalysisRequestSchema, pitchAnalysisSchema } from '@/schemas/ai'

export async function analyzePitch(_: unknown, formData: FormData) {
  const parsed = pitchAnalysisRequestSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { status: 'ERROR', fieldErrors: parsed.error.flatten().fieldErrors }
  }
  const { object } = await generateObject({
    model: anthropic('claude-opus-4-8'),
    schema: pitchAnalysisSchema,
    prompt: `Analyze: ${parsed.data.pitch}`,
  })
  return { status: 'SUCCESS', analysis: object }
}
```

## Swapping providers (one line)

The AI SDK is provider-agnostic — only the `model` changes:

```ts
import { anthropic } from '@ai-sdk/anthropic'
model: anthropic('claude-opus-4-8')       // Claude (default here)
// import { openai } from '@ai-sdk/openai'
// model: openai('gpt-4.1-mini')
// import { google } from '@ai-sdk/google'
// model: google('gemini-2.5-flash')
```

Set the provider's key in env (`ANTHROPIC_API_KEY` for `@ai-sdk/anthropic`) and validate
it with Zod at startup (see the Zod env-validation pattern).

## Why Structured Output Beats "Ask for JSON"

| Plain text "return JSON" | `generateObject` / `Output.object` |
|---|---|
| You parse and pray | Validated against the Zod schema |
| Breaks when wording drifts | Shape is the contract |
| Can silently omit fields | Fails loudly if the model can't satisfy it |
| Type is `any` downstream | Typed via `z.infer` end to end |

## Interview Answer

> I don't trust an LLM response just because I asked for JSON. I define the expected
> object with a Zod schema, pass it to the AI SDK's structured-output API
> (`generateObject`, or `generateText` + `Output.object` when I also want prose), and
> validate **both** the user input and the model output. One schema gives me runtime
> validation and the static type via `z.infer` — and because the AI SDK is
> provider-agnostic, switching models is a one-line change.
