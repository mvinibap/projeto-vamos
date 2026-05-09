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
    }}>
      <AdminSidebar triageCount={triageCount} />
      <div style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
