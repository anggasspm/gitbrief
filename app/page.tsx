import { UrlInput }     from '@/components/UrlInput'
import { spaceGrotesk } from '@/lib/fonts'
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
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* ambient liquid orbs */}
      <div
        className="glass-orb w-[36rem] h-[36rem] -top-40 -left-32 bg-gradient-to-br from-violet-500/40 to-fuchsia-500/10 animate-[liquid-drift_22s_ease-in-out_infinite]"
        aria-hidden
      />
      <div
        className="glass-orb w-[30rem] h-[30rem] top-1/3 -right-40 bg-gradient-to-br from-cyan-400/35 to-blue-500/10 animate-[liquid-drift-slow_26s_ease-in-out_infinite]"
        aria-hidden
      />

      {/* nav */}
      <nav className="glass-nav border-b border-white/5 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-400 to-cyan-300 rounded-md flex items-center justify-center">
              <IconGitCommit className="w-3.5 h-3.5 text-zinc-950" />
            </div>
            <span className="font-semibold tracking-tight text-zinc-100">GitBrief</span>
            <span className="text-[10px] px-1.5 py-0.5 glass-pill text-zinc-400 rounded font-mono">beta</span>
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
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-28 text-center relative z-[1]">
        <div className="max-w-2xl w-full space-y-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 glass-pill rounded-full text-xs text-zinc-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
              Powered by Gemini 2.5 Flash
            </div>
            <h1 className={`${spaceGrotesk.className} text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.08]`}>
              <span className="text-zinc-50">Git commits</span>
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-zinc-100 to-cyan-300 bg-clip-text text-transparent">
                explained.
              </span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
              Paste any GitHub repo, commit, or PR URL. Get a structured explanation — summary, risk score, breaking changes, and more.
            </p>
          </div>

          <UrlInput />
        </div>
      </section>

      {/* features */}
      <section className="border-t border-white/5 px-6 py-20 relative z-[1]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-mono text-zinc-600 uppercase tracking-widest mb-10">
            What you get
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-panel group rounded-2xl p-5 space-y-3">
                <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <f.icon className="w-4 h-4 text-zinc-300" />
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

      <footer className="border-t border-white/5 px-6 py-6 relative z-[1]">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-zinc-600 font-mono">
          <span>GitBrief</span>
          <span>Git commits explained so humans don&apos;t have to read raw diffs.</span>
        </div>
      </footer>
    </main>
  )
}