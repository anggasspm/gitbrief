'use client'

import { useState } from 'react'
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
  if (d > 0)  return `${d}d ago`
  if (h > 0)  return `${h}h ago`
  if (m > 0)  return `${m}m ago`
  return 'just now'
}

type Tab = 'all' | 'commits' | 'prs' | 'merges'

interface Props {
  owner: string
  repo: string
  meta: { fullName: string; description: string | null; stars: number; language: string | null }
  commits: RepoCommit[]
  prs: RepoPR[]
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
  const visiblePrs  = tab === 'all' ? prs : tab === 'prs' ? prs : tab === 'merges' ? merged : []

  return (
    <main className="min-h-screen">
      <nav className="glass-nav border-b border-white/5 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <a href="/" className="font-semibold text-zinc-100 hover:text-white transition-colors flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-violet-400 to-cyan-300 rounded flex items-center justify-center">
                <IconGitCommit className="w-3 h-3 text-zinc-950" />
              </div>
              GitBrief
            </a>
            <span className="text-zinc-700">/</span>
            <a href={`https://github.com/${owner}`} target="_blank" rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition-colors font-mono text-xs">{owner}</a>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-200 font-mono text-xs font-semibold">{repo}</span>
          </div>

          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors glass-pill rounded-lg px-3 py-2 font-mono whitespace-nowrap"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            Search another repo
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* repo meta */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-zinc-100 font-mono">{meta.fullName}</h1>
              {meta.description && (
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{meta.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3">
                {meta.language && (
                  <span className="text-xs text-zinc-500 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    {meta.language}
                  </span>
                )}
                <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                  <IconStar className="w-3 h-3" />
                  {meta.stars.toLocaleString()}
                </span>
              </div>
            </div>
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors glass-pill rounded-lg px-3 py-2 font-mono whitespace-nowrap"
            >
              <IconExternalLink className="w-3 h-3" />
              GitHub
            </a>
          </div>
        </div>

        {/* tabs */}
        <div className="flex items-center gap-1 border-b border-white/5">
          {tabs.map(tb => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`relative px-4 py-2.5 text-xs font-mono font-medium transition-colors flex items-center gap-1.5
                ${tab === tb.id ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {tb.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${tab === tb.id ? 'bg-white/10 text-zinc-200' : 'bg-white/5 text-zinc-500'}`}>
                {tb.count}
              </span>
              {tab === tb.id && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
              )}
            </button>
          ))}
        </div>

        {/* commits */}
        {showCommits && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-3">
              <IconGitCommit className="w-3.5 h-3.5" />
              Recent Commits
            </h2>
            <div className="space-y-px">
              {commits.map(c => (
                <a
                  key={c.sha}
                  href={`/${owner}/${repo}/commit/${c.sha}`}
                  className="glass-panel group flex items-center justify-between gap-4 rounded-2xl px-5 py-4 mb-2 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                      <IconGitCommit className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-200 truncate font-medium">{c.message}</p>
                      <p className="text-xs text-zinc-600 font-mono mt-0.5">
                      {c.sha.slice(0, 7)} · {c.author} · {new Date(c.date).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>
                  <IconChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
                </a>
              ))}
              {commits.length === 0 && (
                <p className="text-zinc-600 text-sm font-mono py-4">No commits found.</p>
              )}
            </div>
          </section>
        )}

        {/* pull requests / merges */}
        {(tab === 'all' || tab === 'prs' || tab === 'merges') && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-3">
              <IconGitPullRequest className="w-3.5 h-3.5" />
              {tab === 'merges' ? 'Merged Pull Requests' : 'Pull Requests'}
            </h2>
            <div className="space-y-px">
              {visiblePrs.map(pr => (
                <a
                  key={pr.number}
                  href={`/${owner}/${repo}/pr/${pr.number}`}
                  className="glass-panel group flex items-center justify-between gap-4 rounded-2xl px-5 py-4 mb-2 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                      {pr.merged
                        ? <IconGitMerge className="w-3.5 h-3.5 text-purple-400" />
                        : <IconGitPullRequest className="w-3.5 h-3.5 text-zinc-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-200 truncate font-medium">{pr.title}</p>
                      <p className="text-xs text-zinc-600 font-mono mt-0.5">
                        #{pr.number} · {pr.author} · {timeAgo(pr.date)}
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
                          pr.merged
                            ? 'bg-purple-500/10 text-purple-400'
                            : pr.state === 'open'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-white/5 text-zinc-500'
                        }`}>{pr.merged ? 'merged' : pr.state}</span>
                      </p>
                    </div>
                  </div>
                  <IconChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
                </a>
              ))}
              {visiblePrs.length === 0 && (
                <p className="text-zinc-600 text-sm font-mono py-4">
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