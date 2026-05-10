import React from 'react'
import { supabase, type Pedido } from '@/lib/supabase'
import { simularScoreCNPJ } from '@/lib/cnpj'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import KPIChart from '@/components/KPIChart'
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
  const hojeDate = new Date()
  const hojeMs = hojeDate.getTime()
  const hoje = hojeMs
  const pedidosEmRisco = novos.filter((p) => {
    const idadeDias = Math.round((hoje - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
    return idadeDias >= 2
  })

  // Inadimplência: classificar contratos ativos/assinados/contrato_enviado
  const pedidosContrato = pedidos.filter((p) =>
    ['ativo', 'assinado', 'contrato_enviado'].includes(p.status)
  )

  const classifyRisco = (dataFim: string) => {
    const diffDias = Math.round((new Date(dataFim).getTime() - hojeMs) / (1000 * 60 * 60 * 24))
    if (diffDias < 0)  return 'vencido'
    if (diffDias === 0) return 'vence_hoje'
    if (diffDias <= 7) return 'vence_semana'
    return 'ok'
  }

  const vencidos     = pedidosContrato.filter((p) => classifyRisco(p.data_fim) === 'vencido')
  const venceHoje    = pedidosContrato.filter((p) => classifyRisco(p.data_fim) === 'vence_hoje')
  const venceSemana  = pedidosContrato.filter((p) => classifyRisco(p.data_fim) === 'vence_semana')
  const contratoOk   = pedidosContrato.filter((p) => classifyRisco(p.data_fim) === 'ok')

  const totalInadimplencia = vencidos.length + venceHoje.length

  // Valores em risco
  const valorVencido = vencidos.reduce((sum, p) => {
    const eq = (p as any).equipamentos
    const dias = Math.max(1, Math.round(
      (new Date(p.data_fim).getTime() - new Date(p.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
    ))
    return sum + (eq?.preco_dia ? eq.preco_dia * dias : 0)
  }, 0)

  const valorVenceHoje = venceHoje.reduce((sum, p) => {
    const eq = (p as any).equipamentos
    const dias = Math.max(1, Math.round(
      (new Date(p.data_fim).getTime() - new Date(p.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
    ))
    return sum + (eq?.preco_dia ? eq.preco_dia * dias : 0)
  }, 0)

  const totalValorEmRisco = valorVencido + valorVenceHoje

  const hasAlerts = novos.length > 0 || pedidosEmRisco.length > 0 || totalInadimplencia > 0

  return (
    <main style={{ padding: '32px 32px 64px' }}>

      {/* Título */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--admin-text)', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 3 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: 'var(--admin-muted)' }}>Visão geral da operação</p>
      </div>

      {/* ZONA 1 — Alert strip */}
      {hasAlerts && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--admin-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>
            Atenção
          </span>
          {novos.length > 0 && (
            <Link href="/admin/triagem" style={pillStyle('blue')}>
              <span style={dotStyle} />
              {novos.length} pedido{novos.length > 1 ? 's' : ''} aguardando triagem →
            </Link>
          )}
          {venceHoje.length > 0 && (
            <Link href="/admin/inadimplencia" style={pillStyle('orange')}>
              <span style={dotStyle} />
              {venceHoje.length} contrato{venceHoje.length > 1 ? 's' : ''} vence hoje →
            </Link>
          )}
          {vencidos.length > 0 && (
            <Link href="/admin/inadimplencia" style={pillStyle('red')}>
              <span style={dotStyle} />
              {vencidos.length} contrato{vencidos.length > 1 ? 's' : ''} vencido{vencidos.length > 1 ? 's' : ''} →
            </Link>
          )}
          {pedidosEmRisco.length > 0 && (
            <Link href="/admin/triagem" style={pillStyle('yellow')}>
              <span style={dotStyle} />
              {pedidosEmRisco.length} aguardando há +2 dias →
            </Link>
          )}
        </div>
      )}

      {/* Performance */}
      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--admin-border2)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
        Performance
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        <div className="animate-fade-up" style={{ background: 'var(--admin-surface)', borderRadius: 12, border: '1px solid var(--admin-surf2)', padding: '18px 20px', animationDelay: '0ms' }}>
          <p style={{ fontSize: 11, color: 'var(--admin-muted)', marginBottom: 8, fontWeight: 500 }}>Taxa de aprovação</p>
          <p style={{ fontSize: 30, fontWeight: 800, color: taxaAprovacao >= 60 ? '#4ade80' : taxaAprovacao >= 30 ? '#facc15' : '#f87171', lineHeight: 1, letterSpacing: '-1px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', fontVariantNumeric: 'tabular-nums' }}>
            {taxaAprovacao}%
          </p>
        </div>
        <div className="animate-fade-up" style={{ background: 'var(--admin-surface)', borderRadius: 12, border: '1px solid var(--admin-surf2)', padding: '18px 20px', animationDelay: '80ms' }}>
          <p style={{ fontSize: 11, color: 'var(--admin-muted)', marginBottom: 8, fontWeight: 500 }}>Ticket médio estimado</p>
          <p style={{ fontSize: 30, fontWeight: 800, color: 'var(--admin-text)', lineHeight: 1, letterSpacing: '-1px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', fontVariantNumeric: 'tabular-nums' }}>
            {ticketMedio ? `R$ ${ticketMedio.toLocaleString('pt-BR')}` : '—'}
          </p>
        </div>
        <div className="animate-fade-up" style={{ background: 'var(--admin-surface)', borderRadius: 12, border: '1px solid var(--admin-surf2)', padding: '18px 20px', animationDelay: '160ms' }}>
          <p style={{ fontSize: 11, color: 'var(--admin-muted)', marginBottom: 8, fontWeight: 500 }}>Valor em locação ativa</p>
          <p style={{ fontSize: 30, fontWeight: 800, color: 'var(--admin-text)', lineHeight: 1, letterSpacing: '-1px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', fontVariantNumeric: 'tabular-nums' }}>
            {valorAtivo > 0 ? `R$ ${valorAtivo.toLocaleString('pt-BR')}` : '—'}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--admin-surf2)', marginBottom: 28 }} />

      {/* KPI Charts lado a lado */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
        <KPIChart
          title="Visão geral de pedidos"
          items={[
            { label: 'Aguardando triagem', color: 'var(--admin-muted)', value: statusMap['novo']             ?? 0 },
            { label: 'Em análise',         color: '#fb923c', value: statusMap['em_analise']       ?? 0 },
            { label: 'Contrato enviado',   color: '#e85a5e', value: statusMap['contrato_enviado'] ?? 0 },
            { label: 'Assinado',           color: '#de1c22', value: statusMap['assinado']         ?? 0 },
            { label: 'Ativo',              color: '#4ade80', value: statusMap['ativo']            ?? 0 },
            { label: 'Rejeitado',          color: 'var(--admin-surf2)', value: statusMap['rejeitado']        ?? 0 },
          ]}
          footer={`${pedidos.length} pedidos no total`}
        />
        <KPIChart
          title="Saúde dos contratos ativos"
          items={[
            { label: 'Vencidos',         color: '#f87171', value: vencidos.length },
            { label: 'Vence hoje',       color: '#fb923c', value: venceHoje.length },
            { label: 'Vence em 7 dias',  color: '#facc15', value: venceSemana.length },
            { label: 'Em dia',           color: '#15803d', value: contratoOk.length },
          ]}
          footer={`${pedidosContrato.length} contratos ativos`}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--admin-surf2)', marginBottom: 28 }} />

      {/* Análise operacional */}
      <AnalyticsCharts statusMap={statusMap} topEstados={topEstados} alocacao={alocacao} />

    </main>
  )
}



const pillStyle = (color: 'red' | 'orange' | 'yellow' | 'blue'): React.CSSProperties => {
  const map = {
    blue:   { background: 'rgba(96,165,250,0.09)',  border: '1px solid rgba(96,165,250,0.28)',  color: '#60a5fa' },
    red:    { background: 'rgba(222,28,34,0.1)',    border: '1px solid rgba(222,28,34,0.3)',    color: '#f87171' },
    orange: { background: 'rgba(251,146,60,0.08)',  border: '1px solid rgba(251,146,60,0.25)', color: '#fb923c' },
    yellow: { background: 'rgba(250,204,21,0.07)',  border: '1px solid rgba(250,204,21,0.2)',  color: '#facc15' },
  }
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 10px 5px 8px', borderRadius: 6,
    fontSize: 12, fontWeight: 600, textDecoration: 'none',
    ...map[color],
  }
}

const dotStyle: React.CSSProperties = {
  width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0,
}
