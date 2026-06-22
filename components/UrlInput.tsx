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
      setError('Enter a valid GitHub repository, commit, or pull request URL.')
      return
    }

    if (parsed.type === 'repo') {
      router.push(`/${parsed.owner}/${parsed.repo}`)
      return
    }

    setLoading(true)
    try {
      const endpoint =
        parsed.type === 'commit' ? '/api/explain/commit' : '/api/explain/pr'
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
    <div className="w-full space-y-3">
      <div className="apple-input flex gap-2 p-1.5">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit(e as unknown as React.FormEvent)}
          placeholder="https://github.com/owner/repo/commit/…"
          className="flex-1 bg-transparent px-3 py-2.5 text-sm focus:outline-none font-mono"
          style={{ color: 'var(--text-primary)' }}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !url.trim()}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          style={{ background: loading ? '#6b7280' : 'var(--accent)' }}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <IconArrowRight className="w-4 h-4" />
          )}
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>
      {error && (
        <p className="text-sm pl-1" style={{ color: '#dc2626' }}>
          {error}
        </p>
      )}
      <p className="text-xs pl-1" style={{ color: 'var(--text-tertiary)' }}>
        Paste any public GitHub repo, commit, or pull request URL.
      </p>
    </div>
  )
}