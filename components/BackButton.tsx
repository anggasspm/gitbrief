'use client'

import { useRouter } from 'next/navigation'
import { IconArrowLeft } from './Icons'

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
    >
      <IconArrowLeft className="w-3.5 h-3.5" />
      Back
    </button>
  )
}