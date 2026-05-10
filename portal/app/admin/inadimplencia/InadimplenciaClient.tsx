'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FilterBadge } from '@/components/FilterBadge'
import { PaginatorControls } from '@/components/Paginator'

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

const RISCO_CFG: Record<RiskLevel, { label: string; filterLabel: string; title: string; subtitle: string; filterColor: string; filterBg: string; color: string; bg: string; border: string }> = {
  vencido:      { label: 'Vencido',       filterLabel: 'Vencidos',       title: 'Contratos vencidos',     subtitle: 'Equipamentos ainda em uso após término do contrato', filterColor: '#f87171', filterBg: 'rgba(239,68,68,0.1)',  color: '#f87171', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)'  },
  vence_hoje:   { label: 'Vence hoje',    filterLabel: 'Vencem hoje',    title: 'Vencem hoje',            subtitle: 'Entrar em contato para renovação ou devolução',       filterColor: '#fb923c', filterBg: 'rgba(251,146,60,0.1)', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)' },
  vence_semana: { label: 'Vence em breve',filterLabel: 'Vencem em 7 dias',title: 'Vencem em até 7 dias',   subtitle: 'Prospectar renovação proativamente',                   filterColor: '#facc15', filterBg: 'rgba(234,179,8,0.1)',  color: '#facc15', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.25)' },
  ok:           { label: 'Em dia',        filterLabel: 'Em dia',         title: 'Em dia',                 subtitle: 'Contratos ativos sem risco imediato',                  filterColor: '#4ade80', filterBg: 'rgba(34,197,94,0.1)',  color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)'  },
}

const RISK_ORDER: RiskLevel[] = ['vencido', 'vence_hoje', 'vence_semana', 'ok']

const PAGE_SIZE = 50

const INITIAL_PAGES: Record<RiskLevel, number> = { vencido: 1, vence_hoje: 1, vence_semana: 1, ok: 1 }

export default function InadimplenciaClient({ rows }: { rows: InadimplenciaRow[] }) {
  const [filtro, setFiltro] = useState<RiskLevel | null>(null)
  const [pages, setPages] = useState<Record<RiskLevel, number>>(INITIAL_PAGES)
  const setGroupPage = (k: RiskLevel, p: number) => setPages((prev) => ({ ...prev, [k]: p }))

  const toggle = (r: RiskLevel) => {
    setFiltro((prev) => (prev === r ? null : r))
    setPages(INITIAL_PAGES)
  }

  const counts: Record<RiskLevel, number> = { vencido: 0, vence_hoje: 0, vence_semana: 0, ok: 0 }
  rows.forEach((r) => { counts[r._risco]++ })

  const activeGroups = filtro ? [filtro] : RISK_ORDER.filter((g) => counts[g] > 0)

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--admin-text)', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
          Inadimplência & Vencimentos
        </h1>
        <p style={{ fontSize: 14, color: 'var(--admin-text-2)' }}>
          {filtro
            ? <>Filtrando por <strong style={{ color: '#cbd5e1' }}>{RISCO_CFG[filtro].label}</strong> · {counts[filtro]} contrato{counts[filtro] !== 1 ? 's' : ''}</>
            : 'Contratos ativos ordenados por data de vencimento'
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
        {RISK_ORDER.filter((r) => counts[r] > 0).map((r) => {
          const cfg = RISCO_CFG[r]
          return (
            <FilterBadge
              key={r}
              label={cfg.filterLabel}
              value={counts[r]}
              color={cfg.filterColor}
              bg={cfg.filterBg}
              active={filtro === r}
              onClick={() => toggle(r)}
            />
          )
        })}
      </div>

      {/* Groups */}
      {activeGroups.map((key) => {
        const items = rows.filter((r) => r._risco === key)
        if (items.length === 0) return null
        const cfg = RISCO_CFG[key]
        const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
        const groupPage = Math.min(pages[key] || 1, totalPages)
        const start = (groupPage - 1) * PAGE_SIZE
        const end = Math.min(start + PAGE_SIZE, items.length)
        const visibleItems = items.slice(start, end)
        return (
          <section key={key} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.title}</h2>
              <span style={{ fontSize: 11, color: 'var(--admin-muted-2)' }}>{cfg.subtitle}</span>
            </div>
            <div style={{ background: 'var(--admin-surface)', borderRadius: 12, border: '1px solid var(--admin-surf2)', overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 880, fontSize: 13, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--admin-surf2)' }}>
                    {['Empresa', 'Equipamento', 'Score CNPJ', 'Valor', 'Término', 'Situação', ''].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 16px', fontSize: 10, fontWeight: 700, color: 'var(--admin-border2)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((p, i) => {
                    const scoreColor = p._scoreRec === 'aprovado' ? '#4ade80' : p._scoreRec === 'analise' ? '#facc15' : '#f87171'
                    const diffLabel = p._diffDias < 0 ? `${Math.abs(p._diffDias)} dias atraso` : p._diffDias === 0 ? 'Hoje' : `${p._diffDias} dias`
                    return (
                      <tr key={p.id} style={{ borderBottom: i < visibleItems.length - 1 ? '1px solid var(--admin-surf2)' : 'none', borderLeft: `3px solid ${cfg.color}40` }}>
                        <td style={{ padding: '11px 16px', color: '#e2e8f0', fontWeight: 500 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: 180 }}>{p.nome_empresa}</span>
                          <span style={{ fontSize: 11, color: 'var(--admin-muted-2)', fontFamily: 'monospace' }}>{p.numero_pedido}</span>
                        </td>
                        <td style={{ padding: '11px 16px', color: 'var(--admin-muted)', fontSize: 12, maxWidth: 160 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{p.equipamento_nome ?? '—'}</span>
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: scoreColor, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', fontVariantNumeric: 'tabular-nums' }}>{p._scoreNum.toFixed(1)}</span>
                        </td>
                        <td style={{ padding: '11px 16px', color: p._valor ? 'var(--admin-text)' : 'var(--admin-muted-2)', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {p._valor ? `R$ ${p._valor.toLocaleString('pt-BR')}` : '—'}
                        </td>
                        <td style={{ padding: '11px 16px', color: 'var(--admin-text-2)', fontSize: 12, whiteSpace: 'nowrap' }}>
                          {new Date(p.data_fim).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap' }}>
                            {diffLabel}
                          </span>
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <Link href={`/admin/pedidos/${p.id}`} style={{ fontSize: 12, fontWeight: 700, color: 'var(--admin-text-2)', textDecoration: 'none', padding: '0 12px', minHeight: 36, borderRadius: 6, background: 'var(--admin-surf2)', border: '1px solid var(--admin-border2)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>
                            Ver →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <PaginatorControls
                page={groupPage}
                totalPages={totalPages}
                setPage={(p) => setGroupPage(key, p)}
                total={items.length}
                start={start}
                end={end}
                pageSize={PAGE_SIZE}
                label="contrato"
              />
            </div>
          </section>
        )
      })}

      {rows.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--admin-muted-2)' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>✓</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 4 }}>Nenhum contrato ativo</p>
          <p style={{ fontSize: 13 }}>Contratos ativos aparecerão aqui quando houver locações em andamento.</p>
        </div>
      )}
    </main>
  )
}
