import { supabase } from '@/lib/supabase'
import AdminSidebar from '@/components/AdminSidebar'

export const dynamic = 'force-dynamic'

async function getTriageCount() {
  const { count } = await supabase
    .from('pedidos')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'novo')
  return count ?? 0
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const triageCount = await getTriageCount()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      color: '#fff',
      fontFamily: 'var(--font-sans, DM Sans, sans-serif)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top header */}
      <header style={{
        height: 72,
        background: '#0a111e',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 20,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://apisite.vamos.com.br/uploads/logo_vamos_pt_9b9c29956b_31f0a1c50e.svg"
          alt="Vamos"
          style={{ height: 52, width: 'auto', display: 'block' }}
        />
        <div style={{ width: 1, height: 32, background: '#1e293b', flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          Painel Admin
        </span>
      </header>

      {/* Body: sidebar + content */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <AdminSidebar triageCount={triageCount} />
        <div style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
