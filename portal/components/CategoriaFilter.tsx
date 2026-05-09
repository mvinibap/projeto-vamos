'use client'

import Link from 'next/link'

type Categoria = { id: string; label: string }

export default function CategoriaFilter({ categorias, categoriaAtiva, estado }: {
  categorias: Categoria[]
  categoriaAtiva: string
  estado: string
}) {
  return (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
      {categorias.map((cat) => {
        const params = new URLSearchParams()
        params.set('categoria', cat.id)
        if (estado) params.set('estado', estado)
        const isActive = categoriaAtiva === cat.id

        return (
          <Link
            key={cat.id}
            href={`/?${params.toString()}`}
            style={{
              whiteSpace: 'nowrap',
              fontSize: 13,
              fontWeight: 600,
              padding: '6px 16px',
              borderRadius: 9999,
              border: isActive ? '1.5px solid var(--red)' : '1.5px solid var(--border)',
              background: isActive ? 'var(--red)' : 'var(--bg)',
              color: isActive ? '#fff' : 'var(--muted)',
              textDecoration: 'none',
              transition: 'all .15s',
              flexShrink: 0,
            }}
          >
            {cat.label}
          </Link>
        )
      })}
    </div>
  )
}
