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
        <div style={{ position: 'relative', height: 168, background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', overflow: 'hidden' }}>
          {/* Placeholder SVG — shown until image loads or on error */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 302 168" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="302" height="168" fill="url(#ph)" />
            <defs><linearGradient id="ph" x1="0" y1="0" x2="302" y2="168" gradientUnits="userSpaceOnUse"><stop stopColor="#f1f5f9"/><stop offset="1" stopColor="#e2e8f0"/></linearGradient></defs>
            <path d="M110 100 h20 v-30 h12 l-20-26 -20 26 h12v30z M158 100 h34 v-20 h-34z M158 88 h8 v-12 h-8z M174 88 h8 v-12 h-8z" fill="#cbd5e1" fillRule="evenodd"/>
            <rect x="96" y="100" width="110" height="6" rx="2" fill="#cbd5e1"/>
            <circle cx="112" cy="112" r="6" fill="#cbd5e1"/>
            <circle cx="190" cy="112" r="6" fill="#cbd5e1"/>
          </svg>
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
