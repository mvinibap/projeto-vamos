-- ============================================================
-- 07-catalogo-view.sql
-- Cria view de catalogo para a home do cliente
-- Execute APOS 06-update-fotos.sql
-- ============================================================

DROP VIEW IF EXISTS equipamentos_catalogo;

CREATE VIEW equipamentos_catalogo AS
WITH base AS (
  SELECT
    e.*,
    regexp_replace(e.nome, '\s+#\d+$', '') AS nome_base,
    COALESCE((substring(e.nome FROM '#([0-9]+)$'))::int, 999999) AS numero_unidade
  FROM equipamentos e
),
ranqueado AS (
  SELECT
    b.*,
    COUNT(*) OVER (PARTITION BY b.nome_base) AS quantidade_unidades,
    COUNT(*) FILTER (WHERE b.status = 'disponivel') OVER (PARTITION BY b.nome_base) AS quantidade_disponivel,
    ROW_NUMBER() OVER (
      PARTITION BY b.nome_base
      ORDER BY
        CASE b.status
          WHEN 'disponivel' THEN 0
          WHEN 'reservado' THEN 1
          ELSE 2
        END,
        b.numero_unidade,
        b.nome
    ) AS rn
  FROM base b
)
SELECT
  id,
  nome_base AS nome,
  categoria,
  descricao,
  foto_url,
  specs,
  preco_dia,
  preco_mes,
  estado,
  status,
  disponivel_a_partir_de,
  created_at,
  quantidade_unidades,
  quantidade_disponivel
FROM ranqueado
WHERE rn = 1;

-- Confirma
SELECT COUNT(*) AS modelos_catalogo FROM equipamentos_catalogo;
