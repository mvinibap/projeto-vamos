'use client'

import { useState } from 'react'

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  novo:             { label: 'Novo',             color: '#1d4ed8' },
  em_analise:       { label: 'Em análise',       color: '#d97706' },
  contrato_enviado: { label: 'Contrato enviado', color: '#7c3aed' },
  assinado:         { label: 'Assinado',         color: '#3730a3' },
  ativo:            { label: 'Ativo',            color: '#15803d' },
  rejeitado:        { label: 'Rejeitado',        color: '#dc2626' },
}

const STATUS_ORDER = ['novo', 'em_analise', 'contrato_enviado', 'assinado', 'ativo', 'rejeitado']

type View = 'barras' | 'pizza'

function PieChart({ slices }: { slices: { label: string; color: string; pct: number }[] }) {
  const cx = 80, cy = 80, r = 70
  let cumAngle = -Math.PI / 2 // start at top

  const paths = slices.map((sl) => {
    if (sl.pct <= 0) return null
    const angle = sl.pct * 2 * Math.PI
    const x1 = cx + r * Math.cos(cumAngle)
    const y1 = cy + r * Math.sin(cumAngle)
    cumAngle += angle
    const x2 = cx + r * Math.cos(cumAngle)
    const y2 = cy + r * Math.sin(cumAngle)
    const large = angle > Math.PI ? 1 : 0
    // label position
    const midAngle = cumAngle - angle / 2
    const lx = cx + (r * 0.62) * Math.cos(midAngle)
    const ly = cy + (r * 0.62) * Math.sin(midAngle)
    const showLabel = sl.pct > 0.06
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: sl.color, label: sl.label, lx, ly, showLabel, pct: sl.pct }
  }).filter(Boolean)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        {paths.map((p, i) => p && (
          <g key={i}>
            <path d={p.d} fill={p.color} stroke="#0f172a" strokeWidth={1.5} />
            {p.showLabel && (
              <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle"
                fontSize={10} fontWeight={700} fill="#fff">
                {Math.round(p.pct * 100)}%
              </text>
            )}
          </g>
        ))}
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {slices.filter(s => s.pct > 0).map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0, display: 'block' }} />
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{s.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginLeft: 'auto', paddingLeft: 12 }}>
              {Math.round(s.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FunilStatus({ statusMap }: { statusMap: Record<string, number> }) {
  const [view, setView] = useState<View>('barras')

  const total = Object.values(statusMap).reduce((a, b) => a + b, 0)

  const slices = STATUS_ORDER.map((s) => ({
    label: STATUS_CFG[s]?.label ?? s,
    color: STATUS_CFG[s]?.color ?? '#64748b',
    count: statusMap[s] ?? 0,
    pct: total > 0 ? (statusMap[s] ?? 0) / total : 0,
  }))

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Funil de status
        </p>
        <div style={{ display: 'flex', background: '#1e293b', borderRadius: 6, padding: 2, gap: 2 }}>
          {(['barras', 'pizza'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 4, border: 'none',
                cursor: 'pointer', letterSpacing: '0.3px',
                background: view === v ? '#334155' : 'transparent',
                color: view === v ? '#f1f5f9' : '#475569',
                transition: 'all 120ms',
              }}
            >
              {v === 'barras' ? '▬ Barras' : '◕ Pizza'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {view === 'barras' ? (
        <div>
          {/* Barra única empilhada */}
          <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
            {slices.filter(s => s.count > 0).map((s) => (
              <div
                key={s.label}
                title={`${s.label}: ${s.count} (${Math.round(s.pct * 100)}%)`}
                style={{ width: `${s.pct * 100}%`, background: s.color, transition: 'width 300ms ease' }}
              />
            ))}
          </div>
          {/* Legenda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {slices.filter(s => s.count > 0).map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0, display: 'block' }} />
                <span style={{ fontSize: 12, color: '#94a3b8', flex: 1 }}>{s.label}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>{s.count}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', width: 36, textAlign: 'right' }}>
                  {Math.round(s.pct * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <PieChart slices={slices} />
      )}
    </div>
  )
}
