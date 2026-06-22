import { generateObject } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

const models = [
  google('gemini-2.5-flash'),
  groq('llama3-70b-8192'),   
  openrouter('meta-llama/llama-3-8b-instruct:free') 
]

export interface Explanation {
  summary:         string
  why:             string
  impact:          string[]
  risk:            'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  riskScore:       number
  breaking:        boolean
  breakingDetails: string | null
  security:        string | null
  testing:         string
  changelog:       string
}

const explanationSchema = z.object({
  summary:         z.string().describe('one sentence: what changed'),
  why:             z.string().describe('one sentence: why this change was needed'),
  impact:          z.array(z.string()).describe('affected service or module'),
  risk:            z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  riskScore:       z.number().min(0).max(100),
  breaking:        z.boolean(),
  breakingDetails: z.string().nullable().describe('null or description of breaking changes'),
  security:        z.string().nullable().describe('null or security implications'),
  testing:         z.string().describe('what should be tested'),
  changelog:       z.string().describe('one release-note line starting with a verb'),
})

const SYSTEM = `You are a senior engineer analyzing Git changes. Be concise but precise. Use plain English, not jargon.`

async function generateWithFallback(prompt: string) {
  let lastError = null;

  for (const model of models) {
    try {
      const { object } = await generateObject({
        model: model,
        system: SYSTEM,
        prompt: prompt,
        schema: explanationSchema,
      });
      return object; 
    } catch (error: any) {
      console.warn(`⚠️ Model ${model.provider} gagal: ${error.message}`);
    }
  }

  throw lastError;
}

export async function explainCommit(data: {
  message: string
  author:  string
  files:   { filename: string; status: string; additions: number; deletions: number }[]
  diff:    string
}): Promise<Explanation> {
  const prompt = `Commit: ${data.message}\nAuthor: ${data.author}\nFiles (${data.files.length}):\n${data.files.map(f => `  ${f.status.padEnd(8)} +${f.additions}/-${f.deletions}  ${f.filename}`).join('\n')}\n\nDiff:\n${data.diff}`

  return await generateWithFallback(prompt) as Explanation
}

export async function explainPR(data: {
  title: string; body: string; base: string; head: string
  files: { filename: string; status: string; additions: number; deletions: number }[]
  diff:  string
}): Promise<Explanation> {
  const prompt = `PR: ${data.title}\nBranch: ${data.base} ← ${data.head}\nDescription: ${data.body || '(none)'}\nFiles (${data.files.length}):\n${data.files.map(f => `  ${f.status.padEnd(8)} +${f.additions}/-${f.deletions}  ${f.filename}`).join('\n')}\n\nDiff:\n${data.diff}`

  return await generateWithFallback(prompt) as Explanation
}