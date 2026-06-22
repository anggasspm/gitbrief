export function riskColor(risk: string) {
  return {
    LOW:      'text-emerald-400 bg-emerald-400/8 border-emerald-400/20',
    MEDIUM:   'text-amber-400   bg-amber-400/8   border-amber-400/20',
    HIGH:     'text-orange-400  bg-orange-400/8  border-orange-400/20',
    CRITICAL: 'text-red-400     bg-red-400/8     border-red-400/20',
  }[risk] ?? 'text-zinc-400 bg-zinc-400/8 border-zinc-400/20'
}

export function riskBarColor(score: number) {
  if (score < 30) return 'bg-emerald-500'
  if (score < 60) return 'bg-amber-500'
  if (score < 80) return 'bg-orange-500'
  return 'bg-red-500'
}