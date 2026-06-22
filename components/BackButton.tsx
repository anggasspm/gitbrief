'use client'

import { useRouter } from 'next/navigation'
import { IconArrowLeft } from './Icons'

export function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-xs font-medium transition-colors"
      style={{ color: 'var(--accent)' }}
    >
      <IconArrowLeft className="w-3 h-3" />
      Back
    </button>
  )
}