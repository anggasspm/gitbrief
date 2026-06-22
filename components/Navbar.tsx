import { IconGitCommit } from './Icons'

interface NavbarProps {
  breadcrumb?: React.ReactNode
  action?:     React.ReactNode
}

export function Navbar({ breadcrumb, action }: NavbarProps) {
  return (
    <div className="sticky top-4 z-20 flex justify-center px-5">
      <nav className="glass-nav rounded-full px-5 py-2.5 flex items-center justify-between gap-8 w-full max-w-3xl">
        <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: '#0071e3' }}
          >
            <IconGitCommit className="w-3.5 h-3.5 text-white" />
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            GitBrief
          </span>
        </a>

        {breadcrumb && (
          <div
            className="flex items-center gap-1 text-xs font-mono min-w-0 overflow-hidden"
            style={{ color: 'var(--text-secondary)' }}
          >
            {breadcrumb}
          </div>
        )}

        {action && <div className="flex-shrink-0">{action}</div>}
      </nav>
    </div>
  )
}