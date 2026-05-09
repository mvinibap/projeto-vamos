import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fqjemrggzikyrqoohgmx.supabase.co',
  'sb_publishable_swOE5z4G1Bg4OaN82kXLUg_8Yr8iQUE'
)

// ── Dados base ──────────────────────────────────────────────────────────────

const EQUIPAMENTO_IDS = [
  '71fd85ad-a6d1-4d21-84d8-bb3949641454', // Case 580N - R$890 - SP
  '916dd0c8-4af4-4bf9-86dc-48f082079f32', // JLG 600S - R$680 - SP
  'b2c20136-c841-4130-84f4-1f6031bca7d8', // Genie Z-60 - R$590 - SP
  'd044466e-530f-423a-bec2-ecba49be8517', // Skyjack - R$480 - RS
  '2e12bfb9-d6c8-42bf-92f9-32d5a24c091e', // JCB 3CX - R$950 - MG
  'b6ad690d-c98e-49b1-ad1c-7fb64188de7a', // CAT 416F2 - R$1050 - RS
  '02b71de7-dca4-455c-a6c7-68d7629cf8c9', // John Deere - R$650 - MT
  '6491bd7a-1257-473e-a641-9fa69ecb7243', // New Holland - R$620 - GO
  'd315a690-baca-4bbc-87fd-e0eff80162a4', // Massey - R$750 - PR
  '1a085892-a161-4934-bca1-8ce10c07db6b', // Volvo FMX - R$1200 - SP
  '4e9c5c45-3f31-4209-8ef8-61663914d5d9', // MB Actros Guincho - R$1800 - SP
  '532dbacf-f3d8-4744-9b56-53a27849bf46', // Scania P360 - R$1100 - RJ
  '9fd82e09-be1e-4d09-8307-48086210efde', // Liebherr LTM - R$4500 - SP
  '14ec6f76-fce6-4d86-8377-957971745111', // Grove GMK - R$4200 - MG
  '05547144-bd34-495d-99f5-b4a5132d1414', // Tadano - R$6800 - RJ
  'fe8bf06e-2675-430c-9ff5-4d2450ccf8f4', // Dynapac Rolo - R$780 - MG
  '2d7a7d7f-37ef-46ef-8804-4d057fcf1600', // Hamm Rolo - R$820 - PR
  'c2f6fc1d-a93c-4b2c-bb38-a0dc594b08db', // Manitou - R$920 - GO
  'b04a8fcf-e038-42d1-809c-5857a72c9ce0', // CAT 950M - R$1350 - MT
  '431c75a8-ac3b-4bd3-9fa7-0c6bd3084da9', // Bobcat S650 - R$520 - SP
]

const EMPRESAS = [
  // Construção civil
  'Construtora Horizonte Ltda',
  'Edificações Serra Azul S.A.',
  'Construmax Obras e Serviços',
  'Tavares & Irmãos Construções',
  'CMG Engenharia e Construções',
  'Grupo Berro Civil',
  'Construtora Litoral Sul Ltda',
  'Edifica Construções Ltda',
  'Obra Prima Empreendimentos',
  'Pinheiro & Souza Construtora',
  // Transporte e logística
  'Transportadora Pantanal Ltda',
  'Frota Total Logística',
  'Rota Certa Transporte S.A.',
  'Logística Integrada do Norte',
  'Caravellas Transporte de Cargas',
  'Transbrasileiro Frotas Ltda',
  'Movimenta Logística',
  'Sul Expresso Transportes',
  // Agronegócio
  'Agropecuária Cerrado Verde',
  'Fazenda Boa Esperança Ltda',
  'AgroPlus Insumos e Serviços',
  'Granja Santa Rita S.A.',
  'Cooperativa Agroindustrial do Vale',
  'Campo Largo Agronegócios',
  'Agromax Produções Ltda',
  // Mineração e energia
  'Mineração Planalto Central',
  'Engenharia Subterrânea Ltda',
  'EnergiaVerde Projetos',
  'Solar Brasil Instalações',
  'Pedreira Bom Jesus',
  // Indústria
  'Metalúrgica Nordeste Ltda',
  'Indústria de Pré-Moldados Sul',
  'Fábrica de Estruturas Metálicas',
  'Montagens Industriais Vitória',
  'Processo Industrial Ltda',
  // Infraestrutura
  'Infraworks Pavimentação',
  'Obras Municipais Consultoria',
  'Terraplanagem Rápida Ltda',
  'Saneamento e Drenagem Ltda',
  'Pavimenta Engenharia',
  'Estradas e Pontes Construções',
]

const ESTADOS_DISTRIBUICAO = [
  // Mais frequentes — São Paulo domina
  'SP', 'SP', 'SP', 'SP', 'SP', 'SP', 'SP',
  'RJ', 'RJ', 'RJ', 'RJ',
  'MG', 'MG', 'MG', 'MG',
  'RS', 'RS', 'RS',
  'PR', 'PR', 'PR',
  'BA', 'BA',
  'GO', 'GO',
  'SC', 'SC',
  'MT', 'MT',
  'DF',
  'PE',
  'CE',
  'AM',
  'PA',
  'MS',
  'ES',
]

const CIDADES = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'Sorocaba', 'Ribeirão Preto', 'São Bernardo do Campo', 'Guarulhos', 'Osasco', 'Bauru', 'São José dos Campos'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'Campos dos Goytacazes', 'Macaé'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Montes Claros', 'Betim', 'Ipatinga'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Novo Hamburgo', 'Santa Maria'],
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Foz do Iguaçu', 'Ponta Grossa', 'Cascavel'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna'],
  GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Catalão'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau', 'Criciúma', 'Chapecó', 'Itajaí'],
  MT: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Sorriso', 'Lucas do Rio Verde'],
  DF: ['Brasília', 'Taguatinga', 'Ceilândia', 'Gama'],
  PE: ['Recife', 'Caruaru', 'Petrolina', 'Olinda', 'Jaboatão dos Guararapes'],
  CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Sobral', 'Maracanaú'],
  AM: ['Manaus', 'Parintins', 'Itacoatiara'],
  PA: ['Belém', 'Ananindeua', 'Santarém', 'Marabá'],
  MS: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá'],
  ES: ['Vitória', 'Vila Velha', 'Cariacica', 'Serra', 'Cachoeiro de Itapemirim'],
}

const RESPONSAVEIS = [
  'Carlos Eduardo Santos', 'Fernanda Lima Oliveira', 'Roberto Alves Machado',
  'Juliana Costa Ferreira', 'Alexandre Pereira Gomes', 'Mariana Souza Lopes',
  'Paulo Henrique Martins', 'Andressa Ribeiro Campos', 'Lucas Nunes Carvalho',
  'Tatiana Borges Ramos', 'Rodrigo Melo Azevedo', 'Cristiane Pinto Vieira',
  'Gabriel Teixeira Cruz', 'Amanda Freitas Barbosa', 'Eduardo Moreira Dias',
  'Patricia Nascimento Lima', 'Felipe Rodrigues Torres', 'Vanessa Mendes Araujo',
  'Marcos Vinícius Cunha', 'Renata Almeida Figueiredo', 'Diego Costa Andrade',
  'Aline Santos Batista', 'Gustavo Pereira Duarte', 'Larissa Oliveira Monteiro',
  'Henrique Fernandes Castro', 'Daniela Matos Correia', 'Bruno Carvalho Mesquita',
  'Isabela Lima Tavares', 'Thiago Rocha Medeiros', 'Camila Pires Cavalcante',
]

// ── Utilitários ──────────────────────────────────────────────────────────────

function gerarCNPJ() {
  // Gera CNPJ válido
  const n = () => Math.floor(Math.random() * 9)
  const d = Array.from({ length: 12 }, n)

  const calc = (arr, len) => {
    let soma = 0, pos = len - 7
    for (let i = len; i >= 1; i--) {
      soma += arr[len - i] * pos--
      if (pos < 2) pos = 9
    }
    const r = soma % 11
    return r < 2 ? 0 : 11 - r
  }

  d.push(calc(d, 12))
  d.push(calc(d, 13))

  const s = d.join('')
  return `${s.slice(0,2)}.${s.slice(2,5)}.${s.slice(5,8)}/${s.slice(8,12)}-${s.slice(12)}`
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function randomDaysAgo(maxDays) {
  return Math.floor(Math.random() * maxDays)
}

// ── Distribuição de status ────────────────────────────────────────────────────
// Total: 150
// novo: 30 (20%), em_analise: 28 (19%), contrato_enviado: 22 (15%)
// assinado: 18 (12%), ativo: 37 (25%), rejeitado: 15 (10%)

const STATUS_POOL = [
  ...Array(30).fill('novo'),
  ...Array(28).fill('em_analise'),
  ...Array(22).fill('contrato_enviado'),
  ...Array(18).fill('assinado'),
  ...Array(37).fill('ativo'),
  ...Array(15).fill('rejeitado'),
]

// Embaralhar
for (let i = STATUS_POOL.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [STATUS_POOL[i], STATUS_POOL[j]] = [STATUS_POOL[j], STATUS_POOL[i]]
}

const MOTIVOS_REJEICAO = [
  'CNPJ com restrições cadastrais na Receita Federal',
  'Empresa com menos de 6 meses de atividade',
  'Pendências financeiras identificadas no CNPJ',
  'Capital social insuficiente para o valor da locação',
  'Documentação incompleta após solicitação',
  'CNPJ em situação irregular junto à Receita Federal',
]

// ── Geração dos pedidos ───────────────────────────────────────────────────────

async function seed() {
  console.log('Iniciando seed de 150 pedidos...')

  const pedidos = []
  const hoje = new Date()

  for (let i = 0; i < 150; i++) {
    const status = STATUS_POOL[i]
    const empresa = pick(EMPRESAS)
    const estado = pick(ESTADOS_DISTRIBUICAO)
    const cidade = pick(CIDADES[estado] ?? ['Capital'])
    const equipId = pick(EQUIPAMENTO_IDS)
    const responsavel = pick(RESPONSAVEIS)
    const cnpj = gerarCNPJ()

    // Datas baseadas no status
    let dataInicioOffset, duracao

    if (status === 'ativo' || status === 'assinado' || status === 'contrato_enviado') {
      // Pedidos em andamento: início nos últimos 60 dias ou próximos 30 dias
      dataInicioOffset = -randomDaysAgo(60) + randomDaysAgo(30) - 30
      duracao = 30 + randomDaysAgo(150)
    } else if (status === 'rejeitado' || status === 'em_analise') {
      // Pedidos antigos que não avançaram
      dataInicioOffset = -randomDaysAgo(90) + 10
      duracao = 30 + randomDaysAgo(90)
    } else {
      // novos: datas futuras
      dataInicioOffset = 5 + randomDaysAgo(60)
      duracao = 30 + randomDaysAgo(120)
    }

    const dataInicio = addDays(hoje, dataInicioOffset)
    const dataFim = addDays(dataInicio, Math.max(duracao, 30))

    // created_at: retroativo baseado no status
    const createdDaysAgo = status === 'novo' ? randomDaysAgo(7)
      : status === 'em_analise' ? 3 + randomDaysAgo(20)
      : status === 'contrato_enviado' ? 10 + randomDaysAgo(30)
      : status === 'assinado' ? 20 + randomDaysAgo(40)
      : status === 'ativo' ? 30 + randomDaysAgo(60)
      : 15 + randomDaysAgo(45) // rejeitado

    const createdAt = new Date(hoje)
    createdAt.setDate(createdAt.getDate() - createdDaysAgo)

    const primeiroNome = responsavel.split(' ')[0].toLowerCase()
    const dominio = empresa.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 12)
    const email = `${primeiroNome}@${dominio}.com.br`

    const ddd = { SP: '11', RJ: '21', MG: '31', RS: '51', PR: '41', BA: '71',
      GO: '62', SC: '48', MT: '65', DF: '61', PE: '81', CE: '85', AM: '92',
      PA: '91', MS: '67', ES: '27' }[estado] ?? '11'

    const tel = `(${ddd}) 9${String(Math.floor(Math.random() * 90000000 + 10000000)).padStart(8,'0').slice(0,4)}-${String(Math.floor(Math.random() * 9000 + 1000))}`

    pedidos.push({
      equipamento_id: equipId,
      nome_empresa: empresa,
      cnpj: cnpj.replace(/[^\d]/g, ''),
      data_inicio: dataInicio,
      data_fim: dataFim,
      estado_entrega: estado,
      cidade_entrega: cidade,
      nome_responsavel: responsavel,
      telefone: tel,
      email,
      status,
      motivo_rejeicao: status === 'rejeitado' ? pick(MOTIVOS_REJEICAO) : null,
    })
  }

  // Inserir em batches de 25 para evitar timeout
  const BATCH = 25
  let total = 0
  for (let i = 0; i < pedidos.length; i += BATCH) {
    const batch = pedidos.slice(i, i + BATCH)
    const { data, error } = await supabase.from('pedidos').insert(batch).select('id')
    if (error) {
      console.error(`Erro no batch ${i / BATCH + 1}:`, error.message)
    } else {
      total += data.length
      console.log(`Batch ${i / BATCH + 1}: ${data.length} pedidos inseridos (total: ${total})`)
    }
  }

  console.log(`\nSeed completo: ${total} pedidos inseridos.`)

  // Resumo de distribuição
  const { data: counts } = await supabase
    .from('pedidos')
    .select('status')

  const dist = {}
  counts?.forEach(p => { dist[p.status] = (dist[p.status] || 0) + 1 })
  console.log('\nDistribuição final no banco:')
  Object.entries(dist).sort(([,a],[,b]) => b - a).forEach(([s, n]) => {
    console.log(`  ${s.padEnd(20)} ${n}`)
  })
}

seed().catch(console.error)
