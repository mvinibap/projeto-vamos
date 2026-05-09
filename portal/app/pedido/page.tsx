'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Equipamento } from '@/lib/supabase'
import { validarCNPJ, formatarCNPJ } from '@/lib/cnpj'

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

function PedidoForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const equipamentoId = searchParams.get('equipamento')

  const [equipamento, setEquipamento] = useState<Equipamento | null>(null)
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    nome_empresa: '',
    cnpj: '',
    data_inicio: '',
    data_fim: '',
    estado_entrega: '',
    cidade_entrega: '',
    nome_responsavel: '',
    telefone: '',
    email: '',
  })

  useEffect(() => {
    if (!equipamentoId) return
    supabase
      .from('equipamentos')
      .select('*')
      .eq('id', equipamentoId)
      .single()
      .then(({ data }) => setEquipamento(data))
  }, [equipamentoId])

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErros((prev) => ({ ...prev, [field]: '' }))
  }

  function validar() {
    const e: Record<string, string> = {}
    if (!form.nome_empresa.trim()) e.nome_empresa = 'Informe o nome da empresa.'
    if (!validarCNPJ(form.cnpj)) e.cnpj = 'CNPJ inválido. Verifique e tente novamente.'
    if (!form.data_inicio) e.data_inicio = 'Informe a data de início.'
    if (!form.data_fim) e.data_fim = 'Informe a data de término.'
    if (form.data_inicio && form.data_fim) {
      const inicio = new Date(form.data_inicio)
      const fim = new Date(form.data_fim)
      const hoje = new Date(); hoje.setHours(0,0,0,0)
      if (inicio < hoje) e.data_inicio = 'Selecione uma data futura.'
      else if (fim <= inicio) e.data_fim = 'A data de término deve ser após o início.'
      else {
        const dias = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
        if (dias < 5) e.data_fim = 'Período mínimo de locação: 5 dias.'
      }
    }
    if (!form.estado_entrega) e.estado_entrega = 'Selecione o estado.'
    if (!form.cidade_entrega.trim()) e.cidade_entrega = 'Informe a cidade.'
    if (!form.nome_responsavel.trim()) e.nome_responsavel = 'Informe o nome do responsável.'
    if (!form.telefone.trim()) e.telefone = 'Informe o telefone.'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Informe um e-mail válido.'
    return e
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    const errosValidacao = validar()
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao)
      return
    }

    setLoading(true)
    const { data, error } = await supabase.from('pedidos').insert({
      equipamento_id: equipamentoId,
      nome_empresa: form.nome_empresa,
      cnpj: form.cnpj.replace(/[^\d]/g, ''),
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
      estado_entrega: form.estado_entrega,
      cidade_entrega: form.cidade_entrega,
      nome_responsavel: form.nome_responsavel,
      telefone: form.telefone,
      email: form.email,
    }).select().single()

    setLoading(false)

    if (error || !data) {
      alert('Erro ao enviar pedido. Tente novamente.')
      return
    }

    router.push(`/pedido/confirmacao?numero=${data.numero_pedido}`)
  }

  if (!equipamentoId) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Nenhum equipamento selecionado.</p>
        <Link href="/" className="text-orange-500 hover:underline">Ver equipamentos</Link>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="space-y-6">
      {/* Equipamento selecionado */}
      {equipamento && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4">
          <div className="text-3xl">🏗️</div>
          <div>
            <p className="font-semibold text-gray-900">{equipamento.nome}</p>
            <p className="text-sm text-gray-500 capitalize">{equipamento.categoria} · {equipamento.estado}</p>
            {equipamento.preco_dia && (
              <p className="text-sm text-orange-600 font-medium">
                A partir de R$ {equipamento.preco_dia.toLocaleString('pt-BR')}/dia
              </p>
            )}
          </div>
          <Link href={`/equipamentos/${equipamento.id}`} className="ml-auto text-sm text-gray-400 hover:text-gray-600">
            Trocar
          </Link>
        </div>
      )}

      {/* Dados da empresa */}
      <section>
        <h2 className="font-semibold text-gray-800 mb-4 text-lg">Dados da empresa</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Campo
              label="Nome da empresa"
              error={erros.nome_empresa}
              input={
                <input
                  type="text"
                  placeholder="Construtora ABC Ltda"
                  value={form.nome_empresa}
                  onChange={(e) => set('nome_empresa', e.target.value)}
                  className={inputClass(erros.nome_empresa)}
                />
              }
            />
          </div>
          <div>
            <Campo
              label="CNPJ"
              error={erros.cnpj}
              input={
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00.000.000/0001-00"
                  value={form.cnpj}
                  onChange={(e) => set('cnpj', formatarCNPJ(e.target.value))}
                  maxLength={18}
                  className={inputClass(erros.cnpj)}
                />
              }
            />
          </div>
        </div>
      </section>

      {/* Período */}
      <section>
        <h2 className="font-semibold text-gray-800 mb-4 text-lg">Período de locação</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo
            label="Data de início"
            error={erros.data_inicio}
            input={
              <input
                type="date"
                value={form.data_inicio}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => set('data_inicio', e.target.value)}
                className={inputClass(erros.data_inicio)}
              />
            }
          />
          <Campo
            label="Data de término"
            error={erros.data_fim}
            input={
              <input
                type="date"
                value={form.data_fim}
                min={form.data_inicio || new Date().toISOString().split('T')[0]}
                onChange={(e) => set('data_fim', e.target.value)}
                className={inputClass(erros.data_fim)}
              />
            }
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">Período mínimo: 5 dias.</p>
      </section>

      {/* Local de entrega */}
      <section>
        <h2 className="font-semibold text-gray-800 mb-4 text-lg">Local de entrega</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo
            label="Estado"
            error={erros.estado_entrega}
            input={
              <select
                value={form.estado_entrega}
                onChange={(e) => set('estado_entrega', e.target.value)}
                className={inputClass(erros.estado_entrega)}
              >
                <option value="">Selecione o estado</option>
                {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            }
          />
          <Campo
            label="Cidade"
            error={erros.cidade_entrega}
            input={
              <input
                type="text"
                placeholder="São Paulo"
                value={form.cidade_entrega}
                onChange={(e) => set('cidade_entrega', e.target.value)}
                className={inputClass(erros.cidade_entrega)}
              />
            }
          />
        </div>
      </section>

      {/* Responsável */}
      <section>
        <h2 className="font-semibold text-gray-800 mb-4 text-lg">Responsável pelo contato</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Campo
              label="Nome completo"
              error={erros.nome_responsavel}
              input={
                <input
                  type="text"
                  placeholder="João da Silva"
                  value={form.nome_responsavel}
                  onChange={(e) => set('nome_responsavel', e.target.value)}
                  className={inputClass(erros.nome_responsavel)}
                />
              }
            />
          </div>
          <Campo
            label="Telefone / WhatsApp"
            error={erros.telefone}
            input={
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={form.telefone}
                onChange={(e) => set('telefone', e.target.value)}
                className={inputClass(erros.telefone)}
              />
            }
          />
          <Campo
            label="E-mail"
            error={erros.email}
            input={
              <input
                type="email"
                placeholder="joao@empresa.com.br"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className={inputClass(erros.email)}
              />
            }
          />
        </div>
      </section>

      {/* Submit */}
      <div className="border-t border-gray-100 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-10 py-4 rounded-xl transition-colors text-lg"
        >
          {loading ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Sem pagamento agora. Um especialista VAMOS entrará em contato em até 24h.
        </p>
      </div>
    </form>
  )
}

function Campo({ label, error, input }: { label: string; error?: string; input: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {input}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function inputClass(error?: string) {
  return `w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 transition-colors text-base ${
    error
      ? 'border-red-400 focus:ring-red-300 bg-red-50'
      : 'border-gray-300 focus:ring-orange-400'
  }`
}

export default function PedidoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            ← Voltar
          </Link>
          <span className="text-xl font-bold text-orange-500">VAMOS</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Solicitar Locação</h1>
        <p className="text-gray-500 mb-8">Preencha os dados abaixo e entraremos em contato em até 24h.</p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <Suspense fallback={<p className="text-gray-400">Carregando...</p>}>
            <PedidoForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
