'use client'

import { IconFileText } from './Icons'

interface DiffFile {
  filename: string
  diff:     string
}

export function splitDiffByFile(rawDiff: string): DiffFile[] {
  const files: DiffFile[] = []
  const blocks = rawDiff.split(/(?=^diff --git )/m).filter(Boolean)
  for (const block of blocks) {
    const match = block.match(/^diff --git a\/(.+?) b\/(.+?)$/m)
    files.push({ filename: match ? match[2] : 'unknown', diff: block })
  }
  return files
}

type RowType = 'meta' | 'hunk' | 'add' | 'del' | 'ctx'
interface Row { id: number; type: RowType; line: string }

function parseDiffLines(diff: string): Row[] {
  return diff.split('\n').map((line, i) => {
    let type: RowType = 'ctx'
    if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('diff --git') || line.startsWith('index '))
      type = 'meta'
    else if (line.startsWith('@@')) type = 'hunk'
    else if (line.startsWith('+'))  type = 'add'
    else if (line.startsWith('-'))  type = 'del'
    return { id: i, type, line }
  })
}

function FileDiff({ filename, diff }: DiffFile) {
  const rows = parseDiffLines(diff)
  let oldLn = 0, newLn = 0

  return (
    <div
      className="rounded-2xl overflow-hidden mb-3"
      style={{
        background: 'rgba(255,255,255,0.72)',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: 'rgba(0,0,0,0.02)',
        }}
      >
        <IconFileText className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' } as React.CSSProperties} />
        <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          {filename}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <tbody>
            {rows.map(r => {
              if (r.type === 'meta') return null

              if (r.type === 'hunk') {
                const m = r.line.match(/-(\d+)/)
                if (m) { oldLn = parseInt(m[1], 10) - 1; newLn = oldLn }
                return (
                  <tr key={r.id} style={{ background: 'rgba(0,113,227,0.04)' }}>
                    <td colSpan={3} className="px-4 py-1.5" style={{ color: 'var(--text-secondary)' }}>
                      {r.line}
                    </td>
                  </tr>
                )
              }

              if (r.type === 'add') newLn++
              else if (r.type === 'del') oldLn++
              else { oldLn++; newLn++ }

              const bg   = r.type === 'add' ? 'rgba(34,197,94,0.07)'  : r.type === 'del' ? 'rgba(239,68,68,0.07)'  : 'transparent'
              const text = r.type === 'add' ? '#15803d'                : r.type === 'del' ? '#b91c1c'               : 'var(--text-primary)'
              const mark = r.type === 'add' ? '+' : r.type === 'del' ? '-' : ' '
              const mc   = r.type === 'add' ? '#16a34a'                : r.type === 'del' ? '#dc2626'               : 'var(--text-tertiary)'

              return (
                <tr key={r.id} style={{ background: bg }}>
                  <td className="w-10 px-2 text-right select-none" style={{ color: 'var(--text-tertiary)', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                    {r.type !== 'add' ? oldLn : ''}
                  </td>
                  <td className="w-10 px-2 text-right select-none" style={{ color: 'var(--text-tertiary)', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                    {r.type !== 'del' ? newLn : ''}
                  </td>
                  <td className="px-3 py-0.5 whitespace-pre" style={{ color: text }}>
                    <span className="inline-block w-3" style={{ color: mc }}>{mark}</span>
                    {r.line.slice(1)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DiffViewer({ rawDiff }: { rawDiff: string }) {
  const files = splitDiffByFile(rawDiff)
  if (files.length === 0)
    return <p className="text-sm font-mono" style={{ color: 'var(--text-tertiary)' }}>No diff available.</p>
  return (
    <div>
      {files.map(f => <FileDiff key={f.filename} filename={f.filename} diff={f.diff} />)}
    </div>
  )
}