'use client'

import { useState } from 'react'

const OPCOES = [
  { label: '30 dias', dias: 30 },
  { label: '60 dias', dias: 60 },
  { label: '90 dias', dias: 90 },
  { label: '180 dias', dias: 180 },
]

// Multiplicador baseado na relação típica diária × valor de aquisição
// de maquinário pesado no Brasil (conservador: 400×)
const MULTIPLICADOR_COMPRA = 400

export default function AlugarVsComprar({ precoDia }: { precoDia: number }) {
  const [diasSel, setDiasSel] = useState(90)

  const custoLocacao = precoDia * diasSel
  const custoCompra = precoDia * MULTIPLICADOR_COMPRA
  const economia = custoCompra - custoLocacao
  const pct = Math.round((economia / custoCompra) * 100)

  return (
    <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '22px 24px', marginBottom: 24 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 6 }}>
        🧮 Alugar vs Comprar
      </h2>
      <p style={{ fontSize: 13, color: '#374151', marginBottom: 16 }}>
        Compare o custo de locação com a compra deste equipamento:
      </p>

      {/* Seletores de período */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {OPCOES.map((op) => (
          <button
            key={op.dias}
            onClick={() => setDiasSel(op.dias)}
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: `1.5px solid ${diasSel === op.dias ? '#16a34a' : '#d1fae5'}`,
              background: diasSel === op.dias ? '#16a34a' : '#fff',
              color: diasSel === op.dias ? '#fff' : '#374151',
              cursor: 'pointer',
            }}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Comparação */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #d1fae5', padding: '14px 16px' }}>
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Alugar por {diasSel} dias
          </p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#16a34a', letterSpacing: '-0.5px' }}>
            R$ {custoLocacao.toLocaleString('pt-BR')}
          </p>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>inclui manutenção e seguro</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: '14px 16px' }}>
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Comprar
          </p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#374151', letterSpacing: '-0.5px' }}>
            R$ {custoCompra.toLocaleString('pt-BR')}
          </p>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>+ manutenção, seguro, depreciação</p>
        </div>
      </div>

      {/* Destaque de economia */}
      <div style={{ background: '#16a34a', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
            Alugando por {diasSel} dias você economiza
          </p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            R$ {economia.toLocaleString('pt-BR')}
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{pct}%</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>de economia</p>
        </div>
      </div>

      <p style={{ fontSize: 11, color: '#6b7280', marginTop: 10, lineHeight: 1.5 }}>
        Estimativa baseada no valor de aquisição típico deste tipo de equipamento. Valores de compra incluem custos totais de propriedade.
      </p>
    </div>
  )
}
