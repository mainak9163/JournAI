// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { PromptTemplate } from '@langchain/core/prompts'
import {
  StructuredOutputParser,
} from 'langchain/output_parsers'
import { z } from 'zod'

export const zodSchema=  z.object({
  summary: z
    .string()
    .describe('A comprehensive summary of the person\'s personality based on their journal entry.'),
  
  // Big Five Personality Traits
  openness: z
    .number()
    .min(0)
    .max(100)
    .describe('Score for openness to experience (0-100). High scores indicate creativity, curiosity, and preference for variety.'),
  conscientiousness: z
    .number()
    .min(0)
    .max(100)
    .describe('Score for conscientiousness (0-100). High scores indicate organization, responsibility, and planfulness.'),
  extraversion: z
    .number()
    .min(0)
    .max(100)
    .describe('Score for extraversion (0-100). High scores indicate sociability, energy, and assertiveness.'),
  agreeableness: z
    .number()
    .min(0)
    .max(100)
    .describe('Score for agreeableness (0-100). High scores indicate compassion, cooperation, and consideration for others.'),
  neuroticism: z
    .number()
    .min(0)
    .max(100)
    .describe('Score for neuroticism (0-100). High scores indicate tendency towards anxiety, depression, and emotional instability.'),
  
  // MBTI Analysis
  mbtiType: z
    .string()
    .length(4)
    .describe('The four-letter MBTI personality type (e.g., "ENFP", "INTJ").'),
  mbtiDescription: z
    .string()
    .describe('A detailed description of the person\'s MBTI type and how it manifests in their writing.'),
  
  // Strengths and Growth Areas
  strengths: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe('Array of 3-5 key strengths identified in the journal entry.'),
  growthAreas: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe('Array of 3-5 areas for potential personal growth based on the journal entry.'),
  
  // Career Suggestions
  careerSuggestions: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe('Array of 3-5 career paths that would align well with the identified personality traits.'),
  
  // Visual/UI Elements
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .describe('A hexadecimal color code that represents the overall personality tone. Example #0101fe for blue representing analytical thinking.')
})
const parser = StructuredOutputParser.fromZodSchema(
zodSchema
)

const getPrompt = async (content:string) => {
  const format_instructions = parser.getFormatInstructions()
  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry to create a comprehensive personality profile. Consider the language used, emotions expressed, thinking patterns, and personal values revealed in the writing. Provide a detailed analysis including Big Five traits, MBTI type, strengths, growth areas, and career suggestions. Be specific and base all insights on evidence from the text. Format your response according to the instructions, no matter what!\n\n{format_instructions}\n\nJournal Entry:\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })
  
  const input = await prompt.format({
    entry: content,
  })
  return input
}

export { parser, getPrompt }