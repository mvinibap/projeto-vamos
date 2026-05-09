import { supabase, type Pedido } from '@/lib/supabase'
import { simularScoreCNPJ } from '@/lib/cnpj'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getPedidos(): Promise<Pedido[]> {
  const { data } = await supabase
    .from('pedidos')
    .select('*, equipamentos(*)')
    .in('status', ['novo', 'em_analise'])
    .order('created_at', { ascending: true })
  return data ?? []
}

export default async function TriagemPage() {
  const pedidos = await getPedidos()

  const hoje = Date.now()

  const novosRaw = pedidos.filter((p) => p.status === 'novo')
  const emAnalise = pedidos.filter((p) => p.status === 'em_analise')

  const novos = novosRaw.map((p) => {
    const score = simularScoreCNPJ(p.cnpj)
    const eq = (p as any).equipamentos
    const dias = Math.max(1, Math.round(
      (new Date(p.data_fim).getTime() - new Date(p.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
    ))
    const valorEstimado = eq?.preco_dia ? eq.preco_dia * dias : null
    const idadeDias = Math.round((hoje - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
    return { ...p, _score: score, _dias: dias, _valor: valorEstimado, _idade: idadeDias }
  }).sort((a, b) => {
    const order = { aprovado: 0, analise: 1, negado: 2 } as Record<string, number>
    const recDiff = (order[a._score.recomendacao] ?? 1) - (order[b._score.recomendacao] ?? 1)
    if (recDiff !== 0) return recDiff
    return a._idade - b._idade
  })

  const preAprovados = novos.filter(p => p._score.recomendacao === 'aprovado').length
  const analiseManual = novos.filter(p => p._score.recomendacao === 'analise').length
  const negados = novos.filter(p => p._score.recomendacao === 'negado').length

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
          Fila de Triagem
        </h1>
        <p style={{ fontSize: 13, color: '#475569' }}>
          Pedidos aguardando análise e aprovação · Score calculado pelo simulador CNPJ
        </p>
      </div>

      {/* Resumo rápido */}
      {novos.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <SummaryBadge label="Pré-aprovados" value={preAprovados} color="#4ade80" bg="rgba(34,197,94,0.1)" />
          <SummaryBadge label="Análise manual" value={analiseManual} color="#facc15" bg="rgba(234,179,8,0.08)" />
          <SummaryBadge label="Negados" value={negados} color="#f87171" bg="rgba(239,68,68,0.08)" />
          <SummaryBadge label="Em análise" value={emAnalise.length} color="#a78bfa" bg="rgba(167,139,250,0.08)" />
        </div>
      )}

      {/* Novos — triage */}
      {novos.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
            <span style={{ color: '#de1c22' }}>⚡</span> Aguardando análise ({novos.length})
          </h2>
          <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
            {/* Colhead */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 60px 56px 110px 72px auto', padding: '8px 16px', borderBottom: '1px solid #1e293b' }}>
              {['Score', 'Empresa', 'Equipamento', 'Estado', 'Dias', 'Valor est.', 'Aguarda', ''].map((h) => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</span>
              ))}
            </div>
            {novos.map((p, i) => {
              const rec = p._score.recomendacao
              const borderColor = rec === 'aprovado' ? 'rgba(34,197,94,0.5)' : rec === 'analise' ? 'rgba(234,179,8,0.5)' : 'rgba(239,68,68,0.5)'
              const scoreColor = rec === 'aprovado' ? '#4ade80' : rec === 'analise' ? '#facc15' : '#f87171'
              const scoreBg = rec === 'aprovado' ? 'rgba(34,197,94,0.1)' : rec === 'analise' ? 'rgba(234,179,8,0.08)' : 'rgba(239,68,68,0.08)'
              const recLabel = rec === 'aprovado' ? '✓ APROVADO' : rec === 'analise' ? '⚠ ANÁLISE' : '✗ NEGADO'
              const idadeLabel = p._idade === 0 ? 'hoje' : p._idade === 1 ? '1 dia' : `${p._idade} dias`
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 1fr 60px 56px 110px 72px auto',
                    padding: '11px 16px',
                    borderBottom: i < novos.length - 1 ? '1px solid #1e293b' : 'none',
                    borderLeft: `3px solid ${borderColor}`,
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: scoreColor, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', lineHeight: 1, letterSpacing: '-0.5px' }}>
                      {p._score.score.toFixed(1)}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: scoreColor, letterSpacing: '0.5px', background: scoreBg, padding: '1px 5px', borderRadius: 3, display: 'inline-block' }}>
                      {recLabel}
                    </span>
                  </div>
                  <div style={{ minWidth: 0, paddingRight: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome_empresa}</p>
                    <p style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{p.numero_pedido}</p>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
                    {(p as any).equipamentos?.nome ?? '—'}
                  </p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{p.estado_entrega}</p>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{p._dias}d</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: p._valor ? '#f1f5f9' : '#475569' }}>
                    {p._valor ? `R$ ${p._valor.toLocaleString('pt-BR')}` : '—'}
                  </p>
                  <p style={{ fontSize: 11, color: p._idade >= 3 ? '#f87171' : p._idade >= 1 ? '#facc15' : '#64748b' }}>{idadeLabel}</p>
                  <Link
                    href={`/admin/pedidos/${p.id}`}
                    style={{
                      background: rec === 'aprovado' ? 'rgba(34,197,94,0.15)' : rec === 'negado' ? 'rgba(239,68,68,0.12)' : '#1e293b',
                      color: rec === 'aprovado' ? '#4ade80' : rec === 'negado' ? '#f87171' : '#94a3b8',
                      fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 6,
                      textDecoration: 'none', whiteSpace: 'nowrap',
                      border: `1px solid ${rec === 'aprovado' ? 'rgba(34,197,94,0.3)' : rec === 'negado' ? 'rgba(239,68,68,0.25)' : '#334155'}`,
                    }}
                  >
                    Analisar →
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Em análise */}
      {emAnalise.length > 0 && (
        <section>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
            Em análise ({emAnalise.length})
          </h2>
          <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.8px', background: 'rgba(146,64,14,0.15)', padding: '2px 8px', borderRadius: 4 }}>
                Revisão em andamento
              </span>
              <span style={{ fontSize: 11, color: '#475569' }}>Pedidos em revisão pelo operador</span>
            </div>
            {emAnalise.map((p, i) => {
              const eq = (p as any).equipamentos
              const dias = Math.max(1, Math.round(
                (new Date(p.data_fim).getTime() - new Date(p.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
              ))
              const valor = eq?.preco_dia ? eq.preco_dia * dias : null
              const score = simularScoreCNPJ(p.cnpj)
              const scoreColor = score.recomendacao === 'aprovado' ? '#4ade80' : score.recomendacao === 'analise' ? '#facc15' : '#f87171'
              const idadeDias = Math.round((hoje - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
              const idadeLabel = idadeDias === 0 ? 'hoje' : idadeDias === 1 ? '1 dia' : `${idadeDias} dias`
              return (
                <div key={p.id} style={{
                  display: 'grid', gridTemplateColumns: '120px 1fr 1fr 60px 56px 110px 72px auto',
                  padding: '11px 16px', alignItems: 'center',
                  borderBottom: i < emAnalise.length - 1 ? '1px solid #1e293b' : 'none',
                  borderLeft: '3px solid rgba(146,64,14,0.5)',
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: scoreColor, lineHeight: 1, letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)' }}>
                    {score.score.toFixed(1)}
                  </span>
                  <div style={{ minWidth: 0, paddingRight: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome_empresa}</p>
                    <p style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{p.numero_pedido}</p>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>{eq?.nome ?? '—'}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{p.estado_entrega}</p>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{dias}d</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: valor ? '#f1f5f9' : '#475569' }}>
                    {valor ? `R$ ${valor.toLocaleString('pt-BR')}` : '—'}
                  </p>
                  <p style={{ fontSize: 11, color: idadeDias >= 3 ? '#f87171' : '#64748b' }}>{idadeLabel}</p>
                  <Link href={`/admin/pedidos/${p.id}`} style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textDecoration: 'none', padding: '6px 14px', borderRadius: 6, background: '#1e293b', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                    Continuar →
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {novos.length === 0 && emAnalise.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>✓</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Fila vazia</p>
          <p style={{ fontSize: 13 }}>Nenhum pedido aguardando triagem.</p>
        </div>
      )}
    </main>
  )
}

function SummaryBadge({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div style={{ background: bg, border: `1px solid ${color}25`, borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 12, color: '#64748b' }}>{label}</span>
    </div>
  )
}
