import Link from 'next/link'

export default async function ConfirmacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ numero?: string }>
}) {
  const { numero } = await searchParams

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <span className="text-xl font-bold text-orange-500">VAMOS</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido enviado!</h1>
          <p className="text-gray-500 mb-6">
            Um especialista VAMOS entrará em contato em até 24 horas para confirmar os detalhes e dar continuidade ao processo.
          </p>

          {numero && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-400 mb-1">Número do pedido</p>
              <p className="text-2xl font-bold text-gray-900 font-mono">{numero}</p>
              <p className="text-xs text-gray-400 mt-1">Guarde este número para acompanhar seu pedido.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Ver mais equipamentos
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
