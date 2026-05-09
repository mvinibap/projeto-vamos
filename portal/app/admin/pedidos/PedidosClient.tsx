'use client'

import { useState } from 'react'
import Link from 'next/link'

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

const STATUS_CONFIG: Record<PedidoStatus, { label: string; bg: string; color: string; pill: string }> = {
  novo:             { label: 'Novo',             bg: '#1d4ed8', color: '#fff', pill: 'rgba(29,78,216,0.15)' },
  em_analise:       { label: 'Em análise',       bg: '#92400e', color: '#fff', pill: 'rgba(146,64,14,0.15)' },
  contrato_enviado: { label: 'Contrato enviado', bg: '#6d28d9', color: '#fff', pill: 'rgba(109,40,217,0.15)' },
  assinado:         { label: 'Assinado',         bg: '#3730a3', color: '#fff', pill: 'rgba(55,48,163,0.15)' },
  ativo:            { label: 'Ativo',            bg: '#15803d', color: '#fff', pill: 'rgba(21,128,61,0.15)'  },
  rejeitado:        { label: 'Rejeitado',        bg: '#991b1b', color: '#fff', pill: 'rgba(153,27,27,0.15)' },
}

const STATUS_ORDER: PedidoStatus[] = ['novo', 'em_analise', 'contrato_enviado', 'assinado', 'ativo', 'rejeitado']

export default function PedidosClient({ pedidos }: { pedidos: PedidoRow[] }) {
  const [filtro, setFiltro] = useState<PedidoStatus | null>(null)

  const counts: Partial<Record<PedidoStatus, number>> = {}
  pedidos.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1 })

  const toggle = (s: PedidoStatus) => setFiltro((prev) => (prev === s ? null : s))

  const visiveis = filtro ? pedidos.filter((p) => p.status === filtro) : pedidos

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
            Todos os Pedidos
          </h1>
          <p style={{ fontSize: 13, color: '#475569' }}>
            {filtro
              ? <>{visiveis.length} pedido{visiveis.length !== 1 ? 's' : ''} · filtrando por <strong style={{ color: '#cbd5e1' }}>{STATUS_CONFIG[filtro].label}</strong></>
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

      {/* Status pills — clicáveis */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {STATUS_ORDER.filter((s) => counts[s] && counts[s]! > 0).map((s) => {
          const cfg = STATUS_CONFIG[s]
          const active = filtro === s
          return (
            <button
              key={s}
              onClick={() => toggle(s)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: active ? cfg.pill : '#0f172a',
                border: `1px solid ${active ? cfg.bg : '#1e293b'}`,
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: active ? `0 0 0 1px ${cfg.bg}60` : 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 2, background: cfg.bg, flexShrink: 0, display: 'block' }} />
              <span style={{ fontSize: 12, color: active ? '#e2e8f0' : '#94a3b8' }}>{cfg.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#f8fafc' : '#f1f5f9' }}>{counts[s]}</span>
              {active && <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 2 }}>✕</span>}
            </button>
          )
        })}
      </div>

      {/* Tabela */}
      <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              {['Pedido', 'Empresa', 'Equipamento', 'Estado', 'Período', 'Status', 'Data', ''].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiveis.map((p) => {
              const st = STATUS_CONFIG[p.status]
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {p.numero_pedido}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 500, maxWidth: 180 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {p.nome_empresa}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', maxWidth: 160 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {p.equipamento_nome ?? '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {p.estado_entrega}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(p.data_inicio).toLocaleDateString('pt-BR')} – {new Date(p.data_fim).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(p.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/pedidos/${p.id}`} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                      Ver →
                    </Link>
                  </td>
                </tr>
              )
            })}
            {visiveis.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '60px 16px', textAlign: 'center', color: '#475569' }}>
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
      </div>
    </main>
  )
}
