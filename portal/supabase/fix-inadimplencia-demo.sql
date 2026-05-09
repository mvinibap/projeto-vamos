-- ============================================================
-- fix-inadimplencia-demo.sql
-- Garante que a tela de Inadimplência tenha dados em todos os grupos:
-- vencido / vence_hoje / vence_semana / ok
--
-- Hoje = 2026-05-09
-- Execute no SQL Editor do Supabase APÓS expand-frota-demo.sql
-- ============================================================

-- ── Diagnóstico atual ────────────────────────────────────────────────────────
-- Contratos ativos com data_fim no passado (já devem aparecer como VENCIDO):
--   Granja Santa Rita S.A.:      data_fim = 2026-04-03  (-36 dias)
--   Agromax Produções Ltda:      data_fim = 2026-04-17  (-22 dias)
--   Agropecuária Cerrado Verde:  data_fim = 2026-04-29  (-10 dias)
--   Terraplanagem Rápida Ltda:   data_fim = 2026-04-30  (-9 dias)
--   AgroPlus Insumos e Serviços: data_fim = 2026-05-03  (-6 dias)
--   Campo Largo Agronegócios:    data_fim = 2026-05-06  (-3 dias)
--
-- Status assinado/contrato_enviado com data_fim passada:
--   Indústria de Pré-Moldados:   data_fim = 2026-04-20  (assinado)
--   Tavares & Irmãos:            data_fim = 2026-04-26  (assinado)
--   Granja Santa Rita:           data_fim = 2026-04-28  (contrato_enviado)
--   Agromax (CE):                data_fim = 2026-04-07  (contrato_enviado)
--   Agromax (PA):                data_fim = 2026-04-22  (contrato_enviado)
--   EnergiaVerde (GO):           data_fim = 2026-04-05  (contrato_enviado)
-- ─────────────────────────────────────────────────────────────────────────────

-- PASSO 1: Adicionar contratos que vencem HOJE (2026-05-09)
-- Alterar 2 contratos ativo para vencerem hoje
UPDATE pedidos
SET data_fim = '2026-05-09'
WHERE nome_empresa = 'Montagens Industriais Vitória'
  AND status = 'ativo'
  AND email = 'juliana@montagensind.com.br';

UPDATE pedidos
SET data_fim = '2026-05-09'
WHERE nome_empresa = 'EnergiaVerde Projetos'
  AND status = 'ativo'
  AND email = 'roberto@energiaverde.com.br';

-- PASSO 2: Adicionar contratos que vencem em até 7 dias (2026-05-10 a 2026-05-16)
UPDATE pedidos
SET data_fim = '2026-05-12'
WHERE nome_empresa = 'Construtora Horizonte Ltda'
  AND status = 'ativo'
  AND email = 'cristiane@construtorah.com.br';

UPDATE pedidos
SET data_fim = '2026-05-14'
WHERE nome_empresa = 'Movimenta Logística'
  AND status = 'ativo'
  AND email = 'renata@movimentalog.com.br';

UPDATE pedidos
SET data_fim = '2026-05-15'
WHERE nome_empresa = 'Estradas e Pontes Construções'
  AND status = 'ativo'
  AND email = 'camila@estradasepon.com.br';

-- PASSO 3: Verificação — deve mostrar dados em todos os grupos
SELECT *
FROM (
  SELECT
    CASE
      WHEN data_fim < CURRENT_DATE THEN 'vencido'
      WHEN data_fim = CURRENT_DATE THEN 'vence_hoje'
      WHEN data_fim <= CURRENT_DATE + INTERVAL '7 days' THEN 'vence_semana'
      ELSE 'ok'
    END AS risco,
    COUNT(*) AS total,
    STRING_AGG(nome_empresa, ', ' ORDER BY data_fim) AS empresas
  FROM pedidos
  WHERE status IN ('ativo', 'assinado', 'contrato_enviado')
  GROUP BY 1
) t
ORDER BY
  CASE risco
    WHEN 'vencido' THEN 1
    WHEN 'vence_hoje' THEN 2
    WHEN 'vence_semana' THEN 3
    ELSE 4
  END;
