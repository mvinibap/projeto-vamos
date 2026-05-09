-- Atualização de status dos equipamentos para demo realista
-- 12 reservados (60%), 3 indisponíveis (15%), 5 disponíveis (25%)
-- Execute no SQL Editor do Supabase: https://supabase.com/dashboard/project/fqjemrggzikyrqoohgmx/sql

-- ── RESERVADOS (em locação ativa) ───────────────────────────────────────────
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-06-23' WHERE nome = 'Case 580N';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-06-08' WHERE nome = 'JCB 3CX';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-07-08' WHERE nome = 'Caterpillar 416F2';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-08-07' WHERE nome = 'John Deere 5075E';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-05-23' WHERE nome = 'New Holland TL5.80';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-09-06' WHERE nome = 'Massey Ferguson 4708';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-05-29' WHERE nome = 'Volvo FMX 440 Basculante';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-07-23' WHERE nome = 'Mercedes-Benz Actros 2651 Guincho';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-06-18' WHERE nome = 'Scania P360 Caçamba';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-05-19' WHERE nome = 'Liebherr LTM 1060-3.1';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-06-13' WHERE nome = 'JLG 600S Plataforma Telescópica';
UPDATE equipamentos SET status = 'reservado', disponivel_a_partir_de = '2026-07-03' WHERE nome = 'Dynapac CA2500D Rolo Compactador';

-- ── INDISPONÍVEIS (manutenção) ───────────────────────────────────────────────
UPDATE equipamentos SET status = 'indisponivel', disponivel_a_partir_de = NULL WHERE nome = 'Tadano GR-1000XL';
UPDATE equipamentos SET status = 'indisponivel', disponivel_a_partir_de = NULL WHERE nome = 'Hamm H11i Rolo Tandem';
UPDATE equipamentos SET status = 'indisponivel', disponivel_a_partir_de = NULL WHERE nome = 'Genie Z-60/37 FE Articulada';

-- ── DISPONÍVEIS (ociosos) ────────────────────────────────────────────────────
UPDATE equipamentos SET status = 'disponivel', disponivel_a_partir_de = NULL WHERE nome = 'Grove GMK3060L';
UPDATE equipamentos SET status = 'disponivel', disponivel_a_partir_de = NULL WHERE nome = 'Skyjack SJ9250 Tesoura';
UPDATE equipamentos SET status = 'disponivel', disponivel_a_partir_de = NULL WHERE nome = 'Manitou MRT 2150 Telehandler';
UPDATE equipamentos SET status = 'disponivel', disponivel_a_partir_de = NULL WHERE nome = 'Caterpillar 950M Carregadeira';
UPDATE equipamentos SET status = 'disponivel', disponivel_a_partir_de = NULL WHERE nome = 'Bobcat S650 Minicarregadeira';

-- ── Verificação ──────────────────────────────────────────────────────────────
SELECT status, COUNT(*) AS total
FROM equipamentos
GROUP BY status
ORDER BY total DESC;
