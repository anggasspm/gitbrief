import type { Metadata } from 'next'
import { inter } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitBrief — Git commits explained in plain English',
  description:
    'Turn any GitHub repo, commit, or PR into a structured plain-English explanation with risk scoring and breaking-change detection.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}