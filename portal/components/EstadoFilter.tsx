'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

export default function EstadoFilter({ estadoAtivo, categoria }: { estadoAtivo: string; categoria: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) params.set('estado', e.target.value)
    else params.delete('estado')
    if (categoria && categoria !== 'todos') params.set('categoria', categoria)
    else params.delete('categoria')
    router.push(`/?${params.toString()}`)
  }

  return (
    <select
      value={estadoAtivo}
      onChange={handleChange}
      style={{ fontSize: 13, border: '1.5px solid var(--border)', borderRadius: 8, padding: '6px 12px', color: 'var(--text)', background: 'var(--bg)', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
    >
      <option value="">Todos os estados</option>
      {ESTADOS_BR.map((uf) => (
        <option key={uf} value={uf}>{uf}</option>
      ))}
    </select>
  )
}
