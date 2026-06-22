import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LangProvider } from '@/lib/i18n-context'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GitBrief — Git commits explained in plain English',
  description: 'Turn any GitHub repo, commit, or PR into a structured plain-English explanation with risk scoring and breaking-change detection.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}