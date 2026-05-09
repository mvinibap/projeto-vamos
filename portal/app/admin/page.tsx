import Link from 'next/link'
import { supabase, type Pedido } from '@/lib/supabase'

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

const RED = '#de1c22'

export default async function AdminPage() {
  const pedidos = await getPedidos()

  const novos = pedidos.filter((p) => p.status === 'novo')
  const ativos = pedidos.filter((p) => p.status === 'ativo').length
  const contratos = pedidos.filter((p) => ['contrato_enviado', 'assinado', 'ativo'].includes(p.status)).length

  // ── Analytics ────────────────────────────────────────────────────────────
  const aprovados = pedidos.filter((p) => ['ativo', 'assinado', 'contrato_enviado'].includes(p.status)).length
  const taxaAprovacao = pedidos.length > 0 ? Math.round((aprovados / pedidos.length) * 100) : 0

  const pedidosComValor = pedidos
    .filter((p) => (p as any).equipamentos?.preco_dia)
    .map((p) => {
      const dias = Math.max(1, Math.round(
        (new Date(p.data_fim).getTime() - new Date(p.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
      ))
      const valor = ((p as any).equipamentos.preco_dia as number) * dias
      return { ...p, valor }
    })

  const ticketMedio = pedidosComValor.length > 0
    ? Math.round(pedidosComValor.reduce((s, p) => s + p.valor, 0) / pedidosComValor.length)
    : null

  const valorAtivo = pedidosComValor
    .filter((p) => p.status === 'ativo')
    .reduce((s, p) => s + p.valor, 0)

  // Top estados por volume
  const estadoMap: Record<string, number> = {}
  pedidos.forEach((p) => { estadoMap[p.estado_entrega] = (estadoMap[p.estado_entrega] || 0) + 1 })
  const topEstados = Object.entries(estadoMap).sort(([, a], [, b]) => b - a).slice(0, 5)

  // Funil de status
  const statusMap: Record<string, number> = {}
  pedidos.forEach((p) => { statusMap[p.status] = (statusMap[p.status] || 0) + 1 })
  const maxStatusN = Math.max(...Object.values(statusMap), 1)

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#fff', fontFamily: 'var(--font-sans, DM Sans, sans-serif)' }}>
      {/* Header */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="font-display" style={{ background: RED, color: '#fff', fontWeight: 800, fontSize: 14, padding: '5px 8px', borderRadius: 4, lineHeight: 1, letterSpacing: '-0.3px' }}>
            VAMOS
          </span>
          <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>Painel Operacional</span>
        </div>
        <Link href="/" className="home-header-right" style={{ fontSize: 13, color: '#475569', textDecoration: 'none', fontWeight: 500 }}>
          ← Portal do Cliente
        </Link>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* KPIs */}
        <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          <KPI label="Total de pedidos" value={pedidos.length} />
          <KPI label="Aguardando análise" value={novos.length} highlight />
          <KPI label="Contratos emitidos" value={contratos} />
          <KPI label="Locações ativas" value={ativos} />
        </div>

        {/* Analytics de Performance */}
        {pedidos.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
              Análise de Performance
            </h2>
            <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              {/* Taxa de aprovação */}
              <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '20px 24px' }}>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>Taxa de aprovação</p>
                <p className="font-display" style={{ fontSize: 36, fontWeight: 800, color: taxaAprovacao >= 60 ? '#4ade80' : taxaAprovacao >= 30 ? '#facc15' : '#f87171', lineHeight: 1, letterSpacing: '-1px' }}>
                  {taxaAprovacao}%
                </p>
              </div>
              {/* Ticket médio */}
              <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '20px 24px' }}>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>Ticket médio estimado</p>
                <p className="font-display" style={{ fontSize: 36, fontWeight: 800, color: '#f1f5f9', lineHeight: 1, letterSpacing: '-1px' }}>
                  {ticketMedio ? `R$ ${ticketMedio.toLocaleString('pt-BR')}` : '—'}
                </p>
              </div>
              {/* Valor em locação ativa */}
              <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '20px 24px' }}>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>Valor em locação ativa</p>
                <p className="font-display" style={{ fontSize: valorAtivo > 0 ? 28 : 36, fontWeight: 800, color: '#f1f5f9', lineHeight: 1, letterSpacing: '-1px' }}>
                  {valorAtivo > 0 ? `R$ ${valorAtivo.toLocaleString('pt-BR')}` : '—'}
                </p>
              </div>
            </div>

            {/* Distribuição geográfica + Funil de status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Top estados */}
              <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '20px 24px' }}>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Top estados (pedidos)
                </p>
                {topEstados.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {topEstados.map(([estado, count]) => (
                      <div key={estado} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', width: 28, flexShrink: 0 }}>{estado}</span>
                        <div style={{ flex: 1, background: '#1e293b', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.round((count / (topEstados[0]?.[1] ?? 1)) * 100)}%`, height: '100%', background: RED, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#64748b', width: 20, textAlign: 'right', flexShrink: 0 }}>{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: '#475569' }}>Sem dados</p>
                )}
              </div>

              {/* Funil de status */}
              <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '20px 24px' }}>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Funil de status
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
                    const count = statusMap[status] ?? 0
                    if (count === 0) return null
                    return (
                      <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, color: '#64748b', width: 90, flexShrink: 0 }}>{cfg.label}</span>
                        <div style={{ flex: 1, background: '#1e293b', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.round((count / maxStatusN) * 100)}%`, height: '100%', background: cfg.bg, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#64748b', width: 20, textAlign: 'right', flexShrink: 0 }}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Fila: pedidos novos */}
        {novos.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
              <span style={{ color: RED }}>⚡</span> Aguardando análise ({novos.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {novos.map((p) => (
                <PedidoRow key={p.id} pedido={p} destaque />
              ))}
            </div>
          </section>
        )}

        {/* Todos os pedidos */}
        <section>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
            Todos os pedidos
          </h2>

          {/* Tabela — desktop */}
          <div className="admin-table-wrap" style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e293b' }}>
                  {['Pedido', 'Empresa', 'Equipamento', 'Período', 'Status', 'Data', ''].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
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
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#94a3b8' }}>{p.numero_pedido}</td>
                      <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 500 }}>{p.nome_empresa}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{(p as any).equipamentos?.nome ?? '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>
                        {new Date(p.data_inicio).toLocaleDateString('pt-BR')} – {new Date(p.data_fim).toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569', fontSize: 12 }}>
                        {new Date(p.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Link href={`/admin/pedidos/${p.id}`} style={{ color: '#f1f5f9', textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>
                          Analisar →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {pedidos.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: '#475569' }}>
                      Nenhum pedido ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="admin-cards" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
            {pedidos.map((p) => {
              const st = STATUS_CONFIG[p.status]
              return (
                <Link key={p.id} href={`/admin/pedidos/${p.id}`} style={{ textDecoration: 'none', display: 'block', background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome_empresa}</p>
                      <p style={{ fontSize: 12, color: '#64748b' }}>{(p as any).equipamentos?.nome ?? '—'}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: st.bg, color: st.color, flexShrink: 0 }}>
                      {st.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{p.numero_pedido}</span>
                      <span style={{ fontSize: 11, color: '#475569' }}>
                        {new Date(p.data_inicio).toLocaleDateString('pt-BR')} – {new Date(p.data_fim).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>Analisar →</span>
                  </div>
                </Link>
              )
            })}
            {pedidos.length === 0 && (
              <p style={{ textAlign: 'center', padding: '48px 0', color: '#475569' }}>Nenhum pedido ainda.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function KPI({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div style={{
      borderRadius: 12,
      padding: '20px 24px',
      border: `1px solid ${highlight ? 'rgba(222,28,34,0.3)' : '#1e293b'}`,
      background: highlight ? 'rgba(222,28,34,0.08)' : '#0f172a',
    }}>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 36, fontWeight: 800, color: highlight ? '#de1c22' : '#f1f5f9', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>
        {value}
      </p>
    </div>
  )
}

function PedidoRow({ pedido: p, destaque }: { pedido: Pedido; destaque?: boolean }) {
  return (
    <div className="pedido-row" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px', borderRadius: 10,
      border: `1px solid ${destaque ? 'rgba(222,28,34,0.25)' : '#1e293b'}`,
      background: destaque ? 'rgba(222,28,34,0.05)' : '#0f172a',
    }}>
      <div>
        <p style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 2 }}>{p.nome_empresa}</p>
        <p style={{ fontSize: 12, color: '#64748b' }}>
          {(p as any).equipamentos?.nome ?? '—'} · {p.numero_pedido}
        </p>
      </div>
      <Link
        href={`/admin/pedidos/${p.id}`}
        className="pedido-row-btn"
        style={{ background: '#de1c22', color: '#fff', fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 8, textDecoration: 'none', flexShrink: 0 }}
      >
        Analisar
      </Link>
    </div>
  )
}
