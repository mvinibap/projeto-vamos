-- Demo data: pedidos para apresentação ao VP
-- UUIDs fixos dos equipamentos (sem subquery)
-- Execute no SQL Editor do Supabase

-- Limpa pedidos anteriores de teste (se houver)
DELETE FROM pedidos WHERE email LIKE '%@construtorahorizonte.com.br'
  OR email LIKE '%@agrocerrado.com.br'
  OR email LIKE '%@terramax.eng.br'
  OR email LIKE '%@infrabrasilsa.com.br'
  OR email LIKE '%@valeverdeltda.com.br'
  OR email LIKE '%@raposoconstrucoes.com.br';

-- 1. NOVO — Construtora em SP, quer retroescavadeira (Case 580N)
INSERT INTO pedidos (equipamento_id, nome_empresa, cnpj, data_inicio, data_fim, estado_entrega, cidade_entrega, nome_responsavel, telefone, email, status, created_at, updated_at)
VALUES ('71fd85ad-a6d1-4d21-84d8-bb3949641454', 'Construtora Horizonte Ltda', '45.670.123/0001-78', '2026-05-22', '2026-06-22', 'SP', 'São Paulo', 'Ricardo Mendes', '(11) 99234-5678', 'ricardo@construtorahorizonte.com.br', 'novo', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- 2. NOVO — Agropecuária em GO, quer trator (John Deere 5075E)
INSERT INTO pedidos (equipamento_id, nome_empresa, cnpj, data_inicio, data_fim, estado_entrega, cidade_entrega, nome_responsavel, telefone, email, status, created_at, updated_at)
VALUES ('02b71de7-dca4-455c-a6c7-68d7629cf8c9', 'Agropecuária Cerrado S.A.', '56.789.012/0001-00', '2026-06-01', '2026-08-31', 'GO', 'Rio Verde', 'Fernanda Oliveira', '(64) 98876-5432', 'fernanda@agrocerrado.com.br', 'novo', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours');

-- 3. NOVO — Engenharia em MG, quer caminhão (Volvo FMX 440)
INSERT INTO pedidos (equipamento_id, nome_empresa, cnpj, data_inicio, data_fim, estado_entrega, cidade_entrega, nome_responsavel, telefone, email, status, created_at, updated_at)
VALUES ('1a085892-a161-4934-bca1-8ce10c07db6b', 'Terramax Engenharia e Construção Ltda', '78.901.234/0001-05', '2026-06-05', '2026-07-05', 'MG', 'Belo Horizonte', 'Carlos Augusto Silva', '(31) 97654-3210', 'carlos@terramax.eng.br', 'novo', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- 4. CONTRATO ENVIADO — Infraestrutura no RJ, guindaste (Grove GMK3060L)
INSERT INTO pedidos (equipamento_id, nome_empresa, cnpj, data_inicio, data_fim, estado_entrega, cidade_entrega, nome_responsavel, telefone, email, status, created_at, updated_at, cnpj_score)
VALUES ('14ec6f76-fce6-4d86-8377-957971745111', 'Grupo Infraestrutura Brasil S.A.', '11.222.333/0001-81', '2026-05-13', '2026-05-28', 'RJ', 'Rio de Janeiro', 'Ana Paula Ferreira', '(21) 96543-2109', 'ana.ferreira@infrabrasilsa.com.br', 'contrato_enviado', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', '{"score": 87, "nivel_risco": "Baixo", "situacao_receita": "Ativa", "capital_social": "R$ 4.2M", "anos_atividade": 12}');

-- 5. CONTRATO ENVIADO — Mineração no PA, compactador (Dynapac CA2500D)
INSERT INTO pedidos (equipamento_id, nome_empresa, cnpj, data_inicio, data_fim, estado_entrega, cidade_entrega, nome_responsavel, telefone, email, status, created_at, updated_at, cnpj_score)
VALUES ('fe8bf06e-2675-430c-9ff5-4d2450ccf8f4', 'Mineração Vale Verde Ltda', '22.333.444/0001-81', '2026-05-15', '2026-08-15', 'PA', 'Parauapebas', 'Marcos Henrique Costa', '(94) 99321-0987', 'marcos@valeverdeltda.com.br', 'contrato_enviado', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days', '{"score": 68, "nivel_risco": "Médio", "situacao_receita": "Ativa", "capital_social": "R$ 890K", "anos_atividade": 4}');

-- 6. REJEITADO — Construtora na BA (JCB 3CX), score baixo
INSERT INTO pedidos (equipamento_id, nome_empresa, cnpj, data_inicio, data_fim, estado_entrega, cidade_entrega, nome_responsavel, telefone, email, status, motivo_rejeicao, created_at, updated_at, cnpj_score)
VALUES ('2e12bfb9-d6c8-42bf-92f9-32d5a24c091e', 'Construções Raposo & Filhos Ltda', '33.444.555/0001-81', '2026-05-10', '2026-06-10', 'BA', 'Salvador', 'Roberto Raposo', '(71) 98210-9876', 'roberto@raposoconstrucoes.com.br', 'rejeitado', 'CNPJ com pendências na Receita Federal e histórico de inadimplência. Score de crédito abaixo do mínimo exigido (31/100).', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days', '{"score": 31, "nivel_risco": "Alto", "situacao_receita": "Irregular", "capital_social": "R$ 80K", "anos_atividade": 1}');

-- Confirma
SELECT numero_pedido, nome_empresa, status, estado_entrega
FROM pedidos
ORDER BY created_at DESC;
