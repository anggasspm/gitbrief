import { GlassCard }     from './GlassCard'
import { RiskBadge }     from './RiskBadge'
import { BreakingBadge } from './BreakingBadge'
import { riskBarColor }  from '@/lib/risk'
import {
  IconInfo, IconZap, IconTarget, IconAlertTriangle,
  IconLock, IconFlask, IconFileText,
} from './Icons'

interface Props {
  summary:         string
  why:             string
  impact:          string[]
  risk:            string
  riskScore:       number
  breaking:        boolean
  breakingDetails: string | null
  security:        string | null
  testing:         string
  changelog:       string
  cached?:         boolean
}

export function ExplainCard(p: Props) {
  return (
    <div className="space-y-3">
      {/* badges */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <RiskBadge risk={p.risk} />
        <BreakingBadge breaking={p.breaking} />
        {p.cached && (
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary)' }}
          >
            Cached
          </span>
        )}
      </div>

      <SectionCard icon={<IconInfo className="w-4 h-4" />} title="Summary">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {p.summary}
        </p>
      </SectionCard>

      <SectionCard icon={<IconZap className="w-4 h-4" />} title="Why">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {p.why}
        </p>
      </SectionCard>

      <SectionCard icon={<IconTarget className="w-4 h-4" />} title="Impact">
        <ul className="space-y-2.5">
          {p.impact.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span
                className="mt-[9px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: 'var(--accent)', opacity: 0.6 }}
              />
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard icon={<IconAlertTriangle className="w-4 h-4" />} title="Risk Assessment">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Score</span>
            <span
              className="font-mono tabular-nums font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {p.riskScore} / 100
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.08)' }}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${riskBarColor(p.riskScore)}`}
              style={{ width: `${p.riskScore}%` }}
            />
          </div>
        </div>
      </SectionCard>

      {p.breaking && p.breakingDetails && (
        <SectionCard
          icon={<IconAlertTriangle className="w-4 h-4" style={{ color: '#dc2626' } as React.CSSProperties} />}
          title="Breaking Changes"
          borderAccent="rgba(220,38,38,0.15)"
        >
          <p className="text-sm leading-relaxed" style={{ color: '#b91c1c' }}>
            {p.breakingDetails}
          </p>
        </SectionCard>
      )}

      {p.security && (
        <SectionCard icon={<IconLock className="w-4 h-4" />} title="Security">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {p.security}
          </p>
        </SectionCard>
      )}

      <SectionCard icon={<IconFlask className="w-4 h-4" />} title="Testing">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {p.testing}
        </p>
      </SectionCard>

      <SectionCard icon={<IconFileText className="w-4 h-4" />} title="Changelog">
        <div
          className="text-sm font-mono rounded-xl px-4 py-3.5 leading-relaxed"
          style={{
            background: 'rgba(0,0,0,0.03)',
            border: '1px solid rgba(0,0,0,0.06)',
            color: 'var(--text-primary)',
          }}
        >
          {p.changelog}
        </div>
      </SectionCard>
    </div>
  )
}

function SectionCard({
  icon, title, children, borderAccent,
}: {
  icon:          React.ReactNode
  title:         string
  children:      React.ReactNode
  borderAccent?: string
}) {
  return (
    <GlassCard
      className="p-6 space-y-4"
      style={borderAccent ? { borderColor: borderAccent } : undefined}
    >
      <h3
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <span style={{ color: 'var(--text-secondary)' }}>{icon}</span>
        {title}
      </h3>
      {children}
    </GlassCard>
  )
}