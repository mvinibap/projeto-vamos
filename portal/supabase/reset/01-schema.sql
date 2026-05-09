-- ============================================================
-- 01-schema.sql
-- Limpa e recria toda a estrutura do banco
-- Execute PRIMEIRO no SQL Editor do Supabase
-- ============================================================

-- Limpa tudo
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS equipamentos CASCADE;
DROP SEQUENCE IF EXISTS pedido_seq;
DROP FUNCTION IF EXISTS set_updated_at CASCADE;
DROP FUNCTION IF EXISTS gerar_numero_pedido CASCADE;

-- Equipamentos
CREATE TABLE equipamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  categoria text NOT NULL CHECK (categoria IN ('retroescavadeira', 'trator', 'caminhao', 'guindaste', 'plataforma', 'compactador', 'outro')),
  descricao text,
  foto_url text,
  specs jsonb DEFAULT '{}',
  preco_dia decimal(10,2),
  preco_mes decimal(10,2),
  estado text NOT NULL,
  status text NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'indisponivel')),
  disponivel_a_partir_de date,
  created_at timestamptz DEFAULT now()
);

-- Pedidos
CREATE TABLE pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_pedido text UNIQUE NOT NULL,
  equipamento_id uuid REFERENCES equipamentos(id) ON DELETE RESTRICT,

  nome_empresa text NOT NULL,
  cnpj text NOT NULL,

  data_inicio date NOT NULL,
  data_fim date NOT NULL,

  estado_entrega text NOT NULL,
  cidade_entrega text NOT NULL,

  nome_responsavel text NOT NULL,
  telefone text NOT NULL,
  email text NOT NULL,

  status text NOT NULL DEFAULT 'novo' CHECK (
    status IN ('novo', 'em_analise', 'contrato_enviado', 'assinado', 'ativo', 'rejeitado')
  ),
  motivo_rejeicao text,
  cnpj_score jsonb,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger: atualiza updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger: gera numero_pedido sequencial (reinicia do 1)
CREATE SEQUENCE pedido_seq START 1;

CREATE OR REPLACE FUNCTION gerar_numero_pedido()
RETURNS trigger AS $$
BEGIN
  NEW.numero_pedido = 'VMS-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('pedido_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pedidos_numero
  BEFORE INSERT ON pedidos
  FOR EACH ROW EXECUTE FUNCTION gerar_numero_pedido();

-- RLS
ALTER TABLE equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read equipamentos"  ON equipamentos FOR SELECT USING (true);
CREATE POLICY "Public insert pedidos"     ON pedidos     FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read pedidos"       ON pedidos     FOR SELECT USING (true);
CREATE POLICY "Public update pedidos"     ON pedidos     FOR UPDATE USING (true);

-- Confirma
SELECT 'Schema recriado com sucesso' AS status;
