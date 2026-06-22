'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Lang } from './i18n'
import { t as translate } from './i18n'

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: Parameters<typeof translate>[1]) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('gitbrief-lang')
    if (saved === 'en' || saved === 'id') setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('gitbrief-lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: key => translate(lang, key) }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}