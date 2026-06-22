'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseGitHubUrl } from '@/lib/parse-url'
import { IconArrowRight } from './Icons'

export function UrlInput() {
  const router = useRouter()
  const [url,     setUrl]     = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const parsed = parseGitHubUrl(url)
    if (parsed.type === 'invalid') {
      setError('Paste a GitHub repository, commit, or PR URL.')
      return
    }

    if (parsed.type === 'repo') {
      router.push(`/${parsed.owner}/${parsed.repo}`)
      return
    }

    setLoading(true)
    try {
      const endpoint = parsed.type === 'commit'
        ? '/api/explain/commit'
        : '/api/explain/pr'

      const res  = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }

      if (parsed.type === 'commit')
        router.push(`/${parsed.owner}/${parsed.repo}/commit/${parsed.sha}`)
      else
        router.push(`/${parsed.owner}/${parsed.repo}/pr/${parsed.number}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="glass-input-wrap">
        <div className="flex gap-2 bg-zinc-950/80 rounded-[0.95rem] p-1.5">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none font-mono"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="btn-sheen px-5 py-2.5 bg-gradient-to-r from-violet-400 to-cyan-300 text-zinc-950 text-sm font-semibold rounded-xl hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <IconArrowRight className="w-4 h-4" />
            )}
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm pl-1">{error}</p>}
      <p className="text-zinc-600 text-xs pl-1">
        Paste a repo, commit, or pull request URL from any public GitHub repository.
      </p>
    </form>
  )
}