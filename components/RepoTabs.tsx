'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n-context'
import { LanguageToggle } from './LanguageToggle'
import { IconGitCommit, IconGitPullRequest, IconGitMerge, IconStar, IconExternalLink, IconChevronRight } from './Icons'
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
  const { t } = useLang()
  const [tab, setTab] = useState<Tab>('all')
  const merged = prs.filter(p => p.merged)

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all',     label: t('tabAll'),     count: commits.length + prs.length },
    { id: 'commits', label: t('tabCommits'), count: commits.length },
    { id: 'prs',     label: t('tabPrs'),     count: prs.length },
    { id: 'merges',  label: t('tabMerges'),  count: merged.length },
  ]

  const showCommits = tab === 'all' || tab === 'commits'
  const visiblePrs  = tab === 'all' ? prs : tab === 'prs' ? prs : tab === 'merges' ? merged : []

  return (
    <main className="min-h-screen">
      <nav className="border-b border-zinc-800/50 px-6 py-4 backdrop-blur-sm sticky top-0 z-10 bg-zinc-950/80">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <a href="/" className="font-bold text-zinc-100 hover:text-white transition-colors flex items-center gap-2">
              <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
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
          <LanguageToggle />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* repo meta */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6">
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
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors border border-zinc-700 rounded-lg px-3 py-2 font-mono whitespace-nowrap"
            >
              <IconExternalLink className="w-3 h-3" />
              GitHub
            </a>
          </div>
        </div>

        {/* tabs */}
        <div className="flex items-center gap-1 border-b border-zinc-800/60">
          {tabs.map(tb => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`relative px-4 py-2.5 text-xs font-mono font-medium transition-colors flex items-center gap-1.5
                ${tab === tb.id ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {tb.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${tab === tb.id ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-500'}`}>
                {tb.count}
              </span>
              {tab === tb.id && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-white rounded-full" />}
            </button>
          ))}
        </div>

        {/* commits */}
        {showCommits && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-3">
              <IconGitCommit className="w-3.5 h-3.5" />
              {t('recentCommits')}
            </h2>
            <div className="space-y-px">
              {commits.map(c => (
                <a
                  key={c.sha}
                  href={`/${owner}/${repo}/commit/${c.sha}`}
                  className="group flex items-center justify-between gap-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 rounded-xl px-5 py-4 transition-all mb-1"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-700 transition-colors">
                      <IconGitCommit className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-200 truncate font-medium">{c.message}</p>
                      <p className="text-xs text-zinc-600 font-mono mt-0.5">
                        {c.sha.slice(0, 7)} · {c.author} · {timeAgo(c.date)}
                      </p>
                    </div>
                  </div>
                  <IconChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
                </a>
              ))}
              {commits.length === 0 && (
                <p className="text-zinc-600 text-sm font-mono py-4">{t('noCommits')}</p>
              )}
            </div>
          </section>
        )}

        {/* pull requests / merges */}
        {(tab === 'all' || tab === 'prs' || tab === 'merges') && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-3">
              <IconGitPullRequest className="w-3.5 h-3.5" />
              {tab === 'merges' ? t('mergedPullRequests') : t('pullRequests')}
            </h2>
            <div className="space-y-px">
              {visiblePrs.map(pr => (
                <a
                  key={pr.number}
                  href={`/${owner}/${repo}/pr/${pr.number}`}
                  className="group flex items-center justify-between gap-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 rounded-xl px-5 py-4 transition-all mb-1"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-700 transition-colors">
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
                              : 'bg-zinc-800 text-zinc-500'
                        }`}>{pr.merged ? 'merged' : pr.state}</span>
                      </p>
                    </div>
                  </div>
                  <IconChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
                </a>
              ))}
              {visiblePrs.length === 0 && (
                <p className="text-zinc-600 text-sm font-mono py-4">
                  {tab === 'merges' ? t('noMergedPullRequests') : t('noPullRequests')}
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}