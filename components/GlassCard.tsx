'use client'

import { useRef, useCallback } from 'react'

interface GlassCardProps {
  children:  React.ReactNode
  className?: string
  href?:      string
  parallax?:  boolean
  style?:     React.CSSProperties
  onClick?:   () => void
}

export function GlassCard({
  children,
  className = '',
  href,
  parallax = false,
  style,
  onClick,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      el.style.setProperty('--mx', `${(x / rect.width)  * 100}%`)
      el.style.setProperty('--my', `${(y / rect.height) * 100}%`)

      if (parallax) {
        const tx = ((y / rect.height) - 0.5) * -3
        const ty = ((x / rect.width)  - 0.5) *  3
        el.style.transform = `perspective(1000px) rotateX(${tx}deg) rotateY(${ty}deg) translateY(-2px)`
      }
    },
    [parallax],
  )

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.removeProperty('--mx')
    el.style.removeProperty('--my')
  }, [])

  const card = (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={`glass-card relative overflow-hidden ${className}`}
      style={style}
    >
      {/* cursor shimmer — barely visible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(0,0,0,0.018), transparent 70%)`,
        }}
      />
      {children}
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block group">
        {card}
      </a>
    )
  }

  return <div className="group">{card}</div>
}