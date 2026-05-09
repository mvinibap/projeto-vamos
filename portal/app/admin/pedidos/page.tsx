import { supabase, type Pedido } from '@/lib/supabase'
import PedidosClient from './PedidosClient'

export const dynamic = 'force-dynamic'

async function getPedidos(): Promise<Pedido[]> {
  const { data } = await supabase
    .from('pedidos')
    .select('*, equipamentos(*)')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function PedidosPage() {
  const pedidos = await getPedidos()

  const rows = pedidos.map((p) => ({
    id: p.id,
    numero_pedido: p.numero_pedido,
    nome_empresa: p.nome_empresa,
    estado_entrega: p.estado_entrega,
    data_inicio: p.data_inicio,
    data_fim: p.data_fim,
    created_at: p.created_at,
    status: p.status,
    equipamento_nome: (p as any).equipamentos?.nome ?? null,
  }))

  return <PedidosClient pedidos={rows} />
}
