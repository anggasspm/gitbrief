/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { parseGitHubUrl } from '@/lib/parse-url'
import { fetchPrData }    from '@/lib/github'
import { explainPR }      from '@/lib/gemini'
import { prisma }         from '@/lib/db'
import type { Lang }      from '@/lib/i18n'

export async function POST(req: NextRequest) {
  try {
    const { url, lang: rawLang } = await req.json()
    const lang: Lang = rawLang === 'id' ? 'id' : 'en'

    const parsed = parseGitHubUrl(url)
    if (parsed.type !== 'pr')
      return NextResponse.json({ error: 'Invalid GitHub PR URL.' }, { status: 400 })

    const { owner, repo, number } = parsed

    const cached = await prisma.prExplanation.findUnique({
      where: { owner_repo_number_lang: { owner, repo, number, lang } },
    })
    if (cached) {
      // diff tidak tersimpan di DB untuk PR — fetch ringan supaya tetap bisa ditampilkan
      let diff = ''
      try { diff = (await fetchPrData(owner, repo, number)).diff } catch {}
      return NextResponse.json({ ...cached, diff, cached: true })
    }

    const prData      = await fetchPrData(owner, repo, number)
    const explanation = await explainPR(prData, lang)
    const saved = await prisma.prExplanation.upsert({
      where: { owner_repo_number_lang: { owner, repo, number, lang } },
      create: {
        owner, repo, number, lang, title: prData.title, ...explanation,
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