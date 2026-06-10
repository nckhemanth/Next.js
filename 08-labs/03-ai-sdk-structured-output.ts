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

// Current AI SDK 6 equivalent in a Next.js route/server action:
//
// import { generateText, Output } from 'ai'
//
// const { output } = await generateText({
//   model: 'openai/gpt-4.1-mini',
//   output: Output.object({ schema: pitchAnalysisSchema }),
//   prompt: `Analyze this startup pitch: ${pitch}`,
// })
//
// return Response.json(output)

const simulatedModelOutput = {
  score: 8,
  summary: 'SkillForge has a clear education workflow and a believable AI personalization angle.',
  strengths: ['Specific user problem', 'Clear buyer persona', 'Strong demo path'],
  risks: ['Crowded market', 'Needs proof that recommendations improve outcomes'],
  suggestedCategory: 'Education',
  founderQuestions: ['What data improves the learning path?', 'Who pays first?', 'How do you measure success?'],
}

console.log(validateModelOutput(simulatedModelOutput))

