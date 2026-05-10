'use client'

import { useState } from 'react'

type View = 'barras' | 'pizza'

export type ChartItem = { label: string; color: string; value: number }

type Slice = ChartItem & { pct: number }

function buildSlices(items: ChartItem[]): Slice[] {
  const total = items.reduce((s, i) => s + i.value, 0)
  return items
    .filter(i => i.value > 0)
    .map(i => ({ ...i, pct: total > 0 ? i.value / total : 0 }))
}

function PieChart({ slices }: { slices: Slice[] }) {
  const cx = 72, cy = 72, r = 62
  let cumAngle = -Math.PI / 2
  const paths: { d: string; color: string; lx: number; ly: number; pct: number }[] = []

  for (const sl of slices) {
    const angle = sl.pct * 2 * Math.PI
    const x1 = cx + r * Math.cos(cumAngle)
    const y1 = cy + r * Math.sin(cumAngle)
    cumAngle += angle
    const x2 = cx + r * Math.cos(cumAngle)
    const y2 = cy + r * Math.sin(cumAngle)
    const mid = cumAngle - angle / 2
    paths.push({
      d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${angle > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`,
      color: sl.color,
      lx: cx + r * 0.62 * Math.cos(mid),
      ly: cy + r * 0.62 * Math.sin(mid),
      pct: sl.pct,
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width={144} height={144} viewBox="0 0 144 144" style={{ flexShrink: 0 }}>
        {paths.map((p, i) => (
          <g key={i}>
            <path d={p.d} fill={p.color} stroke="#0f172a" strokeWidth={1.5} />
            {p.pct > 0.07 && (
              <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={700} fill="#fff">
                {Math.round(p.pct * 100)}%
              </text>
            )}
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}>
        {slices.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: s.color, flexShrink: 0, display: 'block' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{s.value}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', width: 34, textAlign: 'right' }}>
              {Math.round(s.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarChart({ slices, footer }: { slices: Slice[]; footer?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden', marginBottom: 14 }}>
        {slices.map((s) => (
          <div key={s.label} title={`${s.label}: ${s.value}`}
            style={{ width: `${s.pct * 100}%`, background: s.color }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {slices.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: s.color, flexShrink: 0, display: 'block' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{s.value}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', width: 34, textAlign: 'right' }}>
              {Math.round(s.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
      {footer && <p style={{ fontSize: 10, color: '#334155', marginTop: 12 }}>{footer}</p>}
    </div>
  )
}

type Props = {
  title: string
  items: ChartItem[]
  footer?: string
}

export default function KPIChart({ title, items, footer }: Props) {
  const [view, setView] = useState<View>('barras')
  const slices = buildSlices(items)

  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {title}
        </p>
        <div style={{ display: 'flex', background: '#1e293b', borderRadius: 6, padding: 2, gap: 2 }}>
          {(['barras', 'pizza'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 4, border: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
              background: view === v ? '#334155' : 'transparent',
              color: view === v ? '#f1f5f9' : '#475569',
              transition: 'all 120ms',
            }}>
              {v === 'barras' ? '▬ Barras' : '◕ Pizza'}
            </button>
          ))}
        </div>
      </div>

      {slices.length === 0
        ? <p style={{ fontSize: 12, color: '#334155', textAlign: 'center', padding: '24px 0' }}>Sem dados</p>
        : view === 'barras'
          ? <BarChart slices={slices} footer={footer} />
          : <PieChart slices={slices} />}
    </div>
  )
}
