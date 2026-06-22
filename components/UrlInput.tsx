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

    // repo URL → go straight to repo page
    if (parsed.type === 'repo') {
      router.push(`/${parsed.owner}/${parsed.repo}`)
      return
    }

    // commit or PR URL → call API then redirect
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
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          className="flex-1 bg-zinc-900/80 border border-zinc-700/60 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="px-5 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <IconArrowRight className="w-4 h-4" />
          )}
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm pl-1">{error}</p>}
      <p className="text-zinc-600 text-xs pl-1">
        Paste a repo, commit, or pull request URL from any public GitHub repository.
      </p>
    </form>
  )
}