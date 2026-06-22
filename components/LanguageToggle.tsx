'use client'

import { useLang } from '@/lib/i18n-context'

export function LanguageToggle() {
  const { lang, setLang } = useLang()

  return (
    <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-800 rounded-full p-0.5 text-xs font-mono">
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          lang === 'en' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('id')}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          lang === 'id' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        ID
      </button>
    </div>
  )
}