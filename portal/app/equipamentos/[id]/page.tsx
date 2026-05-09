import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EquipamentoFoto from '@/components/EquipamentoFoto'

async function getEquipamento(id: string) {
  const { data } = await supabase.from('equipamentos').select('*').eq('id', id).single()
  return data
}

export default async function EquipamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const eq = await getEquipamento(id)
  if (!eq) notFound()

  const disponivel = eq.status === 'disponivel'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            ← Voltar
          </Link>
          <span className="text-xl font-bold text-orange-500">VAMOS</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Foto */}
          <EquipamentoFoto src={eq.foto_url} alt={eq.nome} />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{eq.nome}</h1>
                <p className="text-gray-500 capitalize">{eq.categoria.replace('_', ' ')} · {eq.estado}</p>
              </div>
              <div className="text-right shrink-0">
                {eq.preco_dia && (
                  <>
                    <p className="text-sm text-gray-400">A partir de</p>
                    <p className="text-3xl font-bold text-orange-500">
                      R$ {eq.preco_dia.toLocaleString('pt-BR')}
                      <span className="text-lg font-normal text-gray-500">/dia</span>
                    </p>
                    {eq.preco_mes && (
                      <p className="text-sm text-gray-500">ou R$ {eq.preco_mes.toLocaleString('pt-BR')}/mês</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Frete a consultar</p>
                  </>
                )}
              </div>
            </div>

            {/* Disponibilidade */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              disponivel
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${disponivel ? 'bg-green-500' : 'bg-yellow-500'}`} />
              {disponivel
                ? 'Disponível para locação'
                : `Reservado${eq.disponivel_a_partir_de ? ` — disponível a partir de ${new Date(eq.disponivel_a_partir_de).toLocaleDateString('pt-BR')}` : ''}`
              }
            </div>

            {/* Descrição */}
            {eq.descricao && (
              <div className="mb-6">
                <h2 className="font-semibold text-gray-800 mb-2">Sobre o equipamento</h2>
                <p className="text-gray-600 leading-relaxed">{eq.descricao}</p>
              </div>
            )}

            {/* Specs */}
            {eq.specs && Object.keys(eq.specs).length > 0 && (
              <div className="mb-8">
                <h2 className="font-semibold text-gray-800 mb-3">Especificações técnicas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(eq.specs as Record<string, string>).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-400 capitalize mb-1">{key.replace(/_/g, ' ')}</p>
                      <p className="font-semibold text-gray-800 text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="border-t border-gray-100 pt-6">
              {disponivel ? (
                <Link
                  href={`/pedido?equipamento=${eq.id}`}
                  className="block w-full sm:w-auto sm:inline-block text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
                >
                  Solicitar Locação
                </Link>
              ) : (
                <button
                  disabled
                  className="block w-full sm:w-auto sm:inline-block text-center bg-gray-200 text-gray-400 font-semibold px-8 py-4 rounded-xl text-lg cursor-not-allowed"
                >
                  Equipamento Reservado
                </button>
              )}
              <p className="text-xs text-gray-400 mt-3">
                Sem pagamento online. Um especialista VAMOS entrará em contato para confirmar o pedido.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
