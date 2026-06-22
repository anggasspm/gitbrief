/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { parseGitHubUrl }   from '@/lib/parse-url'
import { fetchCommitDiff }  from '@/lib/github'
import { explainCommit }    from '@/lib/gemini'
import { prisma }           from '@/lib/db'
import type { Lang }        from '@/lib/i18n'

export async function POST(req: NextRequest) {
  try {
    const { url, lang: rawLang } = await req.json()
    const lang: Lang = rawLang === 'id' ? 'id' : 'en'

    const parsed = parseGitHubUrl(url)
    if (parsed.type !== 'commit')
      return NextResponse.json({ error: 'Invalid GitHub commit URL.' }, { status: 400 })

    const { owner, repo, sha } = parsed

    const cached = await prisma.commitExplanation.findUnique({
      where: { owner_repo_sha_lang: { owner, repo, sha, lang } },
    })
    if (cached) return NextResponse.json({ ...cached, cached: true })

    const commitData  = await fetchCommitDiff(owner, repo, sha)
    const explanation = await explainCommit(commitData, lang)
    const saved = await prisma.commitExplanation.upsert({
      where: { owner_repo_sha_lang: { owner, repo, sha, lang } },
      create: {
        owner, repo, sha, lang, rawDiff: commitData.diff, ...explanation,
        breakingDetails: explanation.breakingDetails ?? null,
        security:        explanation.security        ?? null,
      },
      update: {
        rawDiff: commitData.diff, ...explanation,
        breakingDetails: explanation.breakingDetails ?? null,
        security:        explanation.security        ?? null,
      },
    })
    return NextResponse.json({ ...saved, cached: false })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 })
  }
}