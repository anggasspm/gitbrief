import { notFound }    from 'next/navigation'
import { fetchRepoCommits, fetchRepoPRs, fetchRepoMeta } from '@/lib/github'
import { RepoTabs } from '@/components/RepoTabs'
import type { Metadata } from 'next'

interface Props { params: Promise<{ owner: string; repo: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params
  return { title: `${owner}/${repo} — GitBrief` }
}

export default async function RepoPage({ params }: Props) {
  const { owner, repo } = await params

  let meta, commits, prs
  try {
    ;[meta, commits, prs] = await Promise.all([
      fetchRepoMeta(owner, repo),
      fetchRepoCommits(owner, repo),
      fetchRepoPRs(owner, repo),
    ])
  } catch {
    notFound()
  }

  return <RepoTabs owner={owner} repo={repo} meta={meta!} commits={commits!} prs={prs!} />
}