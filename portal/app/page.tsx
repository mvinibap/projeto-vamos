import Link from 'next/link'
import { supabase, type Equipamento } from '@/lib/supabase'
import { Suspense } from 'react'
import EquipamentoCard from '@/components/EquipamentoCard'
import CategoriaFilter from '@/components/CategoriaFilter'
import EstadoFilter from '@/components/EstadoFilter'
import HeroStats from '@/components/HeroStats'

const CATEGORIAS = [
  { id: 'todos', label: 'Ver todos' },
  { id: 'retroescavadeira', label: 'Retroescavadeira' },
  { id: 'trator', label: 'Trator' },
  { id: 'caminhao', label: 'Caminhão' },
  { id: 'guindaste', label: 'Guindaste' },
  { id: 'plataforma', label: 'Plataforma' },
  { id: 'compactador', label: 'Compactador' },
  { id: 'outro', label: 'Outros' },
]

async function getEquipamentos(categoria?: string, estado?: string): Promise<Equipamento[]> {
  let query = supabase.from('equipamentos_catalogo').select('*').order('nome')
  if (categoria && categoria !== 'todos') query = query.eq('categoria', categoria)
  if (estado) query = query.eq('estado', estado)
  const { data } = await query
  return (data ?? []) as Equipamento[]
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; estado?: string }>
}) {
  const params = await searchParams
  const categoria = params.categoria ?? 'todos'
  const estado = params.estado ?? ''
  const equipamentos = await getEquipamentos(categoria, estado)

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>

      {/* Header */}
      <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://apisite.vamos.com.br/uploads/logo_vamos_pt_9b9c29956b_31f0a1c50e.svg"
              alt="Vamos"
              style={{ height: 72, width: 'auto', display: 'block' }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>Locação de Equipamentos</span>
          </Link>
          <Link href="/admin" className="home-header-right" style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', textDecoration: 'none' }}>
            Área Administrativa →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '40px 24px 40px' }}>
        <div className="hero-grid" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div className="hero-parallax">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ width: 20, height: 2, background: 'var(--red)', display: 'block', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Locação de Frotas e Equipamentos
              </span>
            </div>
            <h1 className="font-display" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', color: 'var(--text)', marginBottom: 16 }}>
              Alugue{' '}
              <span style={{ color: 'var(--red)' }}>equipamentos pesados</span>{' '}
              para sua empresa
            </h1>
            <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 440, marginBottom: 28 }}>
              Retroescavadeiras, tratores, guindastes e mais — sem burocracia, sem visita comercial. Um especialista entra em contato para confirmar.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Link
                href="#catalogo"
                style={{ background: 'var(--red)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px 28px', borderRadius: 8, textDecoration: 'none', display: 'inline-block' }}
              >
                Ver equipamentos disponíveis
              </Link>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>Sem pagamento online</span>
            </div>
          </div>

          {/* Stats card */}
          <HeroStats />
        </div>
      </div>

      {/* Filtros */}
      <div id="catalogo" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 64, zIndex: 40 }}>
        <div className="filter-bar" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', gap: 6 }}>
          <CategoriaFilter categorias={CATEGORIAS} categoriaAtiva={categoria} estado={estado} />
          <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <Suspense fallback={null}>
              <EstadoFilter estadoAtivo={estado} categoria={categoria} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="home-main" style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px 64px' }}>
        {equipamentos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
            <p style={{ fontSize: 17 }}>Nenhum equipamento encontrado para esse filtro.</p>
            <Link href="/" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 600, marginTop: 8, display: 'inline-block' }}>
              Ver todos os equipamentos
            </Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500, marginBottom: 20 }}>
              {equipamentos.length} equipamento{equipamentos.length !== 1 ? 's' : ''} encontrado{equipamentos.length !== 1 ? 's' : ''}
            </p>
            <div className="eq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {equipamentos.map((eq, i) => (
                <div key={eq.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 11) * 40}ms` }}>
                  <EquipamentoCard equipamento={eq} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#111', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 24, fontSize: 13 }}>
        <span style={{ color: 'var(--red)', fontWeight: 700 }}>VAMOS</span> Locação © {new Date().getFullYear()} — Valores sujeitos a confirmação comercial.
        <span style={{ display: 'inline-block', margin: '0 12px', opacity: 0.3 }}>·</span>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: 13 }}>Área Administrativa</Link>
      </footer>
    </div>
  )
}
