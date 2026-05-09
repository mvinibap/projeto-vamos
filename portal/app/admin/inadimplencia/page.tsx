import { supabase, type Pedido } from '@/lib/supabase'
import { simularScoreCNPJ } from '@/lib/cnpj'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getPedidos(): Promise<Pedido[]> {
  const { data } = await supabase
    .from('pedidos')
    .select('*, equipamentos(*)')
    .in('status', ['ativo', 'assinado', 'contrato_enviado'])
    .order('data_fim', { ascending: true })
  return data ?? []
}

export default async function InadimplenciaPage() {
  const pedidos = await getPedidos()
  const hoje = new Date()
  const hojeMs = hoje.getTime()

  type RiskLevel = 'vencido' | 'vence_hoje' | 'vence_semana' | 'ok'

  // Classificar cada pedido por risco de inadimplência
  const enriched = pedidos.map((p) => {
    const dataFim = new Date(p.data_fim)
    const diffMs = dataFim.getTime() - hojeMs
    const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24))
    const score = simularScoreCNPJ(p.cnpj)

    let risco: RiskLevel = 'ok'
    if (diffDias < 0) risco = 'vencido'
    else if (diffDias === 0) risco = 'vence_hoje'
    else if (diffDias <= 7) risco = 'vence_semana'
    else risco = 'ok'

    const eq = (p as any).equipamentos
    const dias = Math.max(1, Math.round(
      (dataFim.getTime() - new Date(p.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
    ))
    const valor = eq?.preco_dia ? eq.preco_dia * dias : null

    return { ...p, _risco: risco, _diffDias: diffDias, _score: score, _valor: valor }
  }).sort((a, b) => a._diffDias - b._diffDias)

  const vencidos = enriched.filter(p => p._risco === 'vencido')
  const venceHoje = enriched.filter(p => p._risco === 'vence_hoje')
  const venceSemana = enriched.filter(p => p._risco === 'vence_semana')
  const okList = enriched.filter(p => p._risco === 'ok')

  const RISCO_CFG = {
    vencido:       { label: 'Vencido',        color: '#f87171', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)' },
    vence_hoje:    { label: 'Vence hoje',      color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)' },
    vence_semana:  { label: 'Vence em breve',  color: '#facc15', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.25)' },
    ok:            { label: 'Em dia',          color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
  }

  const groups: { key: RiskLevel; items: typeof enriched; title: string; subtitle: string }[] = [
    { key: 'vencido', items: vencidos, title: '🚨 Contratos vencidos', subtitle: 'Equipamentos ainda em uso após término do contrato' },
    { key: 'vence_hoje', items: venceHoje, title: '⚠️ Vencem hoje', subtitle: 'Entrar em contato para renovação ou devolução' },
    { key: 'vence_semana', items: venceSemana, title: '📅 Vencem em até 7 dias', subtitle: 'Prospectar renovação proativamente' },
    { key: 'ok', items: okList, title: 'Em dia', subtitle: 'Contratos ativos sem risco imediato' },
  ]

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
          Inadimplência & Vencimentos
        </h1>
        <p style={{ fontSize: 13, color: '#475569' }}>
          Contratos ativos ordenados por data de vencimento
        </p>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <div style={{ background: vencidos.length > 0 ? 'rgba(239,68,68,0.08)' : '#0f172a', borderRadius: 12, border: `1px solid ${vencidos.length > 0 ? 'rgba(239,68,68,0.3)' : '#1e293b'}`, padding: '18px 22px' }}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Contratos vencidos</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: vencidos.length > 0 ? '#f87171' : '#f1f5f9', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>{vencidos.length}</p>
        </div>
        <div style={{ background: venceHoje.length > 0 ? 'rgba(251,146,60,0.06)' : '#0f172a', borderRadius: 12, border: `1px solid ${venceHoje.length > 0 ? 'rgba(251,146,60,0.25)' : '#1e293b'}`, padding: '18px 22px' }}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Vencem hoje</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: venceHoje.length > 0 ? '#fb923c' : '#f1f5f9', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>{venceHoje.length}</p>
        </div>
        <div style={{ background: venceSemana.length > 0 ? 'rgba(234,179,8,0.06)' : '#0f172a', borderRadius: 12, border: `1px solid ${venceSemana.length > 0 ? 'rgba(234,179,8,0.2)' : '#1e293b'}`, padding: '18px 22px' }}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Vencem em 7 dias</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: venceSemana.length > 0 ? '#facc15' : '#f1f5f9', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>{venceSemana.length}</p>
        </div>
        <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '18px 22px' }}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Total em aberto</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>{pedidos.length}</p>
        </div>
      </div>

      {/* Groups */}
      {groups.filter(g => g.items.length > 0).map((group) => {
        const cfg = RISCO_CFG[group.key]
        return (
          <section key={group.key} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>
                {group.title}
              </h2>
              <span style={{ fontSize: 11, color: '#475569' }}>{group.subtitle}</span>
            </div>

            <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e293b' }}>
                    {['Empresa', 'Equipamento', 'Score CNPJ', 'Valor', 'Término', 'Situação', ''].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 16px', fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((p, i) => {
                    const scoreColor = p._score.recomendacao === 'aprovado' ? '#4ade80' : p._score.recomendacao === 'analise' ? '#facc15' : '#f87171'
                    const diffLabel = p._diffDias < 0
                      ? `${Math.abs(p._diffDias)} dias atraso`
                      : p._diffDias === 0 ? 'Hoje'
                      : `${p._diffDias} dias`
                    return (
                      <tr key={p.id} style={{ borderBottom: i < group.items.length - 1 ? '1px solid #1e293b' : 'none', borderLeft: `3px solid ${cfg.color}40` }}>
                        <td style={{ padding: '11px 16px', color: '#e2e8f0', fontWeight: 500 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: 180 }}>
                            {p.nome_empresa}
                          </span>
                          <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{p.numero_pedido}</span>
                        </td>
                        <td style={{ padding: '11px 16px', color: '#64748b', fontSize: 12, maxWidth: 160 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {(p as any).equipamentos?.nome ?? '—'}
                          </span>
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: scoreColor, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)' }}>
                            {p._score.score.toFixed(1)}
                          </span>
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

      {pedidos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>✓</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Nenhum contrato ativo</p>
          <p style={{ fontSize: 13 }}>Contratos ativos aparecerão aqui quando houver locações em andamento.</p>
        </div>
      )}
    </main>
  )
}
