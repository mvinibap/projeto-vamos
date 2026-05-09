import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase, type Pedido } from '@/lib/supabase'
import { simularScoreCNPJ } from '@/lib/cnpj'
import AprovarRejeitarButtons from './AprovarRejeitarButtons'

export const dynamic = 'force-dynamic'

async function getPedido(id: string): Promise<Pedido | null> {
  const { data } = await supabase
    .from('pedidos')
    .select('*, equipamentos(*)')
    .eq('id', id)
    .single()
  return data
}

const RED = '#de1c22'

export default async function AnalisePedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pedido = await getPedido(id)
  if (!pedido) notFound()

  // Sempre re-rodar simularScoreCNPJ para garantir campos completos (porte, regime, setor, etc.)
  const score = simularScoreCNPJ(pedido.cnpj)
  const eq = pedido.equipamentos
  const dias = Math.round(
    (new Date(pedido.data_fim).getTime() - new Date(pedido.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
  )
  const valorEstimado = eq?.preco_dia ? eq.preco_dia * dias : null

  const scoreColor = score.score >= 7 ? '#4ade80' : score.score >= 5 ? '#facc15' : '#f87171'
  const scoreBorder = score.score >= 7 ? 'rgba(34,197,94,0.25)' : score.score >= 5 ? 'rgba(234,179,8,0.25)' : 'rgba(239,68,68,0.25)'
  const scoreBg = score.score >= 7 ? 'rgba(34,197,94,0.05)' : score.score >= 5 ? 'rgba(234,179,8,0.05)' : 'rgba(239,68,68,0.05)'

  const podeAprovar = ['novo', 'em_analise'].includes(pedido.status)
  const jaProcessado = !['novo', 'em_analise'].includes(pedido.status)

  return (
    <div>
      <main style={{ maxWidth: 1024, margin: '0 auto', padding: '32px 32px 64px' }}>
        {/* Back link + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <Link href="/admin/triagem" style={{ fontSize: 13, color: '#475569', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            ← Triagem
          </Link>
          <span style={{ color: '#1e293b' }}>|</span>
          <Link href="/admin/pedidos" style={{ fontSize: 13, color: '#475569', textDecoration: 'none', fontWeight: 500 }}>
            Pedidos
          </Link>
          <span style={{ color: '#1e293b' }}>/</span>
          <span style={{ fontSize: 13, color: '#64748b', fontFamily: 'monospace' }}>{pedido.numero_pedido}</span>
        </div>
        {/* Status atual */}
        {jaProcessado && (
          <div style={{
            borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, fontWeight: 600,
            border: `1px solid ${pedido.status === 'rejeitado' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
            background: pedido.status === 'rejeitado' ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
            color: pedido.status === 'rejeitado' ? '#f87171' : '#4ade80',
          }}>
            Pedido {pedido.status === 'rejeitado' ? 'rejeitado' : `em status: ${pedido.status.replace('_', ' ')}`}
            {pedido.motivo_rejeicao && ` — Motivo: ${pedido.motivo_rejeicao}`}
          </div>
        )}

        <div className="pedido-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* Coluna principal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Dados do pedido */}
            <section style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                📋 Dados do Pedido
                <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginLeft: 'auto' }}>{pedido.numero_pedido}</span>
              </h2>
              <dl className="pedido-dl" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Dado label="Empresa" value={pedido.nome_empresa} />
                <Dado label="CNPJ" value={pedido.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')} />
                <Dado label="Responsável" value={pedido.nome_responsavel} />
                <Dado label="Telefone" value={pedido.telefone} />
                <Dado label="E-mail" value={pedido.email} span />
                <Dado label="Local de entrega" value={`${pedido.cidade_entrega} — ${pedido.estado_entrega}`} span />
              </dl>
            </section>

            {/* Equipamento e período */}
            {eq && (
              <section style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: 24 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 20 }}>🏗️ Equipamento Solicitado</h2>
                <dl className="pedido-dl" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Dado label="Equipamento" value={eq.nome} span />
                  <Dado label="Categoria" value={eq.categoria} />
                  <Dado label="Localização atual" value={eq.estado} />
                  <Dado label="Período" value={`${new Date(pedido.data_inicio).toLocaleDateString('pt-BR')} a ${new Date(pedido.data_fim).toLocaleDateString('pt-BR')}`} />
                  <Dado label="Duração" value={`${dias} dias`} />
                  {valorEstimado && (
                    <Dado label="Valor estimado" value={`R$ ${valorEstimado.toLocaleString('pt-BR')}`} highlight />
                  )}
                </dl>
              </section>
            )}
          </div>

          {/* Score CNPJ + Ações */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <section style={{ borderRadius: 12, border: `1px solid ${scoreBorder}`, background: scoreBg, padding: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 16 }}>📊 Análise de Crédito</h2>

              {/* Badge de recomendação automática */}
              {(() => {
                const rec = score.recomendacao
                const recConfig = {
                  aprovado: { label: '✓ CRÉDITO PRÉ-APROVADO', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)', color: '#4ade80' },
                  analise:  { label: '⚠ ANÁLISE MANUAL NECESSÁRIA', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.35)', color: '#facc15' },
                  negado:   { label: '✗ CRÉDITO NEGADO AUTOMATICAMENTE', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.35)', color: '#f87171' },
                }[rec]
                return (
                  <div style={{ borderRadius: 8, border: `1px solid ${recConfig.border}`, background: recConfig.bg, padding: '10px 14px', marginBottom: 20 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: recConfig.color, letterSpacing: '0.5px' }}>{recConfig.label}</p>
                    {rec === 'aprovado' && (
                      <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                        Limite sugerido: R$ {score.limite_credito.toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                )
              })()}

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <p className="font-display" style={{ fontSize: 56, fontWeight: 800, color: scoreColor, lineHeight: 1, letterSpacing: '-2px' }}>
                  {score.score.toFixed(1)}
                </p>
                <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Score de risco (0–10)</p>
              </div>

              <dl style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <ScoreItem label="Situação cadastral" value={score.situacao} ok={score.situacao === 'Ativa'} />
                <ScoreItem label="Tempo de empresa" value={`${score.tempo_anos} anos`} ok={score.tempo_anos >= 2} />
                <ScoreItem label="Capital social" value={score.capital_social} ok />
                <ScoreItem label="Porte" value={score.porte} ok />
                <ScoreItem label="Regime tributário" value={score.regime} ok />
                <ScoreItem label="Setor principal (CNAE)" value={score.setor} ok />
              </dl>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #1e293b' }}>
                <p style={{ fontSize: 11, color: '#334155', lineHeight: 1.5 }}>
                  Análise automatizada via dados cadastrais. Atualizado em {new Date().toLocaleDateString('pt-BR')}.
                </p>
              </div>
            </section>

            <AprovarRejeitarButtons pedidoId={pedido.id} podeAprovar={podeAprovar} email={pedido.email} />
          </div>
        </div>
      </main>
    </div>
  )
}

function Dado({ label, value, span, highlight }: { label: string; value: string; span?: boolean; highlight?: boolean }) {
  return (
    <div style={span ? { gridColumn: '1 / -1' } : {}}>
      <dt style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</dt>
      <dd style={{ fontWeight: 600, color: highlight ? RED : '#e2e8f0', fontSize: highlight ? 18 : 14 }}>{value}</dd>
    </div>
  )
}

function ScoreItem({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <dt style={{ fontSize: 12, color: '#64748b' }}>{label}</dt>
      <dd style={{ fontSize: 13, fontWeight: 600, color: ok ? '#4ade80' : '#f87171', display: 'flex', alignItems: 'center', gap: 4 }}>
        {ok ? '✓' : '✗'} {value}
      </dd>
    </div>
  )
}
