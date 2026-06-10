import { z } from 'zod'

export const pitchAnalysisSchema = z.object({
  score: z.number().int().min(1).max(10).describe('Overall investment-readiness score'),
  summary: z.string().min(20).describe('Plain-English summary of the startup pitch'),
  strengths: z.array(z.string()).min(1).max(5),
  risks: z.array(z.string()).min(1).max(5),
  suggestedCategory: z.enum(['AI', 'Developer Tools', 'Healthcare', 'Education', 'Fintech', 'Consumer', 'Other']),
  founderQuestions: z.array(z.string()).min(1).max(5),
})

export type PitchAnalysis = z.infer<typeof pitchAnalysisSchema>

function validateModelOutput(output: unknown): PitchAnalysis {
  return pitchAnalysisSchema.parse(output)
}

// In a Next.js route handler / server action, the same schema drives a real call.
// Provider-agnostic (AI SDK) — defaults to Claude here; swap one line for OpenAI/Google.
//
// Stable path — generateObject (returns a validated, typed `object`):
//   import { generateObject } from 'ai'
//   import { anthropic } from '@ai-sdk/anthropic'
//   const { object } = await generateObject({
//     model: anthropic('claude-opus-4-8'),
//     schema: pitchAnalysisSchema,
//     prompt: `Analyze this startup pitch: ${pitch}`,
//   })
//   return Response.json(object)
//
// Structured output beside text — generateText + Output.object({ schema }) only:
//   import { generateText, Output } from 'ai'
//   const { experimental_output } = await generateText({
//     model: anthropic('claude-opus-4-8'),
//     experimental_output: Output.object({ schema: pitchAnalysisSchema }),
//     prompt: `Analyze this startup pitch: ${pitch}`,
//   })
//   // AI SDK 6 stabilizes experimental_output -> output (same Output.object shape).

const simulatedModelOutput = {
  score: 8,
  summary: 'SkillForge has a clear education workflow and a believable AI personalization angle.',
  strengths: ['Specific user problem', 'Clear buyer persona', 'Strong demo path'],
  risks: ['Crowded market', 'Needs proof that recommendations improve outcomes'],
  suggestedCategory: 'Education',
  founderQuestions: ['What data improves the learning path?', 'Who pays first?', 'How do you measure success?'],
}

console.log(validateModelOutput(simulatedModelOutput))

