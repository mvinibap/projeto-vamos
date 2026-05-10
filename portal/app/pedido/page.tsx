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

const RED = '#de1c22'

function inputStyle(error?: string): React.CSSProperties {
  return {
    width: '100%',
    border: `1.5px solid ${error ? RED : 'var(--border)'}`,
    borderRadius: 10,
    padding: '11px 14px',
    fontSize: 15,
    color: 'var(--text)',
    background: error ? '#fff5f5' : '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color .15s',
  }
}

function Campo({ label, error, input }: { label: string; error?: string; input: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
        {label}
      </label>
      {input}
      {error && <p style={{ fontSize: 12, color: RED, marginTop: 4 }}>{error}</p>}
    </div>
  )
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
        {titulo}
      </h2>
      {children}
    </section>
  )
}

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
    supabase.from('equipamentos').select('*').eq('id', equipamentoId).single()
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
    if (error || !data) { alert('Erro ao enviar pedido. Tente novamente.'); return }
    router.push(`/pedido/confirmacao?numero=${data.numero_pedido}`)
  }

  if (!equipamentoId) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <p style={{ color: 'var(--muted)', marginBottom: 12 }}>Nenhum equipamento selecionado.</p>
        <Link href="/" style={{ color: RED, fontWeight: 600, textDecoration: 'none' }}>Ver equipamentos</Link>
      </div>
    )
  }

  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }
  const grid2cls = 'form-grid-2'

  return (
    <form onSubmit={enviar}>
      {/* Equipamento selecionado */}
      {equipamento && (
        <div style={{ background: '#f0fdf4', border: `1.5px solid #bbf7d0`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ width: 72, height: 56, borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', flexShrink: 0, position: 'relative' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 72 56" fill="none">
              <path d="M26 38 h5 v-10 h3 l-5-8 -5 8 h3v10z M38 38 h10 v-8 h-10z" fill="#cbd5e1" fillRule="evenodd"/>
              <rect x="23" y="38" width="27" height="2" rx="1" fill="#cbd5e1"/>
            </svg>
            {equipamento.foto_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={equipamento.foto_url}
                alt={equipamento.nome}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 2 }}>{equipamento.nome}</p>
            <p style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'capitalize' }}>{equipamento.categoria} · {equipamento.estado}</p>
            {equipamento.preco_dia && (
              <p style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, marginTop: 2 }}>
                A partir de R$ {equipamento.preco_dia.toLocaleString('pt-BR')}/dia
              </p>
            )}
          </div>
          <Link href={`/equipamentos/${equipamento.id}`} style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', flexShrink: 0 }}>
            Trocar
          </Link>
        </div>
      )}

      {/* Dados da empresa */}
      <Secao titulo="Dados da empresa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Campo label="Nome da empresa" error={erros.nome_empresa} input={
            <input type="text" placeholder="Construtora ABC Ltda" value={form.nome_empresa}
              onChange={(e) => set('nome_empresa', e.target.value)} style={inputStyle(erros.nome_empresa)} />
          } />
          <Campo label="CNPJ" error={erros.cnpj} input={
            <input type="text" inputMode="numeric" placeholder="00.000.000/0001-00" value={form.cnpj}
              onChange={(e) => set('cnpj', formatarCNPJ(e.target.value))} maxLength={18} style={inputStyle(erros.cnpj)} />
          } />
        </div>
      </Secao>

      {/* Período */}
      <Secao titulo="Período de locação">
        <div className={grid2cls} style={grid2}>
          <Campo label="Data de início" error={erros.data_inicio} input={
            <input type="date" value={form.data_inicio} min={new Date().toISOString().split('T')[0]}
              onChange={(e) => set('data_inicio', e.target.value)} style={inputStyle(erros.data_inicio)} />
          } />
          <Campo label="Data de término" error={erros.data_fim} input={
            <input type="date" value={form.data_fim} min={form.data_inicio || new Date().toISOString().split('T')[0]}
              onChange={(e) => set('data_fim', e.target.value)} style={inputStyle(erros.data_fim)} />
          } />
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Período mínimo: 5 dias.</p>
      </Secao>

      {/* Local de entrega */}
      <Secao titulo="Local de entrega">
        <div className={grid2cls} style={grid2}>
          <Campo label="Estado" error={erros.estado_entrega} input={
            <select value={form.estado_entrega} onChange={(e) => set('estado_entrega', e.target.value)}
              style={{ ...inputStyle(erros.estado_entrega), background: erros.estado_entrega ? '#fff5f5' : '#fff' }}>
              <option value="">Selecione</option>
              {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          } />
          <Campo label="Cidade" error={erros.cidade_entrega} input={
            <input type="text" placeholder="São Paulo" value={form.cidade_entrega}
              onChange={(e) => set('cidade_entrega', e.target.value)} style={inputStyle(erros.cidade_entrega)} />
          } />
        </div>
      </Secao>

      {/* Responsável */}
      <Secao titulo="Responsável pelo contato">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Campo label="Nome completo" error={erros.nome_responsavel} input={
            <input type="text" placeholder="João da Silva" value={form.nome_responsavel}
              onChange={(e) => set('nome_responsavel', e.target.value)} style={inputStyle(erros.nome_responsavel)} />
          } />
          <div className={grid2cls} style={grid2}>
            <Campo label="Telefone / WhatsApp" error={erros.telefone} input={
              <input type="tel" placeholder="(11) 99999-9999" value={form.telefone}
                onChange={(e) => set('telefone', e.target.value)} style={inputStyle(erros.telefone)} />
            } />
            <Campo label="E-mail" error={erros.email} input={
              <input type="email" placeholder="joao@empresa.com.br" value={form.email}
                onChange={(e) => set('email', e.target.value)} style={inputStyle(erros.email)} />
            } />
          </div>
        </div>
      </Secao>

      {/* Submit */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', background: loading ? '#b91c1c' : RED, color: '#fff',
            fontWeight: 700, fontSize: 16, padding: '14px 0', borderRadius: 10,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
          Sem pagamento agora. Um especialista VAMOS entrará em contato em até 24h.
        </p>
      </div>
    </form>
  )
}

export default function PedidoPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', textDecoration: 'none' }}>
            ← Voltar
          </Link>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-display" style={{ background: RED, color: '#fff', fontWeight: 800, fontSize: 14, padding: '5px 8px', borderRadius: 4, lineHeight: 1 }}>
              VAMOS
            </span>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 64px' }}>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 6 }}>
          Solicitar Locação
        </h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 28 }}>
          Preencha os dados abaixo e entraremos em contato em até 24h.
        </p>

        <div style={{ background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)', padding: '28px 24px' }}>
          <Suspense fallback={<p style={{ color: 'var(--muted)' }}>Carregando...</p>}>
            <PedidoForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
