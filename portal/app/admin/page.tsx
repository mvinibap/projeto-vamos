import Link from 'next/link'
import { supabase, type Pedido } from '@/lib/supabase'

async function getPedidos(): Promise<Pedido[]> {
  const { data } = await supabase
    .from('pedidos')
    .select('*, equipamentos(*)')
    .order('created_at', { ascending: false })
  return data ?? []
}

const STATUS_CONFIG: Record<Pedido['status'], { label: string; color: string }> = {
  novo:              { label: 'Novo',              color: 'bg-blue-100 text-blue-700' },
  em_analise:        { label: 'Em análise',        color: 'bg-yellow-100 text-yellow-700' },
  contrato_enviado:  { label: 'Contrato enviado',  color: 'bg-purple-100 text-purple-700' },
  assinado:          { label: 'Assinado',          color: 'bg-indigo-100 text-indigo-700' },
  ativo:             { label: 'Ativo',             color: 'bg-green-100 text-green-700' },
  rejeitado:         { label: 'Rejeitado',         color: 'bg-red-100 text-red-700' },
}

export default async function AdminPage() {
  const pedidos = await getPedidos()

  const novos = pedidos.filter((p) => p.status === 'novo')
  const ativos = pedidos.filter((p) => p.status === 'ativo').length
  const contratos = pedidos.filter((p) => ['contrato_enviado', 'assinado', 'ativo'].includes(p.status)).length

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-orange-400">VAMOS</span>
          <span className="text-gray-500 text-sm">Painel Operacional</span>
        </div>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Portal do Cliente
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <KPI label="Total de pedidos" value={pedidos.length} />
          <KPI label="Aguardando análise" value={novos.length} highlight />
          <KPI label="Contratos emitidos" value={contratos} />
          <KPI label="Locações ativas" value={ativos} />
        </div>

        {/* Fila: pedidos novos */}
        {novos.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-3">
              ⚡ Aguardando análise ({novos.length})
            </h2>
            <div className="space-y-2">
              {novos.map((p) => (
                <PedidoRow key={p.id} pedido={p} destaque />
              ))}
            </div>
          </section>
        )}

        {/* Todos os pedidos */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Todos os pedidos
          </h2>
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Pedido</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Empresa</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Equipamento</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Período</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Data</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {pedidos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-300 text-xs">{p.numero_pedido}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-200">{p.nome_empresa}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-400">
                      {p.equipamentos?.nome ?? '—'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">
                      {new Date(p.data_inicio).toLocaleDateString('pt-BR')} – {new Date(p.data_fim).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CONFIG[p.status].color}`}>
                        {STATUS_CONFIG[p.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500 text-xs">
                      {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pedidos/${p.id}`}
                        className="text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors"
                      >
                        Analisar →
                      </Link>
                    </td>
                  </tr>
                ))}
                {pedidos.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      Nenhum pedido ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

function KPI({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'bg-orange-500/10 border-orange-500/30' : 'bg-gray-900 border-gray-800'}`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${highlight ? 'text-orange-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function PedidoRow({ pedido: p, destaque }: { pedido: Pedido; destaque?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
      destaque ? 'bg-orange-500/5 border-orange-500/20' : 'bg-gray-900 border-gray-800'
    }`}>
      <div>
        <p className="font-medium text-white">{p.nome_empresa}</p>
        <p className="text-xs text-gray-400">
          {p.equipamentos?.nome ?? '—'} · {p.numero_pedido}
        </p>
      </div>
      <Link
        href={`/admin/pedidos/${p.id}`}
        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        Analisar
      </Link>
    </div>
  )
}
