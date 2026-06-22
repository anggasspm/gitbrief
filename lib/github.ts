/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE = 'https://api.github.com'

function getHeaders(extra?: Record<string, string>): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitBrief/1.0',
    ...extra,
  }
  if (process.env.GITHUB_TOKEN)
    h['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

export interface RepoCommit {
  sha:     string
  message: string
  author:  string
  date:    string
  additions: number
  deletions: number
}

export interface RepoPR {
  number: number
  title:  string
  author: string
  state:  string
  merged: boolean
  date:   string
  additions: number
  deletions: number
}

export async function fetchRepoCommits(owner: string, repo: string): Promise<RepoCommit[]> {
  const res = await fetch(`${BASE}/repos/${owner}/${repo}/commits?per_page=20`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  const data = await res.json()
  return data.map((c: any) => ({
    sha:       c.sha,
    message:   c.commit.message.split('\n')[0],
    author:    c.commit.author.name,
    date:      c.commit.author.date,
    additions: c.stats?.additions ?? 0,
    deletions: c.stats?.deletions ?? 0,
  }))
}

export async function fetchRepoPRs(owner: string, repo: string): Promise<RepoPR[]> {
  const res = await fetch(`${BASE}/repos/${owner}/${repo}/pulls?state=all&per_page=20`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  const data = await res.json()
  return data.map((p: any) => ({
    number:    p.number,
    title:     p.title,
    author:    p.user.login,
    state:     p.state,
    merged:    p.merged_at !== null,
    date:      p.created_at,
    additions: 0,
    deletions: 0,
  }))
}

export async function fetchRepoMeta(owner: string, repo: string) {
  const res = await fetch(`${BASE}/repos/${owner}/${repo}`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: repo not found`)
  const d = await res.json()
  return {
    name:        d.name as string,
    fullName:    d.full_name as string,
    description: d.description as string | null,
    stars:       d.stargazers_count as number,
    language:    d.language as string | null,
    defaultBranch: d.default_branch as string,
  }
}

export async function fetchCommitDiff(owner: string, repo: string, sha: string) {
  const [commitRes, diffRes] = await Promise.all([
    fetch(`${BASE}/repos/${owner}/${repo}/commits/${sha}`, { headers: getHeaders() }),
    fetch(`${BASE}/repos/${owner}/${repo}/commits/${sha}`, {
      headers: getHeaders({ Accept: 'application/vnd.github.v3.diff' }),
    }),
  ])
  if (!commitRes.ok) throw new Error(`GitHub API ${commitRes.status}`)

  const commit = await commitRes.json()
  const diff   = await diffRes.text()

  return {
    message:   commit.commit.message as string,
    author:    commit.commit.author.name as string,
    date:      commit.commit.author.date as string,
    files:     (commit.files ?? []).map((f: any) => ({
      filename:  f.filename as string,
      status:    f.status as string,
      additions: f.additions as number,
      deletions: f.deletions as number,
    })),
    diff: trimDiff(diff, 12000),
  }
}

export async function fetchPrData(owner: string, repo: string, number: number) {
  const [prRes, filesRes, diffRes] = await Promise.all([
    fetch(`${BASE}/repos/${owner}/${repo}/pulls/${number}`, { headers: getHeaders() }),
    fetch(`${BASE}/repos/${owner}/${repo}/pulls/${number}/files`, { headers: getHeaders() }),
    fetch(`${BASE}/repos/${owner}/${repo}/pulls/${number}`, {
      headers: getHeaders({ Accept: 'application/vnd.github.v3.diff' }),
    }),
  ])
  if (!prRes.ok) throw new Error(`GitHub API ${prRes.status}`)

  const pr    = await prRes.json()
  const files = await filesRes.json()
  const diff  = await diffRes.text()

  return {
    title:  pr.title as string,
    body:   (pr.body ?? '') as string,
    author: pr.user.login as string,
    base:   pr.base.ref as string,
    head:   pr.head.ref as string,
    files:  files.map((f: any) => ({
      filename:  f.filename as string,
      status:    f.status as string,
      additions: f.additions as number,
      deletions: f.deletions as number,
    })),
    diff: trimDiff(diff, 14000),
  }
}

function trimDiff(diff: string, maxChars: number): string {
  if (diff.length <= maxChars) return diff
  const NOISY = /\.(lock|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|min\.js|min\.css|map)$/i
  const lines  = diff.split('\n')
  const result: string[] = []
  let current = ''
  let isNoisy = false
  let total   = 0
  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      if (current && !isNoisy) { result.push(current); total += current.length }
      current = line + '\n'
      isNoisy = NOISY.test(line)
    } else {
      current += line + '\n'
    }
    if (total > maxChars) break
  }
  if (current && !isNoisy && total <= maxChars) result.push(current)
  return result.join('') + (total > maxChars ? '\n\n[diff truncated]' : '')
}