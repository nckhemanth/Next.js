import { z } from 'zod'

const startupPitchSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(40),
  imageUrl: z.string().url().refine(
    value => /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(value),
    'Use a direct image URL for this offline lab',
  ),
  pitch: z.string().min(10),
})

type StartupPitchInput = z.infer<typeof startupPitchSchema>

interface ActionResult {
  status: 'SUCCESS' | 'ERROR'
  data?: StartupPitchInput
  fieldErrors?: Record<string, string[] | undefined>
}

function createPitchAction(input: unknown): ActionResult {
  const parsed = startupPitchSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: 'ERROR',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  return {
    status: 'SUCCESS',
    data: parsed.data,
  }
}

const result = createPitchAction({
  title: 'SkillForge',
  description: 'An AI platform that generates learning paths from career goals.',
  category: 'EdTech',
  imageUrl: 'https://example.com/skillforge.png',
  pitch: 'SkillForge turns a goal into a weekly learning plan with projects.',
})

console.log(result)

