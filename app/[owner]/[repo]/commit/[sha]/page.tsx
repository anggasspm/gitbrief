'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import { ExplainCard }     from '@/components/ExplainCard'
import { DiffViewer }      from '@/components/DiffViewer'
import { BackButton }      from '@/components/BackButton'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { IconExternalLink, IconGitCommit } from '@/components/Icons'

interface CommitData {
  summary: string; why: string; impact: string[]
  risk: string; riskScore: number; breaking: boolean
  breakingDetails: string | null; security: string | null
  testing: string; changelog: string; rawDiff: string
  cached?: boolean
}

export default function CommitPage() {
  const { owner, repo, sha } = useParams<{ owner: string; repo: string; sha: string }>()
  const [data,    setData]    = useState<CommitData | null>(null)
  const [error,   setError]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setData(null); setError(false)
    fetch('/api/explain/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: `https://github.com/${owner}/${repo}/commit/${sha}` }),
    })
      .then(r => r.json())
      .then(json => { if (!cancelled) { if (json.error) setError(true); else setData(json) } })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [owner, repo, sha])

  if (error) notFound()

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* floating navbar */}
      <div className="pt-5 pb-2 sticky top-0 z-20 px-5">
        <nav className="glass-nav rounded-full px-5 py-2.5 flex items-center justify-between gap-4 mx-auto max-w-3xl">
          <div className="flex items-center gap-2 min-w-0 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
            <BackButton />
            <span className="mx-1 opacity-30">/</span>
            <a href={`/${owner}/${repo}`} className="hover:underline truncate">{owner}/{repo}</a>
            <span className="mx-0.5 opacity-30">/</span>
            <span
              className="font-semibold flex items-center gap-1"
              style={{ color: 'var(--text-primary)' }}
            >
              <IconGitCommit className="w-3 h-3" />
              {sha.slice(0, 7)}
            </span>
          </div>
          <a
            href={`https://github.com/${owner}/${repo}/commit/${sha}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium flex-shrink-0 transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            <IconExternalLink className="w-3 h-3" />
            GitHub
          </a>
        </nav>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Commit
          </p>
          <h1 className="text-3xl font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
            {sha.slice(0, 7)}
          </h1>
        </div>

        {loading && <LoadingSkeleton />}

        {data && !loading && (
          <>
            <ExplainCard
              summary={data.summary} why={data.why} impact={data.impact}
              risk={data.risk} riskScore={data.riskScore} breaking={data.breaking}
              breakingDetails={data.breakingDetails} security={data.security}
              testing={data.testing} changelog={data.changelog}
              cached={data.cached}
            />
            <div className="mt-12">
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Diff
              </h2>
              <DiffViewer rawDiff={data.rawDiff} />
            </div>
          </>
        )}

        <div className="mt-16 pt-6" style={{ borderTop: '1px solid var(--separator)' }}>
          <p className="text-xs font-mono text-center" style={{ color: 'var(--text-tertiary)' }}>
            gitbrief.dev/{owner}/{repo}/commit/{sha.slice(0, 7)}
          </p>
        </div>
      </div>
    </main>
  )
}