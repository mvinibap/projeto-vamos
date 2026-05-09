'use client'

import { useState } from 'react'
import { FilterBadge } from '@/components/FilterBadge'

type EqStatus = 'disponivel' | 'reservado' | 'indisponivel'

export type EquipamentoRow = {
  id: string
  nome: string
  categoria: string | null
  preco_dia: number | null
  status: EqStatus
  disponivel_a_partir_de: string | null
}

const STATUS_CFG: Record<EqStatus, { label: string; pillBg: string; pillColor: string; pillBorder: string; filterColor: string; filterBg: string }> = {
  disponivel:   { label: 'Disponível', pillBg: 'rgba(21,128,61,0.15)',  pillColor: '#4ade80', pillBorder: 'rgba(34,197,94,0.25)',  filterColor: '#4ade80', filterBg: 'rgba(21,128,61,0.1)'  },
  reservado:    { label: 'Alugado',    pillBg: 'rgba(29,78,216,0.12)',  pillColor: '#60a5fa', pillBorder: 'rgba(59,130,246,0.25)', filterColor: '#60a5fa', filterBg: 'rgba(29,78,216,0.1)'  },
  indisponivel: { label: 'Manutenção', pillBg: 'rgba(153,27,27,0.12)',  pillColor: '#f87171', pillBorder: 'rgba(239,68,68,0.25)',  filterColor: '#f87171', filterBg: 'rgba(153,27,27,0.1)'  },
}

export default function EquipamentosClient({ equipamentos }: { equipamentos: EquipamentoRow[] }) {
  const [filtro, setFiltro] = useState<EqStatus | null>(null)
  const toggle = (s: EqStatus) => setFiltro((prev) => (prev === s ? null : s))

  const total        = equipamentos.length
  const disponiveis  = equipamentos.filter((e) => e.status === 'disponivel').length
  const reservados   = equipamentos.filter((e) => e.status === 'reservado').length
  const indisponiveis = equipamentos.filter((e) => e.status === 'indisponivel').length

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
            : `${total} equipamento${total !== 1 ? 's' : ''} na frota`
          }
          {filtro && (
            <button onClick={() => setFiltro(null)} style={{ marginLeft: 10, fontSize: 11, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
              Limpar filtro
            </button>
          )}
        </p>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
        <FilterBadge label="Disponíveis" value={disponiveis} color={STATUS_CFG.disponivel.filterColor} bg={STATUS_CFG.disponivel.filterBg} active={filtro === 'disponivel'} onClick={() => toggle('disponivel')} />
        <FilterBadge label="Alugados"    value={reservados}   color={STATUS_CFG.reservado.filterColor}   bg={STATUS_CFG.reservado.filterBg}   active={filtro === 'reservado'}   onClick={() => toggle('reservado')}   />
        {indisponiveis > 0 && (
          <FilterBadge label="Manutenção" value={indisponiveis} color={STATUS_CFG.indisponivel.filterColor} bg={STATUS_CFG.indisponivel.filterBg} active={filtro === 'indisponivel'} onClick={() => toggle('indisponivel')} />
        )}
      </div>

      {/* Tabela */}
      <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 720, fontSize: 13, borderCollapse: 'collapse' }}>
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
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: cfg.pillBg, color: cfg.pillColor, border: `1px solid ${cfg.pillBorder}` }}>
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
