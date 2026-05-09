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
      className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
    >
      <option value="">Todos os estados</option>
      {ESTADOS_BR.map((uf) => (
        <option key={uf} value={uf}>{uf}</option>
      ))}
    </select>
  )
}
