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

export default async function AnalisePedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pedido = await getPedido(id)
  if (!pedido) notFound()

  const score = pedido.cnpj_score ?? simularScoreCNPJ(pedido.cnpj)
  const eq = pedido.equipamentos
  const dias = Math.round(
    (new Date(pedido.data_fim).getTime() - new Date(pedido.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
  )
  const valorEstimado = eq?.preco_dia ? eq.preco_dia * dias : null

  const scoreColor = score.score >= 7 ? 'text-green-400' : score.score >= 5 ? 'text-yellow-400' : 'text-red-400'
  const scoreBg = score.score >= 7 ? 'border-green-500/30 bg-green-500/5' : score.score >= 5 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-red-500/30 bg-red-500/5'

  const podeAprovar = ['novo', 'em_analise'].includes(pedido.status)
  const jaProcessado = !['novo', 'em_analise'].includes(pedido.status)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-400 hover:text-gray-200 transition-colors text-sm">
          ← Voltar
        </Link>
        <span className="text-xl font-bold text-orange-400">VAMOS</span>
        <span className="text-gray-500 text-sm">Análise de Pedido</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Status atual */}
        {jaProcessado && (
          <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            pedido.status === 'rejeitado' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            'bg-green-500/10 border-green-500/30 text-green-400'
          }`}>
            Pedido {pedido.status === 'rejeitado' ? 'rejeitado' : `em status: ${pedido.status.replace('_', ' ')}`}
            {pedido.motivo_rejeicao && ` — Motivo: ${pedido.motivo_rejeicao}`}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do pedido */}
            <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
                📋 Dados do Pedido
                <span className="text-xs text-gray-500 font-mono ml-auto">{pedido.numero_pedido}</span>
              </h2>
              <dl className="grid grid-cols-2 gap-4">
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
              <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="font-semibold text-gray-200 mb-4">🏗️ Equipamento Solicitado</h2>
                <dl className="grid grid-cols-2 gap-4">
                  <Dado label="Equipamento" value={eq.nome} span />
                  <Dado label="Categoria" value={eq.categoria} />
                  <Dado label="Localização atual" value={eq.estado} />
                  <Dado label="Período" value={`${new Date(pedido.data_inicio).toLocaleDateString('pt-BR')} a ${new Date(pedido.data_fim).toLocaleDateString('pt-BR')}`} />
                  <Dado label="Duração" value={`${dias} dias`} />
                  {valorEstimado && (
                    <Dado
                      label="Valor estimado"
                      value={`R$ ${valorEstimado.toLocaleString('pt-BR')}`}
                      highlight
                    />
                  )}
                </dl>
              </section>
            )}
          </div>

          {/* Score CNPJ */}
          <div className="space-y-4">
            <section className={`rounded-xl border p-6 ${scoreBg}`}>
              <h2 className="font-semibold text-gray-200 mb-4">📊 Análise de CNPJ</h2>

              <div className="text-center mb-6">
                <p className={`text-6xl font-bold ${scoreColor}`}>{score.score.toFixed(1)}</p>
                <p className="text-gray-400 text-sm mt-1">Score de risco</p>
              </div>

              <dl className="space-y-3">
                <ScoreItem label="Situação" value={score.situacao} ok={score.situacao === 'Ativa'} />
                <ScoreItem label="Tempo de empresa" value={`${score.tempo_anos} anos`} ok={score.tempo_anos >= 2} />
                <ScoreItem label="Capital social" value={score.capital_social} ok />
              </dl>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  Análise simulada para demonstração. Produção: integração com Receita Federal.
                </p>
              </div>
            </section>

            {/* Ações */}
            <AprovarRejeitarButtons pedidoId={pedido.id} podeAprovar={podeAprovar} email={pedido.email} />
          </div>
        </div>
      </main>
    </div>
  )
}

function Dado({ label, value, span, highlight }: { label: string; value: string; span?: boolean; highlight?: boolean }) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <dt className="text-xs text-gray-400 mb-1">{label}</dt>
      <dd className={`font-medium ${highlight ? 'text-orange-400 text-lg' : 'text-gray-200'}`}>{value}</dd>
    </div>
  )
}

function ScoreItem({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className={`text-sm font-medium flex items-center gap-1 ${ok ? 'text-green-400' : 'text-red-400'}`}>
        {ok ? '✓' : '✗'} {value}
      </dd>
    </div>
  )
}
