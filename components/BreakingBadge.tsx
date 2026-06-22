import { IconAlertTriangle } from './Icons'

export function BreakingBadge({ breaking }: { breaking: boolean }) {
  if (!breaking) return null
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border text-red-700 bg-red-50 border-red-200">
      <IconAlertTriangle className="w-3 h-3" />
      Breaking Change
    </span>
  )
}