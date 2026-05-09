import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const supabase = createClient(
  'https://fqjemrggzikyrqoohgmx.supabase.co',
  'sb_publishable_swOE5z4G1Bg4OaN82kXLUg_8Yr8iQUE'
)

function esc(v) {
  if (v === null) return 'NULL'
  return `'${String(v).replace(/'/g, "''")}'`
}

async function main() {
  // Busca os 150 pedidos mais recentes (os que acabamos de inserir)
  const { data, error } = await supabase
    .from('pedidos')
    .select('equipamento_id, nome_empresa, cnpj, data_inicio, data_fim, estado_entrega, cidade_entrega, nome_responsavel, telefone, email, status, motivo_rejeicao, created_at')
    .order('created_at', { ascending: false })
    .limit(150)

  if (error) { console.error(error.message); process.exit(1) }

  // Conta por status
  const dist = {}
  data.forEach(r => { dist[r.status] = (dist[r.status] || 0) + 1 })
  console.log('Distribuição:', dist)

  const now = new Date().toISOString()
  const lines = []

  lines.push(`-- ============================================================`)
  lines.push(`-- seed-pedidos-demo.sql`)
  lines.push(`-- Massa de dados para demo VP — ${data.length} pedidos realistas`)
  lines.push(`-- Gerado em: ${now}`)
  lines.push(`-- Distribuição: ${Object.entries(dist).map(([s,n]) => `${s}:${n}`).join(', ')}`)
  lines.push(`-- ============================================================`)
  lines.push(``)
  lines.push(`-- Limpa pedidos de demo anteriores (mantém pedidos manuais com outros emails)`)
  lines.push(`-- Execute no SQL Editor do Supabase`)
  lines.push(`DELETE FROM pedidos`)
  lines.push(`WHERE email ~ '@(construtorahorizonte|agrocerrado|terramax|infrabrasilsa|valeverdeltda|raposoconstrucoes|construmax|horizonte|serraauzl|berrocivil|litoral|obraprimaempreend|pinheirosouza|pantanal|frotatotal|rotacerta|logistica|caravellas|transbrasileiro|movimenta|sulexpresso|cerradoverde|boaesperanca|agroplus|grantasanta|cooperativaagro|campolargo|agromax|planaltocent|engenhariasubterranea|energiaverde|solarbrasil|pedreira|metalurgica|premoldados|estruturasmetalicas|montagens|processoindustrial|infraworks|obrasmunicipais|terraplanagem|saneamento|pavimenta|estradas)\.com\.br$';`)
  lines.push(``)

  // Constrói os INSERTs agrupados
  const cols = '(equipamento_id, nome_empresa, cnpj, data_inicio, data_fim, estado_entrega, cidade_entrega, nome_responsavel, telefone, email, status, motivo_rejeicao, created_at, updated_at)'

  // Agrupa por status para documentação
  const byStatus = {}
  data.forEach(r => {
    if (!byStatus[r.status]) byStatus[r.status] = []
    byStatus[r.status].push(r)
  })

  const statusOrder = ['ativo', 'assinado', 'contrato_enviado', 'em_analise', 'novo', 'rejeitado']

  for (const status of statusOrder) {
    const rows = byStatus[status]
    if (!rows || rows.length === 0) continue

    lines.push(`-- ── ${status.toUpperCase()} (${rows.length} pedidos) ${'─'.repeat(40)}`)

    for (const r of rows) {
      const created = r.created_at || now
      const vals = [
        esc(r.equipamento_id),
        esc(r.nome_empresa),
        esc(r.cnpj),
        esc(r.data_inicio),
        esc(r.data_fim),
        esc(r.estado_entrega),
        esc(r.cidade_entrega),
        esc(r.nome_responsavel),
        esc(r.telefone),
        esc(r.email),
        esc(r.status),
        esc(r.motivo_rejeicao),
        `'${created}'::timestamptz`,
        `'${created}'::timestamptz`,
      ].join(', ')

      lines.push(`INSERT INTO pedidos ${cols} VALUES (${vals});`)
    }
    lines.push(``)
  }

  lines.push(`-- ── Confirmação ──────────────────────────────────────────────────────────────`)
  lines.push(`SELECT status, COUNT(*) AS total`)
  lines.push(`FROM pedidos`)
  lines.push(`GROUP BY status`)
  lines.push(`ORDER BY total DESC;`)

  const sql = lines.join('\n')
  const outPath = new URL('../supabase/seed-pedidos-demo.sql', import.meta.url).pathname
  writeFileSync(outPath, sql, 'utf8')
  console.log(`\nEscrito: ${outPath}`)
  console.log(`Linhas: ${lines.length}`)
}

main().catch(console.error)
