import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Equipamento = {
  id: string
  nome: string
  categoria: 'retroescavadeira' | 'trator' | 'caminhao' | 'guindaste' | 'plataforma' | 'compactador' | 'outro'
  descricao: string | null
  foto_url: string | null
  specs: Record<string, string>
  preco_dia: number | null
  preco_mes: number | null
  estado: string
  status: 'disponivel' | 'reservado' | 'indisponivel'
  disponivel_a_partir_de: string | null
  created_at: string
}

export type Pedido = {
  id: string
  numero_pedido: string
  equipamento_id: string
  nome_empresa: string
  cnpj: string
  data_inicio: string
  data_fim: string
  estado_entrega: string
  cidade_entrega: string
  nome_responsavel: string
  telefone: string
  email: string
  status: 'novo' | 'em_analise' | 'contrato_enviado' | 'assinado' | 'ativo' | 'rejeitado'
  motivo_rejeicao: string | null
  cnpj_score: {
    score: number
    situacao: string
    tempo_anos: number
    capital_social: string
    porte?: string
    regime?: string
    setor?: string
    limite_credito?: number
    recomendacao?: 'aprovado' | 'analise' | 'negado'
  } | null
  created_at: string
  updated_at: string
  equipamentos?: Equipamento
}
