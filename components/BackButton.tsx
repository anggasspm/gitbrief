'use client'

import { useRouter } from 'next/navigation'
import { IconArrowLeft } from './Icons'

export function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm font-bold tracking-tight transition-opacity hover:opacity-70 shrink-0"
      style={{ color: 'var(--text-primary)' }}
    >
      <IconArrowLeft className="w-4 h-4" />
      Back
    </button>
  )
}