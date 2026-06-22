/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { parseGitHubUrl } from '@/lib/parse-url'
import { fetchPrData }    from '@/lib/github'
import { explainPR }      from '@/lib/gemini'
import { prisma }         from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    const parsed = parseGitHubUrl(url)
    if (parsed.type !== 'pr')
      return NextResponse.json({ error: 'Invalid GitHub PR URL.' }, { status: 400 })

    const { owner, repo, number } = parsed

    const cached = await prisma.prExplanation.findUnique({
      where: { owner_repo_number: { owner, repo, number } },
    })
    if (cached) {
      // diff isn't stored in DB for PRs — fetch it lightly so it can still be displayed
      let diff = ''
      try { diff = (await fetchPrData(owner, repo, number)).diff } catch {}
      return NextResponse.json({ ...cached, diff, cached: true })
    }

    const prData      = await fetchPrData(owner, repo, number)
    const explanation = await explainPR(prData)
    const saved = await prisma.prExplanation.upsert({
      where: { owner_repo_number: { owner, repo, number } },
      create: {
        owner, repo, number, title: prData.title, ...explanation,
        breakingDetails: explanation.breakingDetails ?? null,
        security:        explanation.security        ?? null,
      },
      update: {
        title: prData.title, ...explanation,
        breakingDetails: explanation.breakingDetails ?? null,
        security:        explanation.security        ?? null,
      },
    })
    return NextResponse.json({ ...saved, diff: prData.diff, cached: false })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 })
  }
}