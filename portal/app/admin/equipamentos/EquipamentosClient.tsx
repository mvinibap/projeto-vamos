'use client'

import { useState } from 'react'

type EqStatus = 'disponivel' | 'reservado' | 'indisponivel'

export type EquipamentoRow = {
  id: string
  nome: string
  categoria: string | null
  preco_dia: number | null
  status: EqStatus
  disponivel_a_partir_de: string | null
}

const STATUS_CFG: Record<EqStatus, { label: string; bg: string; color: string; border: string; kpiBg: string; kpiBorder: string }> = {
  disponivel:   { label: 'Disponível', color: '#4ade80', bg: 'rgba(21,128,61,0.15)',   border: 'rgba(34,197,94,0.25)',  kpiBg: 'rgba(21,128,61,0.06)',  kpiBorder: 'rgba(34,197,94,0.15)'  },
  reservado:    { label: 'Alugado',    color: '#60a5fa', bg: 'rgba(29,78,216,0.12)',   border: 'rgba(59,130,246,0.25)', kpiBg: 'rgba(29,78,216,0.06)',  kpiBorder: 'rgba(59,130,246,0.15)' },
  indisponivel: { label: 'Manutenção', color: '#f87171', bg: 'rgba(153,27,27,0.12)',   border: 'rgba(239,68,68,0.25)',  kpiBg: 'rgba(153,27,27,0.06)',  kpiBorder: 'rgba(239,68,68,0.15)'  },
}

export default function EquipamentosClient({ equipamentos }: { equipamentos: EquipamentoRow[] }) {
  const [filtro, setFiltro] = useState<EqStatus | null>(null)
  const toggle = (s: EqStatus) => setFiltro((prev) => (prev === s ? null : s))

  const total = equipamentos.length
  const disponiveis  = equipamentos.filter((e) => e.status === 'disponivel').length
  const reservados   = equipamentos.filter((e) => e.status === 'reservado').length
  const indisponiveis = equipamentos.filter((e) => e.status === 'indisponivel').length
  const taxaOcupacao = total > 0 ? Math.round((reservados / total) * 100) : 0

  const visiveis = filtro ? equipamentos.filter((e) => e.status === filtro) : equipamentos

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
          Frota de Equipamentos
        </h1>
        <p style={{ fontSize: 13, color: '#475569' }}>
          {filtro
            ? <>{visiveis.length} equipamento{visiveis.length !== 1 ? 's' : ''} · filtrando por <strong style={{ color: '#cbd5e1' }}>{STATUS_CFG[filtro].label}</strong></>
            : 'Status de alocação em tempo real'
          }
          {filtro && (
            <button onClick={() => setFiltro(null)} style={{ marginLeft: 10, fontSize: 11, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
              Limpar filtro
            </button>
          )}
        </p>
      </div>

      {/* KPI cards — 3 filtráveis + 1 métrica */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {/* Total — clica pra resetar filtro */}
        <button
          onClick={() => setFiltro(null)}
          style={{
            background: filtro === null ? 'rgba(241,245,249,0.06)' : '#0f172a',
            borderRadius: 12,
            border: `1px solid ${filtro === null ? '#475569' : '#1e293b'}`,
            padding: '18px 22px',
            textAlign: 'left',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: filtro === null ? '0 0 0 1px #47556940' : 'none',
          }}
        >
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Total na frota</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>{total}</p>
        </button>

        {/* Disponíveis */}
        <KpiCard label="Disponíveis" value={disponiveis} color={STATUS_CFG.disponivel.color} kpiBg={STATUS_CFG.disponivel.kpiBg} kpiBorder={STATUS_CFG.disponivel.kpiBorder} active={filtro === 'disponivel'} onClick={() => toggle('disponivel')} />

        {/* Alugados */}
        <KpiCard label="Alugados" value={reservados} color={STATUS_CFG.reservado.color} kpiBg={STATUS_CFG.reservado.kpiBg} kpiBorder={STATUS_CFG.reservado.kpiBorder} active={filtro === 'reservado'} onClick={() => toggle('reservado')} />

        {/* Manutenção */}
        {indisponiveis > 0
          ? <KpiCard label="Manutenção" value={indisponiveis} color={STATUS_CFG.indisponivel.color} kpiBg={STATUS_CFG.indisponivel.kpiBg} kpiBorder={STATUS_CFG.indisponivel.kpiBorder} active={filtro === 'indisponivel'} onClick={() => toggle('indisponivel')} />
          : (
            <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '18px 22px' }}>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Taxa de ocupação</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: taxaOcupacao >= 70 ? '#4ade80' : taxaOcupacao >= 40 ? '#facc15' : '#f87171', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>
                {taxaOcupacao}%
              </p>
            </div>
          )
        }
      </div>

      {/* Tabela */}
      <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              {['Equipamento', 'Categoria', 'Diária', 'Status', 'Disponível a partir de'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiveis.map((e) => {
              const cfg = STATUS_CFG[e.status]
              return (
                <tr key={e.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 500 }}>{e.nome}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>{e.categoria ?? '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {e.preco_dia ? `R$ ${e.preco_dia.toLocaleString('pt-BR')}/dia` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {cfg.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 12 }}>
                    {e.disponivel_a_partir_de
                      ? new Date(e.disponivel_a_partir_de).toLocaleDateString('pt-BR')
                      : e.status === 'disponivel' ? <span style={{ color: '#4ade80' }}>Agora</span> : '—'}
                  </td>
                </tr>
              )
            })}
            {visiveis.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '60px 16px', textAlign: 'center', color: '#475569' }}>
                  {filtro ? (
                    <>Nenhum equipamento com status <strong>{STATUS_CFG[filtro].label}</strong>.{' '}
                      <button onClick={() => setFiltro(null)} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>Ver todos</button>
                    </>
                  ) : 'Nenhum equipamento cadastrado.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function KpiCard({ label, value, color, kpiBg, kpiBorder, active, onClick }: {
  label: string; value: number; color: string; kpiBg: string; kpiBorder: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? kpiBg.replace('0.06', '0.12') : kpiBg,
        borderRadius: 12,
        border: `1px solid ${active ? color : kpiBorder}`,
        padding: '18px 22px',
        textAlign: 'left',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: active ? `0 0 0 1px ${color}30` : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>
        {label} {active && <span style={{ fontSize: 10, color }}> ✕</span>}
      </p>
      <p style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>
        {value}
      </p>
    </button>
  )
}
