-- Schema: Portal de Locação VAMOS para PMEs
-- Execute este arquivo no SQL Editor do Supabase

-- Equipamentos
create table if not exists equipamentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text not null check (categoria in ('retroescavadeira', 'trator', 'caminhao', 'guindaste', 'plataforma', 'compactador', 'outro')),
  descricao text,
  foto_url text,
  specs jsonb default '{}',
  preco_dia decimal(10,2),
  preco_mes decimal(10,2),
  estado text not null,
  status text not null default 'disponivel' check (status in ('disponivel', 'reservado', 'indisponivel')),
  disponivel_a_partir_de date,
  created_at timestamptz default now()
);

-- Pedidos (anônimos — sem FK para users)
create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  numero_pedido text unique not null,
  equipamento_id uuid references equipamentos(id) on delete restrict,

  -- Empresa
  nome_empresa text not null,
  cnpj text not null,

  -- Período
  data_inicio date not null,
  data_fim date not null,

  -- Entrega
  estado_entrega text not null,
  cidade_entrega text not null,

  -- Responsável
  nome_responsavel text not null,
  telefone text not null,
  email text not null,

  -- Status
  status text not null default 'novo' check (
    status in ('novo', 'em_analise', 'contrato_enviado', 'assinado', 'ativo', 'rejeitado')
  ),
  motivo_rejeicao text,
  cnpj_score jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger: atualiza updated_at automaticamente
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger pedidos_updated_at
  before update on pedidos
  for each row execute function set_updated_at();

-- Trigger: gera numero_pedido sequencial
create sequence if not exists pedido_seq start 1;

create or replace function gerar_numero_pedido()
returns trigger as $$
begin
  new.numero_pedido = 'VMS-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('pedido_seq')::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create trigger pedidos_numero
  before insert on pedidos
  for each row execute function gerar_numero_pedido();

-- RLS desabilitado para demo (habilitar em produção)
alter table equipamentos enable row level security;
alter table pedidos enable row level security;

create policy "Public read equipamentos" on equipamentos for select using (true);
create policy "Public insert pedidos" on pedidos for insert with check (true);
create policy "Public read pedidos" on pedidos for select using (true);
create policy "Public update pedidos" on pedidos for update using (true);
