import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EquipamentoFoto from '@/components/EquipamentoFoto'

async function getEquipamento(id: string) {
  const { data } = await supabase.from('equipamentos').select('*').eq('id', id).single()
  return data
}

export default async function EquipamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const eq = await getEquipamento(id)
  if (!eq) notFound()

  const disponivel = eq.status === 'disponivel'

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 896, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', textDecoration: 'none' }}>
            ← Voltar
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <span className="font-display" style={{ background: 'var(--red)', color: '#fff', fontWeight: 800, fontSize: 14, padding: '5px 8px', borderRadius: 4, lineHeight: 1 }}>
              VAMOS
            </span>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 896, margin: '0 auto', padding: '24px 24px 64px' }}>
        <div style={{ background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>

          <EquipamentoFoto src={eq.foto_url} alt={eq.nome} />

          <div style={{ padding: '28px 32px 32px' }}>
            {/* Título + Preço */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
              <div>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 4 }}>
                  {eq.nome}
                </h1>
                <p style={{ fontSize: 14, color: 'var(--muted)', textTransform: 'capitalize' }}>
                  {eq.categoria.replace('_', ' ')} · {eq.estado}
                </p>
              </div>
              {eq.preco_dia && (
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>A partir de</p>
                  <p className="font-display" style={{ fontSize: 32, fontWeight: 800, color: 'var(--red)', letterSpacing: '-1px', lineHeight: 1 }}>
                    R$ {eq.preco_dia.toLocaleString('pt-BR')}
                    <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--muted)' }}>/dia</span>
                  </p>
                  {eq.preco_mes && (
                    <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                      ou R$ {eq.preco_mes.toLocaleString('pt-BR')}/mês
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Frete a consultar</p>
                </div>
              )}
            </div>

            {/* Disponibilidade */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 600, marginBottom: 24,
              ...(disponivel
                ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
                : { background: '#fefce8', color: '#b45309', border: '1px solid #fde68a' })
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: disponivel ? '#16a34a' : '#f59e0b', display: 'block' }} />
              {disponivel
                ? 'Disponível para locação'
                : `Reservado${eq.disponivel_a_partir_de ? ` — disponível a partir de ${new Date(eq.disponivel_a_partir_de).toLocaleDateString('pt-BR')}` : ''}`
              }
            </div>

            {/* Descrição */}
            {eq.descricao && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Sobre o equipamento</h2>
                <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7 }}>{eq.descricao}</p>
              </div>
            )}

            {/* Specs */}
            {eq.specs && Object.keys(eq.specs).length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Especificações técnicas</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {Object.entries(eq.specs as Record<string, string>).map(([key, value]) => (
                    <div key={key} style={{ background: 'var(--surface)', borderRadius: 10, padding: 12, border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'capitalize', marginBottom: 4 }}>{key.replace(/_/g, ' ')}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
              {disponivel ? (
                <Link
                  href={`/pedido?equipamento=${eq.id}`}
                  style={{ display: 'inline-block', background: 'var(--red)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 10, textDecoration: 'none' }}
                >
                  Solicitar Locação
                </Link>
              ) : (
                <button
                  disabled
                  style={{ background: 'var(--border)', color: 'var(--muted)', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 10, border: 'none', cursor: 'not-allowed' }}
                >
                  Equipamento Reservado
                </button>
              )}
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
                Sem pagamento online. Um especialista VAMOS entrará em contato para confirmar o pedido.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
