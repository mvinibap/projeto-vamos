import { supabase, type Pedido } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getPedidos(): Promise<Pedido[]> {
  const { data } = await supabase
    .from('pedidos')
    .select('*, equipamentos(*)')
    .order('created_at', { ascending: false })
  return data ?? []
}

const STATUS_CONFIG: Record<Pedido['status'], { label: string; bg: string; color: string }> = {
  novo:              { label: 'Novo',              bg: '#1d4ed8', color: '#fff' },
  em_analise:        { label: 'Em análise',        bg: '#92400e', color: '#fff' },
  contrato_enviado:  { label: 'Contrato enviado',  bg: '#6d28d9', color: '#fff' },
  assinado:          { label: 'Assinado',          bg: '#3730a3', color: '#fff' },
  ativo:             { label: 'Ativo',             bg: '#15803d', color: '#fff' },
  rejeitado:         { label: 'Rejeitado',         bg: '#991b1b', color: '#fff' },
}

const STATUS_ORDER = ['novo', 'em_analise', 'contrato_enviado', 'assinado', 'ativo', 'rejeitado'] as const

export default async function PedidosPage() {
  const pedidos = await getPedidos()

  // Count by status for summary row
  const counts: Record<string, number> = {}
  pedidos.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1 })

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
            Todos os Pedidos
          </h1>
          <p style={{ fontSize: 13, color: '#475569' }}>
            {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} no total
          </p>
        </div>
      </div>

      {/* Status summary pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {STATUS_ORDER.filter(s => counts[s] > 0).map((s) => {
          const cfg = STATUS_CONFIG[s]
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '6px 12px' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: cfg.bg, flexShrink: 0, display: 'block' }} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{cfg.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{counts[s]}</span>
            </div>
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
            {pedidos.map((p) => {
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
                      {(p as any).equipamentos?.nome ?? '—'}
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
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '60px 16px', textAlign: 'center', color: '#475569' }}>
                  Nenhum pedido ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
