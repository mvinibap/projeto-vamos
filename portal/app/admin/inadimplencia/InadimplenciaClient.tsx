'use client'

import { useState } from 'react'
import Link from 'next/link'

type RiskLevel = 'vencido' | 'vence_hoje' | 'vence_semana' | 'ok'

export type InadimplenciaRow = {
  id: string
  numero_pedido: string
  nome_empresa: string
  data_fim: string
  equipamento_nome: string | null
  _risco: RiskLevel
  _diffDias: number
  _scoreNum: number
  _scoreRec: 'aprovado' | 'analise' | 'negado'
  _valor: number | null
}

const RISCO_CFG: Record<RiskLevel, { label: string; title: string; subtitle: string; color: string; bg: string; border: string; kpiBg: string; kpiBorder: string }> = {
  vencido:      { label: 'Vencido',       title: '🚨 Contratos vencidos',      subtitle: 'Equipamentos ainda em uso após término do contrato', color: '#f87171', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  kpiBg: 'rgba(239,68,68,0.08)',  kpiBorder: 'rgba(239,68,68,0.3)'  },
  vence_hoje:   { label: 'Vence hoje',    title: '⚠️ Vencem hoje',             subtitle: 'Entrar em contato para renovação ou devolução',       color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)', kpiBg: 'rgba(251,146,60,0.06)', kpiBorder: 'rgba(251,146,60,0.25)' },
  vence_semana: { label: 'Vence em breve',title: '📅 Vencem em até 7 dias',    subtitle: 'Prospectar renovação proativamente',                   color: '#facc15', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.25)', kpiBg: 'rgba(234,179,8,0.06)',  kpiBorder: 'rgba(234,179,8,0.2)'  },
  ok:           { label: 'Em dia',        title: 'Em dia',                     subtitle: 'Contratos ativos sem risco imediato',                  color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)',  kpiBg: 'rgba(34,197,94,0.08)',  kpiBorder: 'rgba(34,197,94,0.2)'  },
}

export default function InadimplenciaClient({ rows }: { rows: InadimplenciaRow[] }) {
  const [filtro, setFiltro] = useState<RiskLevel | null>(null)
  const toggle = (r: RiskLevel) => setFiltro((prev) => (prev === r ? null : r))

  const counts: Record<RiskLevel, number> = { vencido: 0, vence_hoje: 0, vence_semana: 0, ok: 0 }
  rows.forEach((r) => { counts[r._risco]++ })

  const groups: RiskLevel[] = ['vencido', 'vence_hoje', 'vence_semana', 'ok']
  const activeGroups = filtro ? [filtro] : groups.filter((g) => counts[g] > 0)

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
          Inadimplência & Vencimentos
        </h1>
        <p style={{ fontSize: 13, color: '#475569' }}>
          {filtro
            ? <>Filtrando por <strong style={{ color: '#cbd5e1' }}>{RISCO_CFG[filtro].label}</strong> · {rows.filter((r) => r._risco === filtro).length} contrato{rows.filter((r) => r._risco === filtro).length !== 1 ? 's' : ''}</>
            : 'Contratos ativos ordenados por data de vencimento'
          }
          {filtro && (
            <button onClick={() => setFiltro(null)} style={{ marginLeft: 10, fontSize: 11, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
              Limpar filtro
            </button>
          )}
        </p>
      </div>

      {/* KPI cards — clicáveis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <KpiCard risco="vencido"      value={counts.vencido}      active={filtro === 'vencido'}      onClick={() => toggle('vencido')}      neutralWhen={counts.vencido === 0} />
        <KpiCard risco="vence_hoje"   value={counts.vence_hoje}   active={filtro === 'vence_hoje'}   onClick={() => toggle('vence_hoje')}   neutralWhen={counts.vence_hoje === 0} />
        <KpiCard risco="vence_semana" value={counts.vence_semana} active={filtro === 'vence_semana'} onClick={() => toggle('vence_semana')} neutralWhen={counts.vence_semana === 0} />

        {/* Total — reset */}
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
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Total em aberto</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>{rows.length}</p>
        </button>
      </div>

      {/* Groups */}
      {activeGroups.map((key) => {
        const items = rows.filter((r) => r._risco === key)
        if (items.length === 0) return null
        const cfg = RISCO_CFG[key]
        return (
          <section key={key} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.title}</h2>
              <span style={{ fontSize: 11, color: '#475569' }}>{cfg.subtitle}</span>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e293b' }}>
                    {['Empresa', 'Equipamento', 'Score CNPJ', 'Valor', 'Término', 'Situação', ''].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 16px', fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((p, i) => {
                    const scoreColor = p._scoreRec === 'aprovado' ? '#4ade80' : p._scoreRec === 'analise' ? '#facc15' : '#f87171'
                    const diffLabel = p._diffDias < 0 ? `${Math.abs(p._diffDias)} dias atraso` : p._diffDias === 0 ? 'Hoje' : `${p._diffDias} dias`
                    return (
                      <tr key={p.id} style={{ borderBottom: i < items.length - 1 ? '1px solid #1e293b' : 'none', borderLeft: `3px solid ${cfg.color}40` }}>
                        <td style={{ padding: '11px 16px', color: '#e2e8f0', fontWeight: 500 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: 180 }}>{p.nome_empresa}</span>
                          <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{p.numero_pedido}</span>
                        </td>
                        <td style={{ padding: '11px 16px', color: '#64748b', fontSize: 12, maxWidth: 160 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{p.equipamento_nome ?? '—'}</span>
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: scoreColor, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)' }}>{p._scoreNum.toFixed(1)}</span>
                        </td>
                        <td style={{ padding: '11px 16px', color: p._valor ? '#f1f5f9' : '#475569', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {p._valor ? `R$ ${p._valor.toLocaleString('pt-BR')}` : '—'}
                        </td>
                        <td style={{ padding: '11px 16px', color: '#94a3b8', fontSize: 12, whiteSpace: 'nowrap' }}>
                          {new Date(p.data_fim).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap' }}>
                            {diffLabel}
                          </span>
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <Link href={`/admin/pedidos/${p.id}`} style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: '#1e293b', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                            Ver →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}

      {rows.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>✓</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Nenhum contrato ativo</p>
          <p style={{ fontSize: 13 }}>Contratos ativos aparecerão aqui quando houver locações em andamento.</p>
        </div>
      )}

      {filtro && rows.filter((r) => r._risco === filtro).length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
          <p style={{ fontSize: 13 }}>Nenhum contrato nessa categoria.{' '}
            <button onClick={() => setFiltro(null)} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>Ver todos</button>
          </p>
        </div>
      )}
    </main>
  )
}

function KpiCard({ risco, value, active, onClick, neutralWhen }: {
  risco: RiskLevel; value: number; active: boolean; onClick: () => void; neutralWhen: boolean
}) {
  const cfg = RISCO_CFG[risco]
  const color = neutralWhen ? '#f1f5f9' : cfg.color
  const bg    = neutralWhen && !active ? '#0f172a' : active ? cfg.kpiBg.replace('0.08', '0.14').replace('0.06', '0.12') : cfg.kpiBg
  const border = active ? cfg.color : neutralWhen ? '#1e293b' : cfg.kpiBorder

  return (
    <button
      onClick={onClick}
      style={{ background: bg, borderRadius: 12, border: `1px solid ${border}`, padding: '18px 22px', textAlign: 'left', cursor: 'pointer', outline: 'none', boxShadow: active ? `0 0 0 1px ${cfg.color}30` : 'none', transition: 'border-color 0.15s, box-shadow 0.15s' }}
    >
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>
        {cfg.label === 'Vence em breve' ? 'Vencem em 7 dias' : cfg.label}
        {active && <span style={{ fontSize: 10, color: cfg.color }}> ✕</span>}
      </p>
      <p style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>{value}</p>
    </button>
  )
}
