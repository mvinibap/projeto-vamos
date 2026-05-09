'use client'

import Link from 'next/link'
import type { Equipamento } from '@/lib/supabase'

const STATUS_LABEL: Record<Equipamento['status'], { label: string; color: string }> = {
  disponivel: { label: 'Disponível', color: 'bg-green-100 text-green-700' },
  reservado: { label: 'Reservado', color: 'bg-yellow-100 text-yellow-700' },
  indisponivel: { label: 'Indisponível', color: 'bg-red-100 text-red-700' },
}

export default function EquipamentoCard({ equipamento: eq }: { equipamento: Equipamento }) {
  const status = STATUS_LABEL[eq.status]

  return (
    <Link href={`/equipamentos/${eq.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Foto */}
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          {/* Emoji fallback — sempre atrás */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-5xl">
            🏗️
          </div>
          {eq.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={eq.foto_url}
              alt={eq.nome}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : null}
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
              {eq.nome}
            </h3>
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-3 capitalize">{eq.categoria.replace('_', ' ')} · {eq.estado}</p>

          {eq.preco_dia ? (
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400">A partir de</p>
              <p className="font-bold text-orange-500">
                R$ {eq.preco_dia.toLocaleString('pt-BR')}<span className="font-normal text-gray-500 text-sm">/dia</span>
              </p>
              {eq.preco_mes && (
                <p className="text-xs text-gray-500">ou R$ {eq.preco_mes.toLocaleString('pt-BR')}/mês</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 border-t border-gray-100 pt-3">Consulte o preço</p>
          )}
        </div>
      </div>
    </Link>
  )
}
