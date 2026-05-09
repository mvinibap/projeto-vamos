import { supabase } from '@/lib/supabase'
import EquipamentosClient from './EquipamentosClient'

export const dynamic = 'force-dynamic'

export default async function EquipamentosPage() {
  const { data } = await supabase
    .from('equipamentos')
    .select('id, nome, categoria, preco_dia, status, disponivel_a_partir_de')
    .order('nome', { ascending: true })

  const equipamentos = (data ?? []).map((e: any) => ({
    id: e.id as string,
    nome: e.nome as string,
    categoria: e.categoria as string | null,
    preco_dia: e.preco_dia as number | null,
    status: e.status as 'disponivel' | 'reservado' | 'indisponivel',
    disponivel_a_partir_de: e.disponivel_a_partir_de as string | null,
  }))

  return <EquipamentosClient equipamentos={equipamentos} />
}
