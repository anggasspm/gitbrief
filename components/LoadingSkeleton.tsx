export function LoadingSkeleton() {
  return (
    <div className="space-y-3 mt-6" aria-label="Loading">
      <div className="flex gap-2 mb-8">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
      {[
        [85],
        [70],
        [95, 80, 55],
        [75, 45],
      ].map((lines, i) => (
        <div key={i} className="glass-card p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="skeleton h-3.5 w-3.5 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
          <div className="space-y-2 pt-1">
            {lines.map((w, j) => (
              <div
                key={j}
                className="skeleton h-4 rounded"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}