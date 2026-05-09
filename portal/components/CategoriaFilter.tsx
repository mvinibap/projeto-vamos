'use client'

import Link from 'next/link'

type Categoria = { id: string; label: string }

export default function CategoriaFilter({
  categorias,
  categoriaAtiva,
  estado,
}: {
  categorias: Categoria[]
  categoriaAtiva: string
  estado: string
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categorias.map((cat) => {
        const params = new URLSearchParams()
        params.set('categoria', cat.id)
        if (estado) params.set('estado', estado)
        const isActive = categoriaAtiva === cat.id

        return (
          <Link
            key={cat.id}
            href={`/?${params.toString()}`}
            className={`shrink-0 text-sm px-4 py-2 rounded-full border transition-colors ${
              isActive
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400 hover:text-orange-500'
            }`}
          >
            {cat.label}
          </Link>
        )
      })}
    </div>
  )
}
