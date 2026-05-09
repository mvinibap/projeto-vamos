import Link from 'next/link'

export default async function ConfirmacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ numero?: string }>
}) {
  const { numero } = await searchParams

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-display" style={{ background: '#de1c22', color: '#fff', fontWeight: 800, fontSize: 14, padding: '5px 8px', borderRadius: 4, lineHeight: 1 }}>
              VAMOS
            </span>
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={{ background: 'var(--bg)', borderRadius: 20, border: '1px solid var(--border)', padding: '48px 32px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 10 }}>
            Pedido enviado!
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 28 }}>
            Um especialista VAMOS entrará em contato em até 24 horas para confirmar os detalhes e dar continuidade ao processo.
          </p>

          {numero && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Número do pedido</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{numero}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Guarde este número para acompanhar seu pedido.</p>
            </div>
          )}

          <Link
            href="/"
            style={{ display: 'inline-block', background: '#de1c22', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 32px', borderRadius: 10, textDecoration: 'none' }}
          >
            Ver mais equipamentos
          </Link>
        </div>
      </main>
    </div>
  )
}
