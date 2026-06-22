'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import { ExplainCard }     from '@/components/ExplainCard'
import { DiffViewer }      from '@/components/DiffViewer'
import { BackButton }      from '@/components/BackButton'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Navbar }          from '@/components/Navbar'
import { IconGitPullRequest, IconExternalLink } from '@/components/Icons'

interface PrData {
  title: string
  summary: string; why: string; impact: string[]
  risk: string; riskScore: number; breaking: boolean
  breakingDetails: string | null; security: string | null
  testing: string; changelog: string
  diff?: string; cached?: boolean
}

export default function PrPage() {
  const { owner, repo, number } = useParams<{ owner: string; repo: string; number: string }>()
  const [data,    setData]    = useState<PrData | null>(null)
  const [error,   setError]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setData(null); setError(false)
    fetch('/api/explain/pr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: `https://github.com/${owner}/${repo}/pull/${number}` }),
    })
      .then(r => r.json())
      .then(json => { if (!cancelled) { if (json.error) setError(true); else setData(json) } })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [owner, repo, number])

  if (error) notFound()

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      
      {/* NAVBAR (Tanpa wrapper pembungkus) */}
      <Navbar
        left={<BackButton />}
        breadcrumb={
          <>
            <span className="mx-1 opacity-30">/</span>
            <a href={`/${owner}/${repo}`} className="hover:underline truncate">{owner}/{repo}</a>
            <span className="mx-0.5 opacity-30">/</span>
            <span
              className="font-semibold flex items-center gap-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              <IconGitPullRequest className="w-3 h-3" />
              #{number}
            </span>
          </>
        }
        action={
          <a
            href={`https://github.com/${owner}/${repo}/pull/${number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium shrink-0 transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-primary)' }}
          >
            <IconExternalLink className="w-3 h-3" />
            GitHub
          </a>
        }
      />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Pull Request
          </p>
          <h1 className="text-3xl font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {data?.title ?? `#${number}`}
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
            {data.diff && (
              <div className="mt-12">
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-5"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Diff
                </h2>
                <DiffViewer rawDiff={data.diff} />
              </div>
            )}
          </>
        )}

        <div className="mt-16 pt-6" style={{ borderTop: '1px solid var(--separator)' }}>
          <p className="text-xs font-mono text-center" style={{ color: 'var(--text-tertiary)' }}>
            gitbrief.dev/{owner}/{repo}/pr/{number}
          </p>
        </div>
      </div>
    </main>
  )
}