-- ============================================================
-- 05-inadimplencia.sql
-- Ajusta data_fim de alguns contratos ativos para popular
-- todos os grupos da tela de Inadimplência:
--   vencido / vence_hoje / vence_semana / ok
--
-- Hoje = 2026-05-09 (data base do dataset)
-- Execute APÓS 04-pedidos.sql
-- ============================================================

-- Contratos que vencem HOJE (2026-05-09)
UPDATE pedidos SET data_fim = '2026-05-09'
WHERE nome_empresa = 'Montagens Industriais Vitória'
  AND status = 'ativo' AND email = 'juliana@montagensind.com.br';

UPDATE pedidos SET data_fim = '2026-05-09'
WHERE nome_empresa = 'EnergiaVerde Projetos'
  AND status = 'ativo' AND email = 'roberto@energiaverde.com.br';

-- Contratos que vencem em até 7 dias (2026-05-10 a 2026-05-16)
UPDATE pedidos SET data_fim = '2026-05-12'
WHERE nome_empresa = 'Construtora Horizonte Ltda'
  AND status = 'ativo' AND email = 'cristiane@construtorah.com.br';

UPDATE pedidos SET data_fim = '2026-05-14'
WHERE nome_empresa = 'Movimenta Logística'
  AND status = 'ativo' AND email = 'renata@movimentalog.com.br';

UPDATE pedidos SET data_fim = '2026-05-15'
WHERE nome_empresa = 'Estradas e Pontes Construções'
  AND status = 'ativo' AND email = 'camila@estradasepon.com.br';

-- Verificação final
SELECT
  status,
  COUNT(*) AS total
FROM pedidos
GROUP BY status
ORDER BY total DESC;

SELECT
  CASE
    WHEN data_fim < CURRENT_DATE THEN 'vencido'
    WHEN data_fim = CURRENT_DATE THEN 'vence_hoje'
    WHEN data_fim <= CURRENT_DATE + INTERVAL '7 days' THEN 'vence_semana'
    ELSE 'ok'
  END AS risco,
  COUNT(*) AS contratos
FROM pedidos
WHERE status IN ('ativo', 'assinado', 'contrato_enviado')
GROUP BY 1
ORDER BY 1;
