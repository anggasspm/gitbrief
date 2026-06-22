import { GoogleGenerativeAI } from '@google/generative-ai'

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

export async function explainCommit(data: {
  message: string
  author:  string
  files:   { filename: string; status: string; additions: number; deletions: number }[]
  diff:    string
}): Promise<Explanation> {
  const prompt = `${SYSTEM}\n\nAnalyze this Git commit and return JSON:\n${SCHEMA}\n\nCommit: ${data.message}\nAuthor: ${data.author}\nFiles (${data.files.length}):\n${data.files.map(f => `  ${f.status.padEnd(8)} +${f.additions}/-${f.deletions}  ${f.filename}`).join('\n')}\n\nDiff:\n${data.diff}`
  const result = await model.generateContent(prompt)
  return parseJSON(result.response.text())
}

export async function explainPR(data: {
  title: string; body: string; base: string; head: string
  files: { filename: string; status: string; additions: number; deletions: number }[]
  diff:  string
}): Promise<Explanation> {
  const prompt = `${SYSTEM}\n\nAnalyze this Pull Request and return JSON:\n${SCHEMA}\n\nPR: ${data.title}\nBranch: ${data.base} ← ${data.head}\nDescription: ${data.body || '(none)'}\nFiles (${data.files.length}):\n${data.files.map(f => `  ${f.status.padEnd(8)} +${f.additions}/-${f.deletions}  ${f.filename}`).join('\n')}\n\nDiff:\n${data.diff}`
  const result = await model.generateContent(prompt)
  return parseJSON(result.response.text())
}

function parseJSON(raw: string): Explanation {
  return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
}