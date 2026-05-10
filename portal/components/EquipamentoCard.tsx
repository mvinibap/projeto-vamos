'use client'

import Link from 'next/link'
import type { Equipamento } from '@/lib/supabase'

const STATUS_CONFIG: Record<Equipamento['status'], { label: string; style: React.CSSProperties }> = {
  disponivel:   { label: 'Disponível',   style: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' } },
  reservado:    { label: 'Reservado',    style: { background: '#fefce8', color: '#b45309', border: '1px solid #fde68a' } },
  indisponivel: { label: 'Indisponível', style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' } },
}

export default function EquipamentoCard({ equipamento: eq }: { equipamento: Equipamento }) {
  const status = STATUS_CONFIG[eq.status]

  return (
    <Link href={`/equipamentos/${eq.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', transition: 'box-shadow .2s, transform .2s', cursor: 'pointer' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.09)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none' }}
      >
        {/* Foto */}
        <div style={{ position: 'relative', height: 168, background: 'var(--surface)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#d1d5db' }}>
            🏗️
          </div>
          {eq.foto_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={eq.foto_url}
              alt={eq.nome}
              width={302}
              height={168}
              loading="lazy"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 9999, ...status.style }}>
            {status.label}
          </span>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '14px 16px 16px' }}>
          <p className="font-display" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 3 }}>
            {eq.nome}
          </p>
          <p style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'capitalize', marginBottom: 12 }}>
            {eq.categoria.replace('_', ' ')} · {eq.estado}
          </p>

          {eq.preco_dia ? (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 1 }}>A partir de</p>
              <p className="font-display" style={{ fontSize: 20, fontWeight: 800, color: 'var(--red)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                R$ {eq.preco_dia.toLocaleString('pt-BR')}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)' }}>/dia</span>
              </p>
              {eq.preco_mes && (
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  ou R$ {eq.preco_mes.toLocaleString('pt-BR')}/mês
                </p>
              )}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: 12 }}>Consulte o preço</p>
          )}
        </div>
      </div>
    </Link>
  )
}
