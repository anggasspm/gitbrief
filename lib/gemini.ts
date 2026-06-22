import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Lang } from './i18n'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

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

const SYSTEM = `You are a senior engineer analyzing Git changes.
Return ONLY valid JSON — no markdown fences, no explanation outside the JSON.
Be concise but precise. Use plain English, not jargon.`

const SCHEMA = `{
  "summary":        "one sentence: what changed",
  "why":            "one sentence: why this change was needed",
  "impact":         ["affected service or module"],
  "risk":           "LOW | MEDIUM | HIGH | CRITICAL",
  "riskScore":      0-100,
  "breaking":       true | false,
  "breakingDetails":"null or description of breaking changes",
  "security":       "null or security implications",
  "testing":        "what should be tested",
  "changelog":      "one release-note line starting with a verb"
}`

/**
 * Analysis (summary, why, impact, risk, riskScore, breaking, breakingDetails,
 * security, testing, changelog) is ALWAYS generated in English first.
 * This keeps risk/riskScore/breaking deterministic-ish and comparable across
 * languages — they are never re-derived from a translated prompt.
 */
async function analyzeCommit(data: {
  message: string
  author:  string
  files:   { filename: string; status: string; additions: number; deletions: number }[]
  diff:    string
}): Promise<Explanation> {
  const prompt = `${SYSTEM}\n\nAnalyze this Git commit and return JSON:\n${SCHEMA}\n\nCommit: ${data.message}\nAuthor: ${data.author}\nFiles (${data.files.length}):\n${data.files.map(f => `  ${f.status.padEnd(8)} +${f.additions}/-${f.deletions}  ${f.filename}`).join('\n')}\n\nDiff:\n${data.diff}`
  const result = await model.generateContent(prompt)
  return parseJSON(result.response.text())
}

async function analyzePR(data: {
  title: string; body: string; base: string; head: string
  files: { filename: string; status: string; additions: number; deletions: number }[]
  diff:  string
}): Promise<Explanation> {
  const prompt = `${SYSTEM}\n\nAnalyze this Pull Request and return JSON:\n${SCHEMA}\n\nPR: ${data.title}\nBranch: ${data.base} ← ${data.head}\nDescription: ${data.body || '(none)'}\nFiles (${data.files.length}):\n${data.files.map(f => `  ${f.status.padEnd(8)} +${f.additions}/-${f.deletions}  ${f.filename}`).join('\n')}\n\nDiff:\n${data.diff}`
  const result = await model.generateContent(prompt)
  return parseJSON(result.response.text())
}

/**
 * Translates only the free-text fields of an Explanation to the target
 * language. risk, riskScore, and breaking are passed through unchanged,
 * so they stay identical to the English analysis regardless of language.
 */
async function translateExplanation(en: Explanation, lang: Lang): Promise<Explanation> {
  if (lang === 'en') return en

  const TRANSLATE_SYSTEM = `You are a precise technical translator.
Translate the text fields below into natural, developer-friendly Bahasa Indonesia.
Do NOT translate common technical terms (e.g. "commit", "branch", "API", "endpoint", "database", "schema") — keep them in English, but the surrounding sentences must be in Indonesian.
Return ONLY valid JSON with the exact same shape as the input — no markdown fences, no explanation outside the JSON.
Do not change the meaning, do not add or remove information.`

  const translatable = {
    summary:         en.summary,
    why:             en.why,
    impact:          en.impact,
    breakingDetails: en.breakingDetails,
    security:        en.security,
    testing:         en.testing,
    changelog:       en.changelog,
  }

  const prompt = `${TRANSLATE_SYSTEM}\n\nTranslate this JSON:\n${JSON.stringify(translatable, null, 2)}`
  const result = await model.generateContent(prompt)
  const translated = parseTranslationJSON(result.response.text())

  return {
    ...en,
    summary:         translated.summary,
    why:             translated.why,
    impact:          translated.impact,
    breakingDetails: translated.breakingDetails,
    security:        translated.security,
    testing:         translated.testing,
    changelog:       translated.changelog,
  }
}

export async function explainCommit(data: {
  message: string
  author:  string
  files:   { filename: string; status: string; additions: number; deletions: number }[]
  diff:    string
}, lang: Lang = 'en'): Promise<Explanation> {
  const en = await analyzeCommit(data)
  return translateExplanation(en, lang)
}

export async function explainPR(data: {
  title: string; body: string; base: string; head: string
  files: { filename: string; status: string; additions: number; deletions: number }[]
  diff:  string
}, lang: Lang = 'en'): Promise<Explanation> {
  const en = await analyzePR(data)
  return translateExplanation(en, lang)
}

function parseJSON(raw: string): Explanation {
  return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
}

function parseTranslationJSON(raw: string): {
  summary: string
  why: string
  impact: string[]
  breakingDetails: string | null
  security: string | null
  testing: string
  changelog: string
} {
  return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
}