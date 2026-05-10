'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const RED = '#de1c22'

export default function AprovarRejeitarButtons({
  pedidoId,
  podeAprovar,
  email,
}: {
  pedidoId: string
  podeAprovar: boolean
  email: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<'aprovando' | 'rejeitando' | null>(null)
  const [motivoRejeicao, setMotivoRejeicao] = useState('')
  const [showRejeitar, setShowRejeitar] = useState(false)
  const [contratoEnviado, setContratoEnviado] = useState(false)

  async function aprovar() {
    setLoading('aprovando')
    await supabase
      .from('pedidos')
      .update({ status: 'contrato_enviado' })
      .eq('id', pedidoId)
    setLoading(null)
    setContratoEnviado(true)
  }

  async function rejeitar() {
    if (!motivoRejeicao.trim()) return
    setLoading('rejeitando')
    await supabase
      .from('pedidos')
      .update({ status: 'rejeitado', motivo_rejeicao: motivoRejeicao })
      .eq('id', pedidoId)
    setLoading(null)
    router.refresh()
  }

  if (contratoEnviado) {
    return (
      <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <p style={{ fontWeight: 700, color: '#4ade80', marginBottom: 4, fontSize: 14 }}>Contrato enviado!</p>
        <p style={{ fontSize: 13, color: 'var(--admin-muted)' }}>
          Link do contrato enviado para <strong style={{ color: 'var(--admin-text-2)' }}>{email}</strong>
        </p>
        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--admin-muted-2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p>1. Contrato gerado automaticamente</p>
          <p>2. E-mail enviado ao cliente</p>
          <p>3. Aguardando assinatura digital</p>
        </div>
      </div>
    )
  }

  if (!podeAprovar) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <button
        onClick={aprovar}
        disabled={loading !== null}
        style={{
          width: '100%', background: loading !== null ? '#14532d' : '#16a34a',
          color: '#fff', fontWeight: 700, fontSize: 14, padding: '14px 0',
          borderRadius: 10, border: 'none', cursor: loading !== null ? 'not-allowed' : 'pointer',
          transition: 'background .15s',
        }}
      >
        {loading === 'aprovando' ? 'Aprovando...' : '✅ Aprovar e Enviar Contrato'}
      </button>

      {!showRejeitar ? (
        <button
          onClick={() => setShowRejeitar(true)}
          disabled={loading !== null}
          style={{
            width: '100%', background: 'var(--admin-surf2)', color: 'var(--admin-text-2)',
            fontWeight: 500, fontSize: 13, padding: '11px 0',
            borderRadius: 10, border: '1px solid var(--admin-border2)', cursor: 'pointer',
            transition: 'background .15s',
          }}
        >
          Rejeitar pedido
        </button>
      ) : (
        <div style={{ background: 'var(--admin-surface)', border: `1px solid rgba(222,28,34,0.2)`, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontSize: 12, color: 'var(--admin-text-2)', fontWeight: 600 }}>Motivo da rejeição</label>
          <textarea
            value={motivoRejeicao}
            onChange={(e) => setMotivoRejeicao(e.target.value)}
            placeholder="Ex: Equipamento não disponível no estado de entrega."
            rows={3}
            style={{
              width: '100%', background: 'var(--admin-surf2)', border: '1px solid var(--admin-border2)',
              borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#e2e8f0',
              resize: 'none', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={rejeitar}
              disabled={loading !== null || !motivoRejeicao.trim()}
              style={{
                flex: 1, background: loading !== null || !motivoRejeicao.trim() ? '#7f1d1d' : RED,
                color: '#fff', fontWeight: 600, fontSize: 13, padding: '9px 0',
                borderRadius: 8, border: 'none', cursor: !motivoRejeicao.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading === 'rejeitando' ? 'Rejeitando...' : 'Confirmar rejeição'}
            </button>
            <button
              onClick={() => setShowRejeitar(false)}
              style={{ padding: '9px 16px', fontSize: 13, color: 'var(--admin-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
