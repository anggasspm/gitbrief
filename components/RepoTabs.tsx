// components/RepoTabs.tsx
'use client'

import { useState } from 'react'
import { GlassCard } from './GlassCard'
import {
  IconGitCommit, IconGitPullRequest, IconGitMerge,
  IconStar, IconExternalLink, IconChevronRight, IconArrowLeft,
} from './Icons'
import type { RepoCommit, RepoPR } from '@/lib/github'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  if (m > 0) return `${m}m ago`
  return 'just now'
}

type Tab = 'all' | 'commits' | 'prs' | 'merges'

interface Props {
  owner:   string
  repo:    string
  meta:    { fullName: string; description: string | null; stars: number; language: string | null }
  commits: RepoCommit[]
  prs:     RepoPR[]
}

export function RepoTabs({ owner, repo, meta, commits, prs }: Props) {
  const [tab, setTab] = useState<Tab>('all')
  const merged = prs.filter(p => p.merged)

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all',     label: 'All',     count: commits.length + prs.length },
    { id: 'commits', label: 'Commits', count: commits.length },
    { id: 'prs',     label: 'PRs',     count: prs.length },
    { id: 'merges',  label: 'Merges',  count: merged.length },
  ]

  const showCommits = tab === 'all' || tab === 'commits'
  const visiblePrs  =
    tab === 'all'    ? prs    :
    tab === 'prs'    ? prs    :
    tab === 'merges' ? merged : []

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* floating navbar */}
      <div className="pt-5 pb-2 sticky top-0 z-20 px-5">
        <nav className="glass-nav rounded-full px-5 py-2.5 flex items-center justify-between gap-6 mx-auto max-w-3xl">
          <div
            className="flex items-center gap-1.5 text-xs font-mono min-w-0"
            style={{ color: 'var(--text-secondary)' }}
          >
            <a
              href="/"
              className="font-semibold text-sm flex items-center gap-2 shrink-0"
              style={{ color: 'var(--text-primary)' }}
            >
              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <IconGitCommit className="w-3 h-3 text-white" />
              </div>
              GitBrief
            </a>
            <span className="mx-1" style={{ color: 'var(--separator)' }}>/</span>
            <a
              href={`https://github.com/${owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline truncate"
            >
              {owner}
            </a>
            <span className="mx-0.5">/</span>
            <span className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {repo}
            </span>
          </div>

          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium shrink-0 transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            <IconArrowLeft className="w-3 h-3" />
            New search
          </a>
        </nav>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* repo meta */}
        <GlassCard className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-xl font-semibold font-mono"
                style={{ color: 'var(--text-primary)' }}
              >
                {meta.fullName}
              </h1>
              {meta.description && (
                <p
                  className="text-sm mt-2 leading-relaxed max-w-md"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {meta.description}
                </p>
              )}
              <div className="flex items-center gap-5 mt-4">
                {meta.language && (
                  <span
                    className="text-xs font-mono flex items-center gap-1.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                    {meta.language}
                  </span>
                )}
                <span
                  className="text-xs font-mono flex items-center gap-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <IconStar className="w-3 h-3" />
                  {meta.stars.toLocaleString()}
                </span>
              </div>
            </div>
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-opacity hover:opacity-70 shrink-0"
              style={{
                background: 'rgba(0,113,227,0.08)',
                color: 'var(--accent)',
              }}
            >
              <IconExternalLink className="w-3 h-3" />
              GitHub
            </a>
          </div>
        </GlassCard>

        {/* tabs */}
        <div
          className="flex items-center gap-0.5"
          style={{ borderBottom: '1px solid var(--separator)' }}
        >
          {tabs.map(tb => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className="relative px-4 py-2.5 text-xs font-medium transition-colors flex items-center gap-1.5"
              style={{
                color: tab === tb.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {tb.label}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: tab === tb.id ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.04)',
                  color: tab === tb.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                }}
              >
                {tb.count}
              </span>
              {tab === tb.id && (
                <span
                  className="absolute left-0 right-0 -bottom-px h-px rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* commits */}
        {showCommits && (
          <section>
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <IconGitCommit className="w-3.5 h-3.5" />
              Recent Commits
            </h2>
            <div className="space-y-2">
              {commits.map(c => (
                <GlassCard
                  key={c.sha}
                  href={`/${owner}/${repo}/commit/${c.sha}`}
                  className="px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(0,0,0,0.05)' }}
                      >
                        <IconGitCommit
                          className="w-3.5 h-3.5"
                          style={{ color: 'var(--text-secondary)' }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {c.message}
                        </p>
                        <p
                          className="text-xs font-mono mt-0.5"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          {c.sha.slice(0, 7)} · {c.author} · {new Date(c.date).toLocaleDateString('en-US')}
                        </p>
                      </div>
                    </div>
                    <IconChevronRight
                      className="w-4 h-4 shrink-0"
                      style={{ color: 'var(--text-tertiary)' }}
                    />
                  </div>
                </GlassCard>
              ))}
              {commits.length === 0 && (
                <p className="text-sm font-mono py-6" style={{ color: 'var(--text-tertiary)' }}>
                  No commits found.
                </p>
              )}
            </div>
          </section>
        )}

        {/* pull requests */}
        {(tab === 'all' || tab === 'prs' || tab === 'merges') && (
          <section>
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <IconGitPullRequest className="w-3.5 h-3.5" />
              {tab === 'merges' ? 'Merged Pull Requests' : 'Pull Requests'}
            </h2>
            <div className="space-y-2">
              {visiblePrs.map(pr => (
                <GlassCard
                  key={pr.number}
                  href={`/${owner}/${repo}/pr/${pr.number}`}
                  className="px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(0,0,0,0.05)' }}
                      >
                        {pr.merged
                          ? <IconGitMerge className="w-3.5 h-3.5" style={{ color: '#8b5cf6' }} />
                          : <IconGitPullRequest className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                        }
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {pr.title}
                        </p>
                        <p
                          className="text-xs font-mono mt-0.5 flex items-center gap-2"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          #{pr.number} · {pr.author} · {timeAgo(pr.date)}
                          <span
                            className="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                            style={{
                              background: pr.merged
                                ? 'rgba(139,92,246,0.1)'
                                : pr.state === 'open'
                                  ? 'rgba(34,197,94,0.1)'
                                  : 'rgba(0,0,0,0.05)',
                              color: pr.merged
                                ? '#7c3aed'
                                : pr.state === 'open'
                                  ? '#16a34a'
                                  : 'var(--text-tertiary)',
                            }}
                          >
                            {pr.merged ? 'merged' : pr.state}
                          </span>
                        </p>
                      </div>
                    </div>
                    <IconChevronRight
                      className="w-4 h-4 shrink-0"
                      style={{ color: 'var(--text-tertiary)' }}
                    />
                  </div>
                </GlassCard>
              ))}
              {visiblePrs.length === 0 && (
                <p className="text-sm font-mono py-6" style={{ color: 'var(--text-tertiary)' }}>
                  {tab === 'merges' ? 'No merged pull requests yet.' : 'No pull requests found.'}
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}