import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type Equipamento = {
  id: string
  nome: string
  categoria: string
  preco_dia: number | null
  status: 'disponivel' | 'reservado' | 'indisponivel'
  disponivel_a_partir_de: string | null
  localizacao?: string
  estado?: string
}

async function getEquipamentos(): Promise<Equipamento[]> {
  const { data } = await supabase
    .from('equipamentos')
    .select('*')
    .order('nome', { ascending: true })
  return (data ?? []) as Equipamento[]
}

const STATUS_CFG = {
  disponivel:    { label: 'Disponível',     bg: 'rgba(21,128,61,0.15)',  color: '#4ade80', border: 'rgba(34,197,94,0.25)' },
  reservado:     { label: 'Alugado',        bg: 'rgba(29,78,216,0.12)',  color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  indisponivel:  { label: 'Manutenção',     bg: 'rgba(153,27,27,0.12)',  color: '#f87171', border: 'rgba(239,68,68,0.25)' },
}

export default async function EquipamentosPage() {
  const equipamentos = await getEquipamentos()

  const total = equipamentos.length
  const disponiveis = equipamentos.filter(e => e.status === 'disponivel').length
  const reservados = equipamentos.filter(e => e.status === 'reservado').length
  const indisponiveis = equipamentos.filter(e => e.status === 'indisponivel').length

  const taxaOcupacao = total > 0 ? Math.round((reservados / total) * 100) : 0

  return (
    <main style={{ padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', marginBottom: 4 }}>
          Frota de Equipamentos
        </h1>
        <p style={{ fontSize: 13, color: '#475569' }}>Status de alocação em tempo real</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '18px 22px' }}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Total na frota</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>{total}</p>
        </div>
        <div style={{ background: 'rgba(21,128,61,0.06)', borderRadius: 12, border: '1px solid rgba(34,197,94,0.15)', padding: '18px 22px' }}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Disponíveis</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#4ade80', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>{disponiveis}</p>
        </div>
        <div style={{ background: 'rgba(29,78,216,0.06)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.15)', padding: '18px 22px' }}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Alugados</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#60a5fa', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>{reservados}</p>
        </div>
        <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', padding: '18px 22px' }}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Taxa de ocupação</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: taxaOcupacao >= 70 ? '#4ade80' : taxaOcupacao >= 40 ? '#facc15' : '#f87171', lineHeight: 1, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', letterSpacing: '-1px' }}>
            {taxaOcupacao}%
          </p>
        </div>
      </div>

      {/* Tabela */}
      <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              {['Equipamento', 'Categoria', 'Diária', 'Status', 'Disponível a partir de'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {equipamentos.map((e) => {
              const cfg = STATUS_CFG[e.status] ?? STATUS_CFG.disponivel
              return (
                <tr key={e.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 500 }}>
                    {e.nome}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>
                    {e.categoria ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {e.preco_dia ? `R$ ${e.preco_dia.toLocaleString('pt-BR')}/dia` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {cfg.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 12 }}>
                    {e.disponivel_a_partir_de
                      ? new Date(e.disponivel_a_partir_de).toLocaleDateString('pt-BR')
                      : e.status === 'disponivel' ? <span style={{ color: '#4ade80' }}>Agora</span> : '—'}
                  </td>
                </tr>
              )
            })}
            {equipamentos.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '60px 16px', textAlign: 'center', color: '#475569' }}>
                  Nenhum equipamento cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
