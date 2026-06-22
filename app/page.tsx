import { Navbar }    from '@/components/Navbar'
import { GlassCard } from '@/components/GlassCard'
import { UrlInput }  from '@/components/UrlInput'
import {
  IconGitCommit, IconShield, IconAlertTriangle,
  IconDatabase, IconFileText, IconGitPullRequest,
} from '@/components/Icons'

const FEATURES = [
  {
    icon: IconGitCommit,
    title: 'Plain English Summary',
    desc: 'Understand what changed without reading the diff.',
  },
  {
    icon: IconAlertTriangle,
    title: 'Risk Score',
    desc: 'Predicts merge risk from changed files and patterns.',
  },
  {
    icon: IconAlertTriangle,
    title: 'Breaking Change Detector',
    desc: 'Flags API contract and function signature changes.',
  },
  {
    icon: IconShield,
    title: 'Security Analysis',
    desc: 'Identifies auth, credential, and crypto changes.',
  },
  {
    icon: IconDatabase,
    title: 'Database Detector',
    desc: 'Spots migrations, column removals, schema changes.',
  },
  {
    icon: IconFileText,
    title: 'Changelog Generator',
    desc: 'Creates release notes automatically.',
  },
]

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg)' }}
    >
      {/* navbar */}
      <div className="pt-5">
        <Navbar
          action={
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              GitHub ↗
            </a>
          }
        />
      </div>

      {/* hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-28 text-center">
        <div className="max-w-xl w-full space-y-10">
          <div className="space-y-5">
            {/* eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(0,113,227,0.08)',
                color: 'var(--accent)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Powered by Gemini 2.5 Flash
            </div>

            <h1
              className="text-5xl sm:text-6xl font-semibold leading-[1.06] tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Git commits,
              <br />
              explained.
            </h1>

            <p
              className="text-lg leading-relaxed max-w-sm mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Paste any GitHub URL and get a structured explanation — summary, risk score, breaking changes, and more.
            </p>
          </div>

          <UrlInput />
        </div>
      </section>

      {/* features */}
      <section
        className="px-6 py-24"
        style={{ borderTop: '1px solid var(--separator)' }}
      >
        <div className="max-w-4xl mx-auto">
          <p
            className="text-center text-xs font-semibold uppercase tracking-widest mb-12"
            style={{ color: 'var(--text-tertiary)' }}
          >
            What you get
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <GlassCard key={i} className="p-6" parallax>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: 'rgba(0,113,227,0.08)' }}
                >
                  <f.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <h3
                  className="text-sm font-semibold mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {f.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer
        className="px-6 py-8"
        style={{ borderTop: '1px solid var(--separator)' }}
      >
        <div
          className="max-w-4xl mx-auto flex items-center justify-between text-xs font-mono"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <span>GitBrief</span>
          <span>Git commits explained in plain English.</span>
        </div>
      </footer>
    </main>
  )
}