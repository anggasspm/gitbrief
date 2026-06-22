import { UrlInput }         from '@/components/UrlInput'
import { IconGitCommit, IconGitPullRequest, IconShield, IconAlertTriangle, IconDatabase, IconFileText } from '@/components/Icons'

const FEATURES = [
  { icon: IconGitCommit,       title: 'Plain English Summary',    desc: 'Understand what changed without reading the diff.' },
  { icon: IconAlertTriangle,   title: 'Risk Score 0–100',         desc: 'Predicts merge risk from changed files and patterns.' },
  { icon: IconAlertTriangle,   title: 'Breaking Change Detector', desc: 'Flags API contract and function signature changes.' },
  { icon: IconShield,          title: 'Security Analysis',        desc: 'Identifies auth, credential, and crypto changes.' },
  { icon: IconDatabase,        title: 'Database Detector',        desc: 'Spots migrations, column removals, schema changes.' },
  { icon: IconFileText,        title: 'Changelog Generator',      desc: 'Creates release notes automatically.' },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* nav */}
      <nav className="border-b border-zinc-800/50 px-6 py-4 backdrop-blur-sm sticky top-0 z-10 bg-zinc-950/80">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <IconGitCommit className="w-3.5 h-3.5 text-zinc-950" />
            </div>
            <span className="font-bold tracking-tight text-zinc-100">GitBrief</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded border border-zinc-700 font-mono">beta</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
          >
            github.com ↗
          </a>
        </div>
      </nav>

      {/* hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-28 text-center">
        <div className="max-w-2xl w-full space-y-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Powered by Gemini 2.5 Flash
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-50 leading-[1.08]">
              Git commits<br />
              <span className="text-zinc-500">explained.</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
              Paste any GitHub repo, commit, or PR URL. Get a structured explanation — summary, risk score, breaking changes, and more.
            </p>
          </div>

          <UrlInput />
        </div>
      </section>

      {/* features */}
      <section className="border-t border-zinc-800/50 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-mono text-zinc-600 uppercase tracking-widest mb-10">
            What you get
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="group bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-3 hover:border-zinc-700 transition-colors">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                  <f.icon className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200 text-sm mb-1">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/50 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-zinc-600 font-mono">
          <span>GitBrief</span>
          <span>Git commits explained so humans don&apos;t have to read raw diffs.</span>
        </div>
      </footer>
    </main>
  )
}