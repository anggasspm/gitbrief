export function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 2L3 5v5c0 4.5 3 8 7 9 4-1 7-4.5 7-9V5l-7-3z" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconZap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 2L4 11h6l-1 7 7-9h-6l1-7z" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  )
}

export function IconTarget({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="7"/>
      <circle cx="10" cy="10" r="3"/>
      <line x1="10" y1="1" x2="10" y2="4" strokeLinecap="round"/>
      <line x1="10" y1="16" x2="10" y2="19" strokeLinecap="round"/>
      <line x1="1" y1="10" x2="4" y2="10" strokeLinecap="round"/>
      <line x1="16" y1="10" x2="19" y2="10" strokeLinecap="round"/>
    </svg>
  )
}

export function IconAlertTriangle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9.13 3.4L2.36 14.6A1 1 0 003.23 16h13.54a1 1 0 00.87-1.4L10.87 3.4a1 1 0 00-1.74 0z" strokeLinejoin="round"/>
      <line x1="10" y1="8" x2="10" y2="11" strokeLinecap="round"/>
      <circle cx="10" cy="13.5" r="0.5" fill="currentColor"/>
    </svg>
  )
}

export function IconFlask({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 2h6M8 2v5L4 15a1 1 0 00.9 1.5h10.2A1 1 0 0016 15l-4-8V2" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  )
}

export function IconFileText({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 3h7l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" strokeLinejoin="round"/>
      <path d="M12 3v4h4M7 9h6M7 12h6M7 15h4" strokeLinecap="round"/>
    </svg>
  )
}

export function IconDatabase({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="10" cy="5" rx="7" ry="2.5"/>
      <path d="M3 5v4c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V5"/>
      <path d="M3 9v4c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V9"/>
    </svg>
  )
}

export function IconLock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="9" width="12" height="9" rx="1.5" strokeLinejoin="round"/>
      <path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round"/>
    </svg>
  )
}

export function IconInfo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="7"/>
      <line x1="10" y1="9" x2="10" y2="14" strokeLinecap="round"/>
      <circle cx="10" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  )
}

export function IconGitCommit({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="3"/>
      <line x1="1" y1="10" x2="7" y2="10" strokeLinecap="round"/>
      <line x1="13" y1="10" x2="19" y2="10" strokeLinecap="round"/>
    </svg>
  )
}

export function IconGitPullRequest({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="5" cy="5" r="2"/>
      <circle cx="5" cy="15" r="2"/>
      <circle cx="15" cy="5" r="2"/>
      <line x1="5" y1="7" x2="5" y2="13" strokeLinecap="round"/>
      <path d="M15 7v2a4 4 0 01-4 4H8" strokeLinecap="round"/>
      <path d="M6 12l-2 2 2 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 2l2.4 5h5.1l-4.1 3 1.5 5.2L10 12.2l-4.9 3 1.5-5.2L2.5 7h5.1L10 2z" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconExternalLink({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 3h6v6M17 3L9 11" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 5H4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-5" strokeLinecap="round"/>
    </svg>
  )
}

export function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 10h12M12 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconGitMerge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="5" r="2"/>
      <circle cx="6" cy="15" r="2"/>
      <circle cx="14" cy="15" r="2"/>
      <path d="M6 7v4M6 11c0 2.5 2 4 4 4M14 13V9a4 4 0 00-4-4" strokeLinecap="round"/>
    </svg>
  )
}

export function IconArrowLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 10H4M9 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}