'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FilterBadge } from '@/components/FilterBadge'
import { usePagination, PaginatorControls } from '@/components/Paginator'

type PedidoStatus = 'novo' | 'em_analise' | 'contrato_enviado' | 'assinado' | 'ativo' | 'rejeitado'

export type PedidoRow = {
  id: string
  numero_pedido: string
  nome_empresa: string
  estado_entrega: string
  data_inicio: string
  data_fim: string
  created_at: string
  status: PedidoStatus
  equipamento_nome: string | null
}

const STATUS_CONFIG: Record<PedidoStatus, { label: string; pillBg: string; pillColor: string; filterColor: string; filterBg: string }> = {
  novo:             { label: 'Novo',             pillBg: '#1d4ed8', pillColor: '#fff', filterColor: '#60a5fa', filterBg: 'rgba(29,78,216,0.1)'   },
  em_analise:       { label: 'Em análise',       pillBg: '#92400e', pillColor: '#fff', filterColor: '#fb923c', filterBg: 'rgba(146,64,14,0.1)'   },
  contrato_enviado: { label: 'Contrato enviado', pillBg: '#6d28d9', pillColor: '#fff', filterColor: '#c084fc', filterBg: 'rgba(109,40,217,0.1)'  },
  assinado:         { label: 'Assinado',         pillBg: '#3730a3', pillColor: '#fff', filterColor: '#818cf8', filterBg: 'rgba(55,48,163,0.1)'   },
  ativo:            { label: 'Ativo',            pillBg: '#15803d', pillColor: '#fff', filterColor: '#4ade80', filterBg: 'rgba(21,128,61,0.1)'   },
  rejeitado:        { label: 'Rejeitado',        pillBg: '#991b1b', pillColor: '#fff', filterColor: '#f87171', filterBg: 'rgba(153,27,27,0.1)'   },
}

const STATUS_ORDER: PedidoStatus[] = ['novo', 'em_analise', 'contrato_enviado', 'assinado', 'ativo', 'rejeitado']

export default function PedidosClient({ pedidos }: { pedidos: PedidoRow[] }) {
  const [filtro, setFiltro] = useState<PedidoStatus | null>(null)

  const counts: Partial<Record<PedidoStatus, number>> = {}
  pedidos.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1 })

  const filtered = filtro ? pedidos.filter((p) => p.status === filtro) : pedidos
  const pagination = usePagination(filtered, 50)
  const visiveis = pagination.visible

  const toggle = (s: PedidoStatus) => {
    setFiltro((prev) => (prev === s ? null : s))
    pagination.setPage(1)
  }

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--admin-text)', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
            Todos os Pedidos
          </h1>
          <p style={{ fontSize: 14, color: 'var(--admin-text-2)' }}>
            {filtro
              ? <>{filtered.length} pedido{filtered.length !== 1 ? 's' : ''} · filtrando por <strong style={{ color: '#cbd5e1' }}>{STATUS_CONFIG[filtro].label}</strong></>
              : <>{pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} no total</>
            }
            {filtro && (
              <button
                onClick={() => setFiltro(null)}
                style={{ marginLeft: 10, fontSize: 11, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Limpar filtro
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {STATUS_ORDER.filter((s) => counts[s] && counts[s]! > 0).map((s) => {
          const cfg = STATUS_CONFIG[s]
          return (
            <FilterBadge
              key={s}
              label={cfg.label}
              value={counts[s]!}
              color={cfg.filterColor}
              bg={cfg.filterBg}
              active={filtro === s}
              onClick={() => toggle(s)}
            />
          )
        })}
      </div>

      {/* Tabela */}
      <div style={{ background: 'var(--admin-surface)', borderRadius: 12, border: '1px solid var(--admin-surf2)', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 880, fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--admin-surf2)' }}>
              {['Pedido', 'Empresa', 'Equipamento', 'Estado', 'Período', 'Status', 'Data', ''].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--admin-muted-2)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiveis.map((p) => {
              const st = STATUS_CONFIG[p.status]
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--admin-surf2)' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--admin-text-2)', whiteSpace: 'nowrap' }}>
                    {p.numero_pedido}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 500, maxWidth: 180 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {p.nome_empresa}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--admin-muted)', maxWidth: 160 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {p.equipamento_nome ?? '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--admin-text-2)', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {p.estado_entrega}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--admin-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(p.data_inicio).toLocaleDateString('pt-BR')} – {new Date(p.data_fim).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: st.pillBg, color: st.pillColor }}>
                      {st.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--admin-muted-2)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(p.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/pedidos/${p.id}`} style={{ color: 'var(--admin-text-2)', textDecoration: 'none', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', padding: '0 12px', minHeight: 36, borderRadius: 6, background: 'var(--admin-surf2)', border: '1px solid var(--admin-border2)', display: 'inline-flex', alignItems: 'center' }}>
                      Ver →
                    </Link>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '60px 16px', textAlign: 'center', color: 'var(--admin-muted-2)' }}>
                  {filtro ? (
                    <>
                      Nenhum pedido com status <strong>{STATUS_CONFIG[filtro].label}</strong>.{' '}
                      <button onClick={() => setFiltro(null)} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>
                        Ver todos
                      </button>
                    </>
                  ) : 'Nenhum pedido ainda.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginatorControls {...pagination} label="pedido" />
      </div>
    </main>
  )
}
