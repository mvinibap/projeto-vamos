import { supabase, type Pedido } from '@/lib/supabase'
import { simularScoreCNPJ } from '@/lib/cnpj'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getPedidos(): Promise<Pedido[]> {
  const { data } = await supabase
    .from('pedidos')
    .select('*, equipamentos(*)')
    .order('created_at', { ascending: false })
  return data ?? []
}

async function getEquipamentoAlocacao() {
  const { data } = await supabase.from('equipamentos').select('status')
  const rows = data ?? []
  const total = rows.length
  const disponivel = rows.filter((e) => e.status === 'disponivel').length
  const reservado   = rows.filter((e) => e.status === 'reservado').length
  const indisponivel = rows.filter((e) => e.status === 'indisponivel').length
  return { total, disponivel, reservado, indisponivel }
}

const RED = '#de1c22'

export default async function AdminDashboard() {
  const [pedidos, alocacao] = await Promise.all([getPedidos(), getEquipamentoAlocacao()])

  const novos = pedidos.filter((p) => p.status === 'novo')
  const ativos = pedidos.filter((p) => p.status === 'ativo').length
  const contratos = pedidos.filter((p) => ['contrato_enviado', 'assinado', 'ativo'].includes(p.status)).length

  const aprovados = pedidos.filter((p) => ['ativo', 'assinado', 'contrato_enviado'].includes(p.status)).length
  const taxaAprovacao = pedidos.length > 0 ? Math.round((aprovados / pedidos.length) * 100) : 0

  const pedidosComValor = pedidos
    .filter((p) => (p as any).equipamentos?.preco_dia)
    .map((p) => {
      const dias = Math.max(1, Math.round(
        (new Date(p.data_fim).getTime() - new Date(p.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
      ))
      return { ...p, valor: ((p as any).equipamentos.preco_dia as number) * dias }
    })

  const ticketMedio = pedidosComValor.length > 0
    ? Math.round(pedidosComValor.reduce((s, p) => s + p.valor, 0) / pedidosComValor.length)
    : null

  const valorAtivo = pedidosComValor
    .filter((p) => p.status === 'ativo')
    .reduce((s, p) => s + p.valor, 0)

  const estadoMap: Record<string, number> = {}
  pedidos.forEach((p) => { estadoMap[p.estado_entrega] = (estadoMap[p.estado_entrega] || 0) + 1 })
  const topEstados = Object.entries(estadoMap).sort(([, a], [, b]) => b - a).slice(0, 5)

  const statusMap: Record<string, number> = {}
  pedidos.forEach((p) => { statusMap[p.status] = (statusMap[p.status] || 0) + 1 })

  // Pedidos em risco (aguardando triagem há mais de 2 dias)
  const hoje = Date.now()
  const pedidosEmRisco = novos.filter((p) => {
    const idadeDias = Math.round((hoje - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
    return idadeDias >= 2
  })

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Page title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: '#475569' }}>Visão geral da operação em tempo real</p>
      </div>

      {/* Alertas de ação rápida */}
      {(novos.length > 0 || pedidosEmRisco.length > 0) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          {novos.length > 0 && (
            <Link href="/admin/triagem" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(222,28,34,0.08)', border: '1px solid rgba(222,28,34,0.25)',
              borderRadius: 10, padding: '12px 16px', textDecoration: 'none',
              flex: '1 1 240px',
            }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#f87171', marginBottom: 2 }}>
                  {novos.length} pedido{novos.length > 1 ? 's' : ''} aguardando triagem
                </p>
                <p style={{ fontSize: 11, color: '#64748b' }}>Clique para abrir a fila →</p>
              </div>
            </Link>
          )}
          {pedidosEmRisco.length > 0 && (
            <Link href="/admin/triagem" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.2)',
              borderRadius: 10, padding: '12px 16px', textDecoration: 'none',
              flex: '1 1 240px',
            }}>
              <span style={{ fontSize: 20 }}>⏳</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#facc15', marginBottom: 2 }}>
                  {pedidosEmRisco.length} aguardando há +2 dias
                </p>
                <p style={{ fontSize: 11, color: '#64748b' }}>Risco de perda de negócio →</p>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <KPI label="Total de pedidos" value={pedidos.length} />
        <KPI label="Aguardando triagem" value={novos.length} highlight={novos.length > 0} />
        <KPI label="Contratos emitidos" value={contratos} />
        <KPI label="Locações ativas" value={ativos} />
      </div>

      {/* Performance */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>
          Análise de Performance
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '20px 24px' }}>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>Taxa de aprovação</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: taxaAprovacao >= 60 ? '#4ade80' : taxaAprovacao >= 30 ? '#facc15' : '#f87171', lineHeight: 1, letterSpacing: '-1px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)' }}>
              {taxaAprovacao}%
            </p>
          </div>
          <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '20px 24px' }}>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>Ticket médio estimado</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: '#f1f5f9', lineHeight: 1, letterSpacing: '-1px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)' }}>
              {ticketMedio ? `R$ ${ticketMedio.toLocaleString('pt-BR')}` : '—'}
            </p>
          </div>
          <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '20px 24px' }}>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>Valor em locação ativa</p>
            <p style={{ fontSize: valorAtivo > 0 ? 28 : 36, fontWeight: 800, color: '#f1f5f9', lineHeight: 1, letterSpacing: '-1px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)' }}>
              {valorAtivo > 0 ? `R$ ${valorAtivo.toLocaleString('pt-BR')}` : '—'}
            </p>
          </div>
        </div>

        <AnalyticsCharts statusMap={statusMap} topEstados={topEstados} alocacao={alocacao} />
      </section>
    </main>
  )
}

function KPI({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div style={{
      borderRadius: 12, padding: '20px 24px',
      border: `1px solid ${highlight ? 'rgba(222,28,34,0.3)' : '#1e293b'}`,
      background: highlight ? 'rgba(222,28,34,0.08)' : '#0f172a',
    }}>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 36, fontWeight: 800, color: highlight ? RED : '#f1f5f9', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>
        {value}
      </p>
    </div>
  )
}
