# Reset da base de dados — VAMOS Demo

Execute os arquivos **em ordem**, um por vez, no [SQL Editor do Supabase](https://supabase.com/dashboard/project/fqjemrggzikyrqoohgmx/sql).

| # | Arquivo | O que faz | Resultado esperado |
|---|---------|-----------|-------------------|
| 1 | `01-schema.sql` | Drop completo + recria tabelas, triggers, RLS e sequence | `Schema recriado com sucesso` |
| 2 | `02-equipamentos.sql` | Insere os 20 modelos base com UUIDs fixos | `equipamentos_inseridos: 20` |
| 3 | `03-frota-expand.sql` | Renomeia para `#01` + insere 58 unidades adicionais | Tabela com ~78 linhas, ~60% reservado |
| 4 | `04-pedidos.sql` | Insere 150 pedidos realistas com CNPJs e empresas variadas | `ativo: 37, novo: 30, em_analise: 28...` |
| 5 | `05-inadimplencia.sql` | Ajusta datas para popular todos os grupos de inadimplência | Grupos: vencido, vence_hoje, vence_semana, ok |
| 6 | `06-update-fotos.sql` | Atualiza `foto_url` dos equipamentos com imagens reais da VAMOS | Preview de `foto_url` atualizado por categoria |
| 7 | `07-catalogo-view.sql` | Cria a view `equipamentos_catalogo` (1 item por modelo) | `modelos_catalogo` com total de modelos únicos |

## Distribuição resultante

**Equipamentos (78 unidades)**
- ~47 reservados (60%)
- ~19 disponíveis (25%)
- ~12 em manutenção (15%)

**Pedidos (150)**
- ativo: 37
- novo: 30
- em_analise: 28
- contrato_enviado: 22
- assinado: 18
- rejeitado: 15

**Inadimplência**
- Vencidos: ~6 contratos (Granja Santa Rita, Agromax, Terraplanagem, etc.)
- Vence hoje: 2 contratos
- Vence em breve (≤7 dias): 3 contratos

## Notas

- Os UUIDs dos 20 equipamentos base são **fixos** — os pedidos em `04-pedidos.sql` os referenciam diretamente.
- O `numero_pedido` (VMS-2026-XXXX) é gerado automaticamente pelo trigger; a sequence reinicia do 1 no passo 01.
- Após o reset, a numeração começa em VMS-2026-0001.
- A view `equipamentos_catalogo` é criada no passo 07 para a home mostrar 1 item por modelo, enquanto o admin continua usando todas as unidades em `equipamentos`.
