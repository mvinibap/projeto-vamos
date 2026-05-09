import { supabase, type Pedido } from '@/lib/supabase'
import { simularScoreCNPJ } from '@/lib/cnpj'
import TriagemClient from './TriagemClient'

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
  const emAnaliseRaw = pedidos.filter((p) => p.status === 'em_analise')

  const novos = novosRaw.map((p) => {
    const score = simularScoreCNPJ(p.cnpj)
    const eq = (p as any).equipamentos
    const dias = Math.max(1, Math.round(
      (new Date(p.data_fim).getTime() - new Date(p.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
    ))
    const valorEstimado = eq?.preco_dia ? eq.preco_dia * dias : null
    const idadeDias = Math.round((hoje - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
    return {
      ...p,
      equipamentos: eq ? { nome: eq.nome } : null,
      _score: score,
      _dias: dias,
      _valor: valorEstimado,
      _idade: idadeDias,
    }
  }).sort((a, b) => {
    const order = { aprovado: 0, analise: 1, negado: 2 } as Record<string, number>
    const recDiff = (order[a._score.recomendacao] ?? 1) - (order[b._score.recomendacao] ?? 1)
    if (recDiff !== 0) return recDiff
    return a._idade - b._idade
  })

  const emAnalise = emAnaliseRaw.map((p) => {
    const eq = (p as any).equipamentos
    const dias = Math.max(1, Math.round(
      (new Date(p.data_fim).getTime() - new Date(p.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
    ))
    const valor = eq?.preco_dia ? eq.preco_dia * dias : null
    const score = simularScoreCNPJ(p.cnpj)
    const idadeDias = Math.round((hoje - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
    return {
      ...p,
      equipamentos: eq ? { nome: eq.nome } : null,
      _score: score,
      _dias: dias,
      _valor: valor,
      _idadeDias: idadeDias,
    }
  })

  return <TriagemClient novos={novos} emAnalise={emAnalise} />
}
