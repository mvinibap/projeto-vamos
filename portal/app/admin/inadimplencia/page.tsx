import { supabase, type Pedido } from '@/lib/supabase'
import { simularScoreCNPJ } from '@/lib/cnpj'
import InadimplenciaClient from './InadimplenciaClient'

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
  const hojeMs = Date.now()

  const rows = pedidos.map((p) => {
    const dataFim = new Date(p.data_fim)
    const diffMs = dataFim.getTime() - hojeMs
    const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24))
    const score = simularScoreCNPJ(p.cnpj)
    const eq = (p as any).equipamentos
    const dias = Math.max(1, Math.round(
      (dataFim.getTime() - new Date(p.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
    ))
    const valor = eq?.preco_dia ? eq.preco_dia * dias : null

    const risco =
      diffDias < 0 ? 'vencido' :
      diffDias === 0 ? 'vence_hoje' :
      diffDias <= 7 ? 'vence_semana' : 'ok'

    return {
      id: p.id,
      numero_pedido: p.numero_pedido,
      nome_empresa: p.nome_empresa,
      data_fim: p.data_fim,
      equipamento_nome: eq?.nome ?? null,
      _risco: risco as 'vencido' | 'vence_hoje' | 'vence_semana' | 'ok',
      _diffDias: diffDias,
      _scoreNum: score.score,
      _scoreRec: score.recomendacao,
      _valor: valor,
    }
  }).sort((a, b) => a._diffDias - b._diffDias)

  return <InadimplenciaClient rows={rows} />
}
