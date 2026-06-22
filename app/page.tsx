import { Navbar }    from '@/components/Navbar'
import { UrlInput }  from '@/components/UrlInput'
import { IconExternalLink } from '@/components/Icons'

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Efek glow radial */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <div 
          className="w-[800px] h-[800px] rounded-full blur-[120px]" 
          style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%)' }} 
        />
      </div>

      <Navbar
        action={
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-50"
            style={{ color: 'var(--text-primary)' }}
          >
            GitHub <IconExternalLink className="w-3 h-3" />
          </a>
        }
      />

      {/* hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 -mt-10">
        <div className="max-w-2xl w-full space-y-12">
          
          {/* Group Judul & Badge */}
          <div className="space-y-6 flex flex-col items-center">
            
            {/* BADGE DI ATAS (Dengan spacing tambahan agar tidak menempel) */}
            <div className="pt-3 pb-1">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wide border uppercase"
                style={{
                  background: 'var(--glass-bg)',
                  borderColor: 'var(--glass-border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Powered by Multi-AI
              </div>
            </div>

            <h1
              className="text-6xl sm:text-7xl font-bold tracking-tighter"
              style={{ color: 'var(--text-primary)' }}
            >
              Git commits,
              <br />
              <span className="animate-metallic-text">explained.</span>
            </h1>
            
            <p
              className="text-sm sm:text-base leading-relaxed max-w-md mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Paste any GitHub URL. Get a structured explanation, risk score, and breaking changes instantly.
            </p>
          </div>

          {/* Input Box */}
          <div className="max-w-xl mx-auto w-full">
            <UrlInput />
          </div>

        </div>
      </section>

      {/* footer minimalis */}
      <footer className="px-6 py-8 relative z-10">
        <div
          className="max-w-4xl mx-auto flex items-center justify-center text-xs font-mono"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <span>GitBrief © 2026</span>
        </div>
      </footer>
    </main>
  )
}