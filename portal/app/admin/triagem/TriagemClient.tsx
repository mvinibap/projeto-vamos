'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FilterBadge } from '@/components/FilterBadge'

type ScoreResult = {
  score: number
  recomendacao: 'aprovado' | 'analise' | 'negado'
  situacao: string
  tempo_anos: number
  capital_social: string
  porte: string
  regime: string
  setor: string
  limite_credito: number
}

export type NovoPedido = {
  id: string
  numero_pedido: string
  nome_empresa: string
  cnpj: string
  data_inicio: string
  data_fim: string
  estado_entrega: string
  created_at: string
  equipamentos?: { nome?: string } | null
  _score: ScoreResult
  _dias: number
  _valor: number | null
  _idade: number
}

export type EmAnalisePedido = {
  id: string
  numero_pedido: string
  nome_empresa: string
  cnpj: string
  created_at: string
  estado_entrega: string
  equipamentos?: { nome?: string } | null
  _score: ScoreResult
  _dias: number
  _valor: number | null
  _idadeDias: number
}

type FilterKey = 'aprovado' | 'analise' | 'negado' | 'em_analise' | null

export default function TriagemClient({
  novos,
  emAnalise,
}: {
  novos: NovoPedido[]
  emAnalise: EmAnalisePedido[]
}) {
  const [filtro, setFiltro] = useState<FilterKey>(null)

  const preAprovados = novos.filter((p) => p._score.recomendacao === 'aprovado').length
  const analiseManual = novos.filter((p) => p._score.recomendacao === 'analise').length
  const negados = novos.filter((p) => p._score.recomendacao === 'negado').length

  const toggleFiltro = (key: FilterKey) =>
    setFiltro((prev) => (prev === key ? null : key))

  const novosFiltrados =
    filtro === null || filtro === 'em_analise'
      ? filtro === 'em_analise' ? [] : novos
      : novos.filter((p) => p._score.recomendacao === filtro)

  const emAnaliseFiltrados =
    filtro === null || filtro === 'em_analise' ? emAnalise : []

  const mostrarNovos = filtro !== 'em_analise'
  const mostrarEmAnalise = filtro === null || filtro === 'em_analise'

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
          Fila de Triagem
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8' }}>
          Pedidos aguardando análise e aprovação · Score calculado pelo simulador CNPJ
          {filtro && (
            <button
              onClick={() => setFiltro(null)}
              style={{ marginLeft: 12, fontSize: 11, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
            >
              Limpar filtro
            </button>
          )}
        </p>
      </div>

      {/* Badges filtraveis */}
      {(novos.length > 0 || emAnalise.length > 0) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <FilterBadge
            label="Pré-aprovados"
            value={preAprovados}
            color="#4ade80"
            bg="rgba(34,197,94,0.1)"
            active={filtro === 'aprovado'}
            onClick={() => toggleFiltro('aprovado')}
          />
          <FilterBadge
            label="Análise manual"
            value={analiseManual}
            color="#facc15"
            bg="rgba(234,179,8,0.08)"
            active={filtro === 'analise'}
            onClick={() => toggleFiltro('analise')}
          />
          <FilterBadge
            label="Negados"
            value={negados}
            color="#f87171"
            bg="rgba(239,68,68,0.08)"
            active={filtro === 'negado'}
            onClick={() => toggleFiltro('negado')}
          />
          <FilterBadge
            label="Em análise"
            value={emAnalise.length}
            color="#a78bfa"
            bg="rgba(167,139,250,0.08)"
            active={filtro === 'em_analise'}
            onClick={() => toggleFiltro('em_analise')}
          />
        </div>
      )}

      {/* Novos — triage */}
      {mostrarNovos && novosFiltrados.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
            <span style={{ color: '#de1c22' }} aria-hidden="true">⚡</span> Aguardando análise ({novosFiltrados.length})
          </h2>
          <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 60px 56px 110px 72px auto', padding: '8px 16px', borderBottom: '1px solid #1e293b', borderLeft: '3px solid transparent' }}>
              {['Score', 'Empresa', 'Equipamento', 'Estado', 'Dias', 'Valor est.', 'Aguarda', ''].map((h) => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</span>
              ))}
            </div>
            {novosFiltrados.map((p, i) => {
              const rec = p._score.recomendacao
              const borderColor = rec === 'aprovado' ? 'rgba(34,197,94,0.5)' : rec === 'analise' ? 'rgba(234,179,8,0.5)' : 'rgba(239,68,68,0.5)'
              const scoreColor = rec === 'aprovado' ? '#4ade80' : rec === 'analise' ? '#facc15' : '#f87171'
              const scoreBg = rec === 'aprovado' ? 'rgba(34,197,94,0.1)' : rec === 'analise' ? 'rgba(234,179,8,0.08)' : 'rgba(239,68,68,0.08)'
              const recLabel = rec === 'aprovado' ? '✓ APROVADO' : rec === 'analise' ? '⚠ ANÁLISE' : '✗ NEGADO'
              const idadeLabel = p._idade === 0 ? 'hoje' : p._idade === 1 ? '1 dia' : `${p._idade} dias`
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 1fr 60px 56px 110px 72px auto',
                    padding: '11px 16px',
                    borderBottom: i < novosFiltrados.length - 1 ? '1px solid #1e293b' : 'none',
                    borderLeft: `3px solid ${borderColor}`,
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: scoreColor, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', lineHeight: 1, letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>
                      {p._score.score.toFixed(1)}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: scoreColor, letterSpacing: '0.5px', background: scoreBg, padding: '1px 5px', borderRadius: 3, display: 'inline-block' }}>
                      {recLabel}
                    </span>
                  </div>
                  <div style={{ minWidth: 0, paddingRight: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome_empresa}</p>
                    <p style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{p.numero_pedido}</p>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
                    {p.equipamentos?.nome ?? '—'}
                  </p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{p.estado_entrega}</p>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{p._dias}d</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: p._valor ? '#f1f5f9' : '#475569' }}>
                    {p._valor ? `R$ ${p._valor.toLocaleString('pt-BR')}` : '—'}
                  </p>
                  <p style={{ fontSize: 11, color: p._idade >= 3 ? '#f87171' : p._idade >= 1 ? '#facc15' : '#64748b' }}>{idadeLabel}</p>
                  <Link
                    href={`/admin/pedidos/${p.id}`}
                    style={{
                      background: rec === 'aprovado' ? 'rgba(34,197,94,0.15)' : rec === 'negado' ? 'rgba(239,68,68,0.12)' : '#1e293b',
                      color: rec === 'aprovado' ? '#4ade80' : rec === 'negado' ? '#f87171' : '#94a3b8',
                      fontSize: 12, fontWeight: 700, padding: '0 14px', minHeight: 36, borderRadius: 6,
                      textDecoration: 'none', whiteSpace: 'nowrap',
                      border: `1px solid ${rec === 'aprovado' ? 'rgba(34,197,94,0.3)' : rec === 'negado' ? 'rgba(239,68,68,0.25)' : '#334155'}`,
                      display: 'inline-flex', alignItems: 'center',
                    }}
                  >
                    Analisar →
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Em análise */}
      {mostrarEmAnalise && emAnaliseFiltrados.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
            Em análise ({emAnaliseFiltrados.length})
          </h2>
          <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(146,64,14,0.15)', padding: '2px 8px', borderRadius: 4 }}>
                Revisão em andamento
              </span>
              <span style={{ fontSize: 11, color: '#475569' }}>Pedidos em revisão pelo operador</span>
            </div>
            {emAnaliseFiltrados.map((p, i) => {
              const scoreColor = p._score.recomendacao === 'aprovado' ? '#4ade80' : p._score.recomendacao === 'analise' ? '#facc15' : '#f87171'
              const idadeLabel = p._idadeDias === 0 ? 'hoje' : p._idadeDias === 1 ? '1 dia' : `${p._idadeDias} dias`
              return (
                <div key={p.id} style={{
                  display: 'grid', gridTemplateColumns: '120px 1fr 1fr 60px 56px 110px 72px auto',
                  padding: '11px 16px', alignItems: 'center',
                  borderBottom: i < emAnaliseFiltrados.length - 1 ? '1px solid #1e293b' : 'none',
                  borderLeft: '3px solid rgba(146,64,14,0.5)',
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: scoreColor, lineHeight: 1, letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)' }}>
                    {p._score.score.toFixed(1)}
                  </span>
                  <div style={{ minWidth: 0, paddingRight: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome_empresa}</p>
                    <p style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{p.numero_pedido}</p>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>{p.equipamentos?.nome ?? '—'}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{p.estado_entrega}</p>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{p._dias}d</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: p._valor ? '#f1f5f9' : '#475569' }}>
                    {p._valor ? `R$ ${p._valor.toLocaleString('pt-BR')}` : '—'}
                  </p>
                  <p style={{ fontSize: 11, color: p._idadeDias >= 3 ? '#f87171' : '#64748b' }}>{idadeLabel}</p>
                  <Link href={`/admin/pedidos/${p.id}`} style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textDecoration: 'none', padding: '0 14px', minHeight: 36, borderRadius: 6, background: '#1e293b', border: '1px solid #334155', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>
                    Continuar →
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Vazio */}
      {novosFiltrados.length === 0 && emAnaliseFiltrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
          {filtro ? (
            <>
              <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Nenhum pedido nessa categoria</p>
              <button onClick={() => setFiltro(null)} style={{ fontSize: 13, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Ver todos
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: 32, marginBottom: 12 }}>✓</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Fila vazia</p>
              <p style={{ fontSize: 13 }}>Nenhum pedido aguardando triagem.</p>
            </>
          )}
        </div>
      )}
    </main>
  )
}

