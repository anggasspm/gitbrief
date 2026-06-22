export function riskColor(risk: string) {
  return {
    LOW:      'text-emerald-700 bg-emerald-50  border-emerald-200',
    MEDIUM:   'text-amber-700   bg-amber-50    border-amber-200',
    HIGH:     'text-orange-700  bg-orange-50   border-orange-200',
    CRITICAL: 'text-red-700     bg-red-50      border-red-200',
  }[risk] ?? 'text-gray-600 bg-gray-100 border-gray-200'
}

export function riskBarColor(score: number) {
  if (score < 30) return 'bg-emerald-500'
  if (score < 60) return 'bg-amber-500'
  if (score < 80) return 'bg-orange-500'
  return 'bg-red-500'
}