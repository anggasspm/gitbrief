import { riskColor } from '@/lib/risk'

export function RiskBadge({ risk }: { risk: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${riskColor(risk)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {risk}
    </span>
  )
}