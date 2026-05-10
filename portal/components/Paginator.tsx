'use client'

import { useState } from 'react'

export function usePagination<T>(items: T[], pageSize = 50) {
  const [page, setPage] = useState(1)
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  // Clamp during render. Callers should setPage(1) when their filter changes.
  const current = Math.min(page, totalPages)
  const start = (current - 1) * pageSize
  const end = Math.min(start + pageSize, total)
  return {
    visible: items.slice(start, end),
    page: current,
    totalPages,
    pageSize,
    total,
    start,
    end,
    setPage,
  }
}

export function PaginatorControls({
  page,
  totalPages,
  setPage,
  total,
  start,
  end,
  pageSize,
  label = 'item',
  pluralSuffix = 's',
}: {
  page: number
  totalPages: number
  setPage: (p: number) => void
  total: number
  start: number
  end: number
  pageSize: number
  label?: string
  pluralSuffix?: string
}) {
  if (total <= pageSize) return null

  const btn = (disabled: boolean): React.CSSProperties => ({
    background: disabled ? 'transparent' : 'var(--admin-surf2)',
    color: disabled ? 'var(--admin-muted-2)' : '#cbd5e1',
    border: `1px solid ${disabled ? 'var(--admin-surf2)' : 'var(--admin-border2)'}`,
    borderRadius: 6,
    padding: '0 12px',
    minHeight: 36,
    fontSize: 12,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  })

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '12px 16px',
      borderTop: '1px solid var(--admin-surf2)',
      background: '#0a111e',
    }}>
      <span style={{ fontSize: 13, color: 'var(--admin-text-2)' }}>
        Mostrando <strong style={{ color: '#e2e8f0' }}>{start + 1}–{end}</strong> de{' '}
        <strong style={{ color: '#e2e8f0' }}>{total}</strong> {label}{total !== 1 ? pluralSuffix : ''}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
          style={btn(page <= 1)}
        >
          ‹ Anterior
        </button>
        <span style={{ fontSize: 12, color: 'var(--admin-muted)', minWidth: 96, textAlign: 'center' }}>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          aria-label="Próxima página"
          style={btn(page >= totalPages)}
        >
          Próxima ›
        </button>
      </div>
    </div>
  )
}
