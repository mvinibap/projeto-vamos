'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-semibold text-green-400 mb-1">Contrato enviado!</p>
        <p className="text-sm text-gray-400">
          Link do contrato enviado para <strong>{email}</strong>
        </p>
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>1. Contrato gerado automaticamente</p>
          <p>2. E-mail enviado ao cliente</p>
          <p>3. Aguardando assinatura digital</p>
        </div>
      </div>
    )
  }

  if (!podeAprovar) return null

  return (
    <div className="space-y-3">
      <button
        onClick={aprovar}
        disabled={loading !== null}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-800 text-white font-semibold py-4 rounded-xl transition-colors"
      >
        {loading === 'aprovando' ? 'Aprovando...' : '✅ Aprovar e Enviar Contrato'}
      </button>

      {!showRejeitar ? (
        <button
          onClick={() => setShowRejeitar(true)}
          disabled={loading !== null}
          className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-colors text-sm"
        >
          Rejeitar pedido
        </button>
      ) : (
        <div className="bg-gray-900 border border-red-500/20 rounded-xl p-4 space-y-3">
          <label className="block text-sm text-gray-300 font-medium">Motivo da rejeição</label>
          <textarea
            value={motivoRejeicao}
            onChange={(e) => setMotivoRejeicao(e.target.value)}
            placeholder="Ex: Equipamento não disponível no estado de entrega."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={rejeitar}
              disabled={loading !== null || !motivoRejeicao.trim()}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-900 text-white font-medium py-2 rounded-lg transition-colors text-sm"
            >
              {loading === 'rejeitando' ? 'Rejeitando...' : 'Confirmar rejeição'}
            </button>
            <button
              onClick={() => setShowRejeitar(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
