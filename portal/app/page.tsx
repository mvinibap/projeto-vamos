import Link from 'next/link'
import { supabase, type Equipamento } from '@/lib/supabase'
import { Suspense } from 'react'
import EquipamentoCard from '@/components/EquipamentoCard'
import CategoriaFilter from '@/components/CategoriaFilter'
import EstadoFilter from '@/components/EstadoFilter'

const CATEGORIAS = [
  { id: 'todos', label: 'Ver todos' },
  { id: 'retroescavadeira', label: 'Retroescavadeira' },
  { id: 'trator', label: 'Trator' },
  { id: 'caminhao', label: 'Caminhão' },
  { id: 'guindaste', label: 'Guindaste' },
  { id: 'plataforma', label: 'Plataforma' },
  { id: 'compactador', label: 'Compactador' },
  { id: 'outro', label: 'Outros' },
]

async function getEquipamentos(categoria?: string, estado?: string): Promise<Equipamento[]> {
  let query = supabase.from('equipamentos').select('*').order('nome')
  if (categoria && categoria !== 'todos') query = query.eq('categoria', categoria)
  if (estado) query = query.eq('estado', estado)
  const { data } = await query
  return data ?? []
}


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; estado?: string }>
}) {
  const params = await searchParams
  const categoria = params.categoria ?? 'todos'
  const estado = params.estado ?? ''
  const equipamentos = await getEquipamentos(categoria, estado)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-orange-500">VAMOS</span>
            <span className="ml-2 text-sm text-gray-500 hidden sm:inline">Locação de Equipamentos</span>
          </div>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Área Administrativa
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-orange-500 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Alugue equipamentos pesados para sua empresa
          </h1>
          <p className="text-orange-100 text-sm sm:text-base">
            Retroescavadeiras, tratores, guindastes e mais — sem burocracia, sem visita comercial.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Categorias */}
            <CategoriaFilter categorias={CATEGORIAS} categoriaAtiva={categoria} estado={estado} />

            {/* Filtro por estado */}
            <div className="ml-auto">
              <Suspense fallback={null}>
                <EstadoFilter estadoAtivo={estado} categoria={categoria} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de equipamentos */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {equipamentos.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">Nenhum equipamento encontrado para esse filtro.</p>
            <Link href="/" className="text-orange-500 hover:underline mt-2 inline-block">
              Ver todos os equipamentos
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {equipamentos.length} equipamento{equipamentos.length !== 1 ? 's' : ''} disponíve{equipamentos.length !== 1 ? 'is' : 'l'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {equipamentos.map((eq) => (
                <EquipamentoCard key={eq.id} equipamento={eq} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
          <p>VAMOS Locação © {new Date().getFullYear()} — Valores sujeitos a confirmação comercial.</p>
        </div>
      </footer>
    </div>
  )
}
