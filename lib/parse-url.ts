export type ParsedGitHubUrl =
  | { type: 'repo';   owner: string; repo: string }
  | { type: 'commit'; owner: string; repo: string; sha: string }
  | { type: 'pr';     owner: string; repo: string; number: number }
  | { type: 'invalid' }

export function parseGitHubUrl(raw: string): ParsedGitHubUrl {
  try {
    const url   = new URL(raw.trim())
    if (url.hostname !== 'github.com') return { type: 'invalid' }

    const parts = url.pathname.split('/').filter(Boolean)

    if (parts.length === 2)
      return { type: 'repo', owner: parts[0], repo: parts[1] }

    if (parts.length >= 4 && parts[2] === 'commit')
      return { type: 'commit', owner: parts[0], repo: parts[1], sha: parts[3] }

    if (parts.length >= 4 && parts[2] === 'pull') {
      const num = parseInt(parts[3], 10)
      if (!isNaN(num))
        return { type: 'pr', owner: parts[0], repo: parts[1], number: num }
    }

    return { type: 'invalid' }
  } catch {
    return { type: 'invalid' }
  }
}