'use client'

import { IconFileText } from './Icons'

interface DiffFile {
  filename: string
  diff: string
}

export function splitDiffByFile(rawDiff: string): DiffFile[] {
  const files: DiffFile[] = []
  const blocks = rawDiff.split(/(?=^diff --git )/m).filter(Boolean)

  for (const block of blocks) {
    const match = block.match(/^diff --git a\/(.+?) b\/(.+?)$/m)
    const filename = match ? match[2] : 'unknown file'
    files.push({ filename, diff: block })
  }

  return files
}

type Row =
  | { id: number; type: 'meta' | 'hunk'; line: string }
  | { id: number; type: 'add' | 'del' | 'ctx'; line: string }

function parseDiffLines(diff: string): Row[] {
  return diff.split('\n').map((line, i) => {
    let type: Row['type'] = 'ctx'
    if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('diff --git') || line.startsWith('index '))
      type = 'meta'
    else if (line.startsWith('@@')) type = 'hunk'
    else if (line.startsWith('+')) type = 'add'
    else if (line.startsWith('-')) type = 'del'
    return { id: i, type, line } as Row
  })
}

function FileDiff({ filename, diff }: DiffFile) {
  const rows = parseDiffLines(diff)
  let oldLn = 0
  let newLn = 0

  return (
    <div className="glass-panel rounded-2xl overflow-hidden mb-3">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/5">
        <IconFileText className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-xs font-mono text-zinc-400">{filename}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <tbody>
            {rows.map(r => {
              if (r.type === 'meta') return null

              if (r.type === 'hunk') {
                const m = r.line.match(/-(\d+)/)
                if (m) {
                  oldLn = parseInt(m[1], 10) - 1
                  newLn = oldLn
                }
                return (
                  <tr key={r.id} className="bg-white/5">
                    <td colSpan={3} className="px-4 py-1.5 text-zinc-500">{r.line}</td>
                  </tr>
                )
              }

              if (r.type === 'add') newLn++
              else if (r.type === 'del') oldLn++
              else { oldLn++; newLn++ }

              const bg = r.type === 'add' ? 'bg-emerald-500/10' : r.type === 'del' ? 'bg-red-500/10' : ''
              const text = r.type === 'add' ? 'text-emerald-300' : r.type === 'del' ? 'text-red-300' : 'text-zinc-400'
              const marker = r.type === 'add' ? '+' : r.type === 'del' ? '-' : ' '
              const markerColor = r.type === 'add' ? 'text-emerald-500' : r.type === 'del' ? 'text-red-500' : 'text-zinc-600'

              return (
                <tr key={r.id} className={`${bg} hover:bg-white/5`}>
                  <td className="w-10 px-2 text-right text-zinc-600 select-none border-r border-white/5">
                    {r.type !== 'add' ? oldLn : ''}
                  </td>
                  <td className="w-10 px-2 text-right text-zinc-600 select-none border-r border-white/5">
                    {r.type !== 'del' ? newLn : ''}
                  </td>
                  <td className={`px-3 py-0.5 whitespace-pre ${text}`}>
                    <span className={`inline-block w-3 ${markerColor}`}>{marker}</span>
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

  if (files.length === 0) {
    return <p className="text-zinc-600 text-sm font-mono">No diff available.</p>
  }

  return (
    <div>
      {files.map(f => (
        <FileDiff key={f.filename} filename={f.filename} diff={f.diff} />
      ))}
    </div>
  )
}