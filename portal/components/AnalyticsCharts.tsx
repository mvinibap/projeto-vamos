'use client'

import { useState } from 'react'

type View = 'barras' | 'pizza'

// ── Tipos de dados ───────────────────────────────────────────────────────────

type Slice = { label: string; color: string; count: number; pct: number }

type Props = {
  statusMap: Record<string, number>
  topEstados: [string, number][]
  alocacao: { total: number; disponivel: number; reservado: number; indisponivel: number }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildSlices(items: { label: string; color: string; count: number }[], total: number): Slice[] {
  return items.filter(s => s.count > 0).map(s => ({ ...s, pct: total > 0 ? s.count / total : 0 }))
}

// ── Sub-componentes de visualização ─────────────────────────────────────────

function PieChart({ slices }: { slices: Slice[] }) {
  const cx = 72, cy = 72, r = 62
  let cumAngle = -Math.PI / 2

  type PathData = { d: string; color: string; lx: number; ly: number; pct: number; showLabel: boolean }
  const paths: PathData[] = []
  for (const sl of slices) {
    if (sl.pct <= 0) continue
    const angle = sl.pct * 2 * Math.PI
    const x1 = cx + r * Math.cos(cumAngle)
    const y1 = cy + r * Math.sin(cumAngle)
    cumAngle += angle
    const x2 = cx + r * Math.cos(cumAngle)
    const y2 = cy + r * Math.sin(cumAngle)
    const large = angle > Math.PI ? 1 : 0
    const midAngle = cumAngle - angle / 2
    const lx = cx + r * 0.62 * Math.cos(midAngle)
    const ly = cy + r * 0.62 * Math.sin(midAngle)
    paths.push({ d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: sl.color, lx, ly, pct: sl.pct, showLabel: sl.pct > 0.07 })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width={144} height={144} viewBox="0 0 144 144" style={{ flexShrink: 0 }}>
        {paths.map((p, i) => (
          <g key={i}>
            <path d={p.d} fill={p.color} stroke="#0f172a" strokeWidth={1.5} />
            {p.showLabel && (
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
            <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', flexShrink: 0 }}>{Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StackedBar({ slices, subtitle }: { slices: Slice[]; subtitle?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden', marginBottom: 14 }}>
        {slices.map((s) => (
          <div key={s.label} title={`${s.label}: ${s.count} (${Math.round(s.pct * 100)}%)`}
            style={{ width: `${s.pct * 100}%`, background: s.color }} />
        ))}
      </div>
      {subtitle && <p style={{ fontSize: 11, color: '#475569', marginBottom: 10 }}>{subtitle}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {slices.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: s.color, flexShrink: 0, display: 'block' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{s.count}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', width: 34, textAlign: 'right' }}>
              {Math.round(s.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────

const ESTADO_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#6366f1']

export default function AnalyticsCharts({ statusMap: _statusMap, topEstados, alocacao }: Props) {
  const [view, setView] = useState<View>('barras')

  const totalEstados = topEstados.reduce((s, [, n]) => s + n, 0)
  const estadoSlices = buildSlices(
    topEstados.map(([estado, count], i) => ({ label: estado, color: ESTADO_COLORS[i % ESTADO_COLORS.length], count })),
    totalEstados
  )

  const alocSlices = buildSlices([
    { label: 'Alugado',     color: '#15803d', count: alocacao.reservado },
    { label: 'Ocioso',      color: '#334155', count: alocacao.disponivel },
    { label: 'Indisponível',color: '#dc2626', count: alocacao.indisponivel },
  ], alocacao.total)

  return (
    <div>
      {/* Header com toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          Análise operacional
        </p>
        <div style={{ display: 'flex', background: '#1e293b', borderRadius: 6, padding: 2, gap: 2 }}>
          {(['barras', 'pizza'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 4, border: 'none',
              cursor: 'pointer',
              background: view === v ? '#334155' : 'transparent',
              color: view === v ? '#f1f5f9' : '#475569',
              transition: 'all 120ms',
            }}>
              {v === 'barras' ? '▬ Barras' : '◕ Pizza'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid dos 2 charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '20px' }}>
          <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
            Top estados
          </p>
          {view === 'barras'
            ? <StackedBar slices={estadoSlices} />
            : <PieChart slices={estadoSlices} />}
        </div>

        <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '20px' }}>
          <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
            Alocação de equipamentos
          </p>
          {view === 'barras'
            ? <StackedBar slices={alocSlices} subtitle={`${alocacao.total} equipamentos no total`} />
            : <PieChart slices={alocSlices} />}
        </div>
      </div>
    </div>
  )
}
