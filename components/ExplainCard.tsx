import { RiskBadge }         from './RiskBadge'
import { BreakingBadge }     from './BreakingBadge'
import { riskBarColor }      from '@/lib/risk'
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
    <div className="space-y-px">
      {/* badges */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <RiskBadge risk={p.risk} />
        <BreakingBadge breaking={p.breaking} />
        {p.cached && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs glass-pill text-zinc-500">
            Cached
          </span>
        )}
      </div>

      {/* cards */}
      <CardRow icon={<IconInfo className="w-4 h-4" />} title="Summary">
        <p className="text-zinc-200 leading-relaxed">{p.summary}</p>
      </CardRow>

      <CardRow icon={<IconZap className="w-4 h-4" />} title="Why">
        <p className="text-zinc-300 leading-relaxed">{p.why}</p>
      </CardRow>

      <CardRow icon={<IconTarget className="w-4 h-4" />} title="Impact">
        <ul className="space-y-2">
          {p.impact.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-zinc-300 text-sm">
              <span className="mt-2 w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </CardRow>

      <CardRow icon={<IconAlertTriangle className="w-4 h-4" />} title="Risk Assessment">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Score</span>
            <span className="font-mono text-zinc-300 tabular-nums">{p.riskScore} / 100</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${riskBarColor(p.riskScore)}`}
              style={{ width: `${p.riskScore}%` }}
            />
          </div>
        </div>
      </CardRow>

      {p.breaking && p.breakingDetails && (
        <CardRow icon={<IconAlertTriangle className="w-4 h-4 text-red-400" />} title="Breaking Changes" accent="red">
          <p className="text-red-300 leading-relaxed text-sm">{p.breakingDetails}</p>
        </CardRow>
      )}

      {p.security && (
        <CardRow icon={<IconLock className="w-4 h-4" />} title="Security Impact">
          <p className="text-zinc-300 leading-relaxed text-sm">{p.security}</p>
        </CardRow>
      )}

      <CardRow icon={<IconFlask className="w-4 h-4" />} title="Testing Recommendations">
        <p className="text-zinc-300 leading-relaxed text-sm">{p.testing}</p>
      </CardRow>

      <CardRow icon={<IconFileText className="w-4 h-4" />} title="Changelog Entry">
        <div className="font-mono text-sm bg-black/30 border border-white/5 rounded-lg px-4 py-3 text-zinc-300">
          {p.changelog}
        </div>
      </CardRow>
    </div>
  )
}

function CardRow({
  icon, title, children, accent,
}: {
  icon: React.ReactNode; title: string; children: React.ReactNode; accent?: string
}) {
  return (
    <div
      className="glass-panel rounded-2xl p-5 space-y-3 mb-3"
      style={accent === 'red' ? { borderColor: 'rgba(248,113,113,0.35)' } : undefined}
    >
      <h3 className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
        <span className="text-zinc-600">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}