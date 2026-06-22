'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import { ExplainCard } from '@/components/ExplainCard'
import { DiffViewer }  from '@/components/DiffViewer'
import { BackButton }  from '@/components/BackButton'
import { IconExternalLink } from '@/components/Icons'

interface CommitExplanationData {
  summary: string; why: string; impact: string[]
  risk: string; riskScore: number; breaking: boolean
  breakingDetails: string | null; security: string | null
  testing: string; changelog: string; rawDiff: string
  cached?: boolean
}

export default function CommitPage() {
  const params = useParams<{ owner: string; repo: string; sha: string }>()
  const { owner, repo, sha } = params

  const [data, setData] = useState<CommitExplanationData | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setData(null)
    setError(false)

    fetch('/api/explain/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: `https://github.com/${owner}/${repo}/commit/${sha}` }),
    })
      .then(res => res.json())
      .then(json => {
        if (cancelled) return
        if (json.error) { setError(true); return }
        setData(json)
      })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [owner, repo, sha])

  if (error) notFound()

  return (
    <main className="min-h-screen">
      <nav className="glass-nav border-b border-white/5 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm flex-wrap">
          <BackButton />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100 mb-1 font-mono">{sha.slice(0, 7)}</h1>
            <p className="text-sm text-zinc-500">Commit explanation</p>
          </div>
          <a
            href={`https://github.com/${owner}/${repo}/commit/${sha}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors glass-pill rounded-lg px-3 py-2 font-mono whitespace-nowrap"
          >
            <IconExternalLink className="w-3 h-3" />
            View on GitHub
          </a>
        </div>

        {loading && (
          <p className="text-zinc-600 text-sm font-mono py-10 text-center">Analyzing changes…</p>
        )}

        {data && !loading && (
          <>
            <ExplainCard
              summary={data.summary} why={data.why} impact={data.impact}
              risk={data.risk} riskScore={data.riskScore} breaking={data.breaking}
              breakingDetails={data.breakingDetails} security={data.security}
              testing={data.testing} changelog={data.changelog}
              cached={data.cached}
            />

            <div className="mt-8">
              <h2 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                Diff
              </h2>
              <DiffViewer rawDiff={data.rawDiff} />
            </div>
          </>
        )}

        <div className="mt-10 pt-6 border-t border-zinc-800/60">
          <p className="text-zinc-700 text-xs font-mono text-center">
            gitbrief.dev/{owner}/{repo}/commit/{sha.slice(0, 7)}
          </p>
        </div>
      </div>
    </main>
  )
}