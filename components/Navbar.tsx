import { IconLogo } from './Icons'

interface NavbarProps {
  left?:       React.ReactNode
  breadcrumb?: React.ReactNode
  action?:     React.ReactNode
}

export function Navbar({ left, breadcrumb, action }: NavbarProps) {
  return (
    <div className="sticky top-5 z-20 px-5 w-full">
      <nav className="glass-nav rounded-full px-5 py-2.5 flex items-center justify-between gap-4 w-full max-w-3xl mx-auto">
        
        <div className="flex items-center gap-3 min-w-0">
          {/* KIRI: Logo atau Elemen Custom */}
          {left !== undefined ? left : (
            <a href="/" className="flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-70">
              <IconLogo className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
              <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                GitBrief
              </span>
            </a>
          )}

          {/* TENGAH: Breadcrumb */}
          {breadcrumb && (
            <div className="flex items-center gap-1.5 text-xs font-mono min-w-0 overflow-hidden" style={{ color: 'var(--text-secondary)' }}>
              {breadcrumb}
            </div>
          )}
        </div>

        {/* KANAN: Action */}
        {action && <div className="shrink-0">{action}</div>}
      </nav>
    </div>
  )
}