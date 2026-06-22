'use client'

import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/i18n-context'

function IconArrowLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 10H4M9 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BackButton() {
  const router = useRouter()
  const { t } = useLang()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
    >
      <IconArrowLeft className="w-3.5 h-3.5" />
      {t('back')}
    </button>
  )
}