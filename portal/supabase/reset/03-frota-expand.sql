-- ============================================================
-- 03-frota-expand.sql
-- Expande de 20 modelos para 78 unidades físicas
-- Execute APÓS 02-equipamentos.sql
-- ============================================================

-- Execute no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/fqjemrggzikyrqoohgmx/sql
-- ============================================================

-- ── PASSO 1: Renomear + atualizar status das 20 unidades originais ───────────

-- Retroescavadeiras
UPDATE equipamentos SET nome = 'Case 580N #01',          status = 'reservado',    disponivel_a_partir_de = '2026-06-23', estado = 'SP' WHERE nome = 'Case 580N';
UPDATE equipamentos SET nome = 'JCB 3CX #01',            status = 'reservado',    disponivel_a_partir_de = '2026-06-08', estado = 'MG' WHERE nome = 'JCB 3CX';
UPDATE equipamentos SET nome = 'Caterpillar 416F2 #01',  status = 'reservado',    disponivel_a_partir_de = '2026-07-08', estado = 'RS' WHERE nome = 'Caterpillar 416F2';

-- Tratores
UPDATE equipamentos SET nome = 'John Deere 5075E #01',   status = 'reservado',    disponivel_a_partir_de = '2026-08-07', estado = 'MT' WHERE nome = 'John Deere 5075E';
UPDATE equipamentos SET nome = 'New Holland TL5.80 #01', status = 'reservado',    disponivel_a_partir_de = '2026-05-23', estado = 'GO' WHERE nome = 'New Holland TL5.80';
UPDATE equipamentos SET nome = 'Massey Ferguson 4708 #01', status = 'reservado',  disponivel_a_partir_de = '2026-09-06', estado = 'PR' WHERE nome = 'Massey Ferguson 4708';

-- Caminhões
UPDATE equipamentos SET nome = 'Volvo FMX 440 Basculante #01',      status = 'reservado',    disponivel_a_partir_de = '2026-05-29', estado = 'SP' WHERE nome = 'Volvo FMX 440 Basculante';
UPDATE equipamentos SET nome = 'Mercedes-Benz Actros 2651 #01',     status = 'reservado',    disponivel_a_partir_de = '2026-07-23', estado = 'SP' WHERE nome = 'Mercedes-Benz Actros 2651 Guincho';
UPDATE equipamentos SET nome = 'Scania P360 Caçamba #01',           status = 'reservado',    disponivel_a_partir_de = '2026-06-18', estado = 'RJ' WHERE nome = 'Scania P360 Caçamba';

-- Guindastes
UPDATE equipamentos SET nome = 'Liebherr LTM 1060 #01',    status = 'reservado',    disponivel_a_partir_de = '2026-05-19', estado = 'SP' WHERE nome = 'Liebherr LTM 1060-3.1';
UPDATE equipamentos SET nome = 'Grove GMK3060L #01',        status = 'reservado',    disponivel_a_partir_de = '2026-07-12', estado = 'MG' WHERE nome = 'Grove GMK3060L';
UPDATE equipamentos SET nome = 'Tadano GR-1000XL #01',      status = 'indisponivel', disponivel_a_partir_de = NULL,          estado = 'RJ' WHERE nome = 'Tadano GR-1000XL';

-- Plataformas
UPDATE equipamentos SET nome = 'JLG 600S Plataforma #01',  status = 'reservado',    disponivel_a_partir_de = '2026-06-13', estado = 'SP' WHERE nome = 'JLG 600S Plataforma Telescópica';
UPDATE equipamentos SET nome = 'Genie Z-60/37 FE #01',     status = 'indisponivel', disponivel_a_partir_de = NULL,          estado = 'SP' WHERE nome = 'Genie Z-60/37 FE Articulada';
UPDATE equipamentos SET nome = 'Skyjack SJ9250 #01',        status = 'reservado',    disponivel_a_partir_de = '2026-06-05', estado = 'RS' WHERE nome = 'Skyjack SJ9250 Tesoura';

-- Compactadores
UPDATE equipamentos SET nome = 'Dynapac CA2500D #01',      status = 'reservado',    disponivel_a_partir_de = '2026-07-03', estado = 'MG' WHERE nome = 'Dynapac CA2500D Rolo Compactador';
UPDATE equipamentos SET nome = 'Hamm H11i Rolo Tandem #01',status = 'indisponivel', disponivel_a_partir_de = NULL,          estado = 'PR' WHERE nome = 'Hamm H11i Rolo Tandem';

-- Outros
UPDATE equipamentos SET nome = 'Manitou MRT 2150 #01',     status = 'reservado',    disponivel_a_partir_de = '2026-06-20', estado = 'GO' WHERE nome = 'Manitou MRT 2150 Telehandler';
UPDATE equipamentos SET nome = 'Caterpillar 950M #01',     status = 'disponivel',   disponivel_a_partir_de = NULL,          estado = 'MT' WHERE nome = 'Caterpillar 950M Carregadeira';
UPDATE equipamentos SET nome = 'Bobcat S650 #01',          status = 'disponivel',   disponivel_a_partir_de = NULL,          estado = 'SP' WHERE nome = 'Bobcat S650 Minicarregadeira';


-- ── PASSO 2: Inserir unidades adicionais #02, #03, ... ──────────────────────

INSERT INTO equipamentos (nome, categoria, descricao, foto_url, specs, preco_dia, preco_mes, estado, status, disponivel_a_partir_de) VALUES

-- ── Case 580N: 8 unidades totais (+7) ───────────────────────────────────────
('Case 580N #02', 'retroescavadeira', 'Retroescavadeira com 87cv de potência, ideal para obras de pequeno e médio porte.', 'https://images.vamos.com.br/case-580n.jpg', '{"potencia": "87 cv", "peso_operacional": "7.500 kg", "capacidade_balde": "0,28 m³"}', 890.00, 18500.00, 'MG', 'reservado',    '2026-07-15'),
('Case 580N #03', 'retroescavadeira', 'Retroescavadeira com 87cv de potência, ideal para obras de pequeno e médio porte.', 'https://images.vamos.com.br/case-580n.jpg', '{"potencia": "87 cv", "peso_operacional": "7.500 kg", "capacidade_balde": "0,28 m³"}', 890.00, 18500.00, 'PR', 'reservado',    '2026-06-30'),
('Case 580N #04', 'retroescavadeira', 'Retroescavadeira com 87cv de potência, ideal para obras de pequeno e médio porte.', 'https://images.vamos.com.br/case-580n.jpg', '{"potencia": "87 cv", "peso_operacional": "7.500 kg", "capacidade_balde": "0,28 m³"}', 890.00, 18500.00, 'GO', 'indisponivel', NULL),
('Case 580N #05', 'retroescavadeira', 'Retroescavadeira com 87cv de potência, ideal para obras de pequeno e médio porte.', 'https://images.vamos.com.br/case-580n.jpg', '{"potencia": "87 cv", "peso_operacional": "7.500 kg", "capacidade_balde": "0,28 m³"}', 890.00, 18500.00, 'BA', 'reservado',    '2026-08-20'),
('Case 580N #06', 'retroescavadeira', 'Retroescavadeira com 87cv de potência, ideal para obras de pequeno e médio porte.', 'https://images.vamos.com.br/case-580n.jpg', '{"potencia": "87 cv", "peso_operacional": "7.500 kg", "capacidade_balde": "0,28 m³"}', 890.00, 18500.00, 'RJ', 'disponivel',   NULL),
('Case 580N #07', 'retroescavadeira', 'Retroescavadeira com 87cv de potência, ideal para obras de pequeno e médio porte.', 'https://images.vamos.com.br/case-580n.jpg', '{"potencia": "87 cv", "peso_operacional": "7.500 kg", "capacidade_balde": "0,28 m³"}', 890.00, 18500.00, 'SC', 'disponivel',   NULL),
('Case 580N #08', 'retroescavadeira', 'Retroescavadeira com 87cv de potência, ideal para obras de pequeno e médio porte.', 'https://images.vamos.com.br/case-580n.jpg', '{"potencia": "87 cv", "peso_operacional": "7.500 kg", "capacidade_balde": "0,28 m³"}', 890.00, 18500.00, 'PE', 'reservado',    '2026-09-10'),

-- ── JCB 3CX: 6 unidades totais (+5) ─────────────────────────────────────────
('JCB 3CX #02', 'retroescavadeira', 'Retroescavadeira versátil com transmissão powershift, alta produtividade em obras civis.', 'https://images.vamos.com.br/jcb-3cx.jpg', '{"potencia": "74 cv", "peso_operacional": "8.200 kg", "capacidade_balde": "0,30 m³"}', 950.00, 19800.00, 'SP', 'reservado',    '2026-07-01'),
('JCB 3CX #03', 'retroescavadeira', 'Retroescavadeira versátil com transmissão powershift, alta produtividade em obras civis.', 'https://images.vamos.com.br/jcb-3cx.jpg', '{"potencia": "74 cv", "peso_operacional": "8.200 kg", "capacidade_balde": "0,30 m³"}', 950.00, 19800.00, 'RS', 'reservado',    '2026-05-25'),
('JCB 3CX #04', 'retroescavadeira', 'Retroescavadeira versátil com transmissão powershift, alta produtividade em obras civis.', 'https://images.vamos.com.br/jcb-3cx.jpg', '{"potencia": "74 cv", "peso_operacional": "8.200 kg", "capacidade_balde": "0,30 m³"}', 950.00, 19800.00, 'PR', 'indisponivel', NULL),
('JCB 3CX #05', 'retroescavadeira', 'Retroescavadeira versátil com transmissão powershift, alta produtividade em obras civis.', 'https://images.vamos.com.br/jcb-3cx.jpg', '{"potencia": "74 cv", "peso_operacional": "8.200 kg", "capacidade_balde": "0,30 m³"}', 950.00, 19800.00, 'RJ', 'reservado',    '2026-06-18'),
('JCB 3CX #06', 'retroescavadeira', 'Retroescavadeira versátil com transmissão powershift, alta produtividade em obras civis.', 'https://images.vamos.com.br/jcb-3cx.jpg', '{"potencia": "74 cv", "peso_operacional": "8.200 kg", "capacidade_balde": "0,30 m³"}', 950.00, 19800.00, 'MT', 'disponivel',   NULL),

-- ── Caterpillar 416F2: 5 unidades totais (+4) ────────────────────────────────
('Caterpillar 416F2 #02', 'retroescavadeira', 'Retroescavadeira Cat com tração 4x4, excelente para terrenos irregulares.', 'https://images.vamos.com.br/cat-416f2.jpg', '{"potencia": "93 cv", "peso_operacional": "8.800 kg", "profundidade_escavacao": "5,9 m"}', 1050.00, 21500.00, 'SP', 'reservado',    '2026-06-14'),
('Caterpillar 416F2 #03', 'retroescavadeira', 'Retroescavadeira Cat com tração 4x4, excelente para terrenos irregulares.', 'https://images.vamos.com.br/cat-416f2.jpg', '{"potencia": "93 cv", "peso_operacional": "8.800 kg", "profundidade_escavacao": "5,9 m"}', 1050.00, 21500.00, 'MG', 'indisponivel', NULL),
('Caterpillar 416F2 #04', 'retroescavadeira', 'Retroescavadeira Cat com tração 4x4, excelente para terrenos irregulares.', 'https://images.vamos.com.br/cat-416f2.jpg', '{"potencia": "93 cv", "peso_operacional": "8.800 kg", "profundidade_escavacao": "5,9 m"}', 1050.00, 21500.00, 'GO', 'reservado',    '2026-07-22'),
('Caterpillar 416F2 #05', 'retroescavadeira', 'Retroescavadeira Cat com tração 4x4, excelente para terrenos irregulares.', 'https://images.vamos.com.br/cat-416f2.jpg', '{"potencia": "93 cv", "peso_operacional": "8.800 kg", "profundidade_escavacao": "5,9 m"}', 1050.00, 21500.00, 'PR', 'disponivel',   NULL),

-- ── John Deere 5075E: 5 unidades totais (+4) ─────────────────────────────────
('John Deere 5075E #02', 'trator', 'Trator agrícola 75cv, versátil para preparo de solo, plantio e colheita.', 'https://images.vamos.com.br/jd-5075e.jpg', '{"potencia": "75 cv", "tracao": "4x4", "transmissao": "PowerReverser 12x12"}', 650.00, 13500.00, 'GO', 'reservado',    '2026-06-05'),
('John Deere 5075E #03', 'trator', 'Trator agrícola 75cv, versátil para preparo de solo, plantio e colheita.', 'https://images.vamos.com.br/jd-5075e.jpg', '{"potencia": "75 cv", "tracao": "4x4", "transmissao": "PowerReverser 12x12"}', 650.00, 13500.00, 'PR', 'indisponivel', NULL),
('John Deere 5075E #04', 'trator', 'Trator agrícola 75cv, versátil para preparo de solo, plantio e colheita.', 'https://images.vamos.com.br/jd-5075e.jpg', '{"potencia": "75 cv", "tracao": "4x4", "transmissao": "PowerReverser 12x12"}', 650.00, 13500.00, 'MS', 'reservado',    '2026-08-15'),
('John Deere 5075E #05', 'trator', 'Trator agrícola 75cv, versátil para preparo de solo, plantio e colheita.', 'https://images.vamos.com.br/jd-5075e.jpg', '{"potencia": "75 cv", "tracao": "4x4", "transmissao": "PowerReverser 12x12"}', 650.00, 13500.00, 'BA', 'disponivel',   NULL),

-- ── New Holland TL5.80: 4 unidades totais (+3) ───────────────────────────────
('New Holland TL5.80 #02', 'trator', 'Trator compacto e robusto, ideal para pastagem, fruticultura e serviços gerais.', 'https://images.vamos.com.br/nh-tl580.jpg', '{"potencia": "80 cv", "tracao": "4x4", "transmissao": "Sincronizada 8x8"}', 620.00, 12800.00, 'SP', 'reservado',    '2026-06-28'),
('New Holland TL5.80 #03', 'trator', 'Trator compacto e robusto, ideal para pastagem, fruticultura e serviços gerais.', 'https://images.vamos.com.br/nh-tl580.jpg', '{"potencia": "80 cv", "tracao": "4x4", "transmissao": "Sincronizada 8x8"}', 620.00, 12800.00, 'PR', 'indisponivel', NULL),
('New Holland TL5.80 #04', 'trator', 'Trator compacto e robusto, ideal para pastagem, fruticultura e serviços gerais.', 'https://images.vamos.com.br/nh-tl580.jpg', '{"potencia": "80 cv", "tracao": "4x4", "transmissao": "Sincronizada 8x8"}', 620.00, 12800.00, 'MG', 'disponivel',   NULL),

-- ── Massey Ferguson 4708: 4 unidades totais (+3) ─────────────────────────────
('Massey Ferguson 4708 #02', 'trator', 'Trator de médio porte com cabine climatizada para operações longas com conforto.', 'https://images.vamos.com.br/mf-4708.jpg', '{"potencia": "85 cv", "tracao": "4x4", "cabine": "Climatizada"}', 750.00, 15500.00, 'RS', 'reservado',  '2026-07-18'),
('Massey Ferguson 4708 #03', 'trator', 'Trator de médio porte com cabine climatizada para operações longas com conforto.', 'https://images.vamos.com.br/mf-4708.jpg', '{"potencia": "85 cv", "tracao": "4x4", "cabine": "Climatizada"}', 750.00, 15500.00, 'MS', 'reservado',  '2026-06-10'),
('Massey Ferguson 4708 #04', 'trator', 'Trator de médio porte com cabine climatizada para operações longas com conforto.', 'https://images.vamos.com.br/mf-4708.jpg', '{"potencia": "85 cv", "tracao": "4x4", "cabine": "Climatizada"}', 750.00, 15500.00, 'MT', 'disponivel', NULL),

-- ── Volvo FMX 440 Basculante: 5 unidades totais (+4) ─────────────────────────
('Volvo FMX 440 Basculante #02', 'caminhao', 'Caminhão basculante 6x4 robusto para transporte de terra, brita e materiais de construção.', 'https://images.vamos.com.br/volvo-fmx440.jpg', '{"potencia": "440 cv", "configuracao": "6x4", "volume_cacamba": "10 m³"}', 1200.00, 24500.00, 'RJ', 'reservado',    '2026-05-22'),
('Volvo FMX 440 Basculante #03', 'caminhao', 'Caminhão basculante 6x4 robusto para transporte de terra, brita e materiais de construção.', 'https://images.vamos.com.br/volvo-fmx440.jpg', '{"potencia": "440 cv", "configuracao": "6x4", "volume_cacamba": "10 m³"}', 1200.00, 24500.00, 'MG', 'reservado',    '2026-08-04'),
('Volvo FMX 440 Basculante #04', 'caminhao', 'Caminhão basculante 6x4 robusto para transporte de terra, brita e materiais de construção.', 'https://images.vamos.com.br/volvo-fmx440.jpg', '{"potencia": "440 cv", "configuracao": "6x4", "volume_cacamba": "10 m³"}', 1200.00, 24500.00, 'PR', 'indisponivel', NULL),
('Volvo FMX 440 Basculante #05', 'caminhao', 'Caminhão basculante 6x4 robusto para transporte de terra, brita e materiais de construção.', 'https://images.vamos.com.br/volvo-fmx440.jpg', '{"potencia": "440 cv", "configuracao": "6x4", "volume_cacamba": "10 m³"}', 1200.00, 24500.00, 'RS', 'disponivel',   NULL),

-- ── Mercedes-Benz Actros 2651: 4 unidades totais (+3) ────────────────────────
('Mercedes-Benz Actros 2651 #02', 'caminhao', 'Caminhão guincho pesado para transporte de máquinas e equipamentos de grande porte.', 'https://images.vamos.com.br/mb-actros-guincho.jpg', '{"potencia": "510 cv", "configuracao": "6x4", "capacidade_plataforma": "25.000 kg"}', 1800.00, 37000.00, 'RJ', 'reservado',    '2026-06-30'),
('Mercedes-Benz Actros 2651 #03', 'caminhao', 'Caminhão guincho pesado para transporte de máquinas e equipamentos de grande porte.', 'https://images.vamos.com.br/mb-actros-guincho.jpg', '{"potencia": "510 cv", "configuracao": "6x4", "capacidade_plataforma": "25.000 kg"}', 1800.00, 37000.00, 'RS', 'indisponivel', NULL),
('Mercedes-Benz Actros 2651 #04', 'caminhao', 'Caminhão guincho pesado para transporte de máquinas e equipamentos de grande porte.', 'https://images.vamos.com.br/mb-actros-guincho.jpg', '{"potencia": "510 cv", "configuracao": "6x4", "capacidade_plataforma": "25.000 kg"}', 1800.00, 37000.00, 'MG', 'reservado',    '2026-07-10'),

-- ── Scania P360 Caçamba: 4 unidades totais (+3) ──────────────────────────────
('Scania P360 Caçamba #02', 'caminhao', 'Caminhão caçamba truck ideal para obras urbanas com agilidade e boa capacidade de carga.', 'https://images.vamos.com.br/scania-p360.jpg', '{"potencia": "360 cv", "configuracao": "6x2", "volume_cacamba": "8 m³"}', 1100.00, 22500.00, 'SP', 'reservado',  '2026-06-20'),
('Scania P360 Caçamba #03', 'caminhao', 'Caminhão caçamba truck ideal para obras urbanas com agilidade e boa capacidade de carga.', 'https://images.vamos.com.br/scania-p360.jpg', '{"potencia": "360 cv", "configuracao": "6x2", "volume_cacamba": "8 m³"}', 1100.00, 22500.00, 'MG', 'reservado',  '2026-07-28'),
('Scania P360 Caçamba #04', 'caminhao', 'Caminhão caçamba truck ideal para obras urbanas com agilidade e boa capacidade de carga.', 'https://images.vamos.com.br/scania-p360.jpg', '{"potencia": "360 cv", "configuracao": "6x2", "volume_cacamba": "8 m³"}', 1100.00, 22500.00, 'PR', 'disponivel', NULL),

-- ── Liebherr LTM 1060: 4 unidades totais (+3) ────────────────────────────────
('Liebherr LTM 1060 #02', 'guindaste', 'Guindaste telescópico móvel 60 toneladas para montagens industriais e grandes obras.', 'https://images.vamos.com.br/liebherr-ltm1060.jpg', '{"capacidade_maxima": "60 t", "alcance_maximo": "48 m", "altura_lancamento": "50 m"}', 4500.00, 92000.00, 'RJ', 'indisponivel', NULL),
('Liebherr LTM 1060 #03', 'guindaste', 'Guindaste telescópico móvel 60 toneladas para montagens industriais e grandes obras.', 'https://images.vamos.com.br/liebherr-ltm1060.jpg', '{"capacidade_maxima": "60 t", "alcance_maximo": "48 m", "altura_lancamento": "50 m"}', 4500.00, 92000.00, 'MG', 'disponivel',   NULL),
('Liebherr LTM 1060 #04', 'guindaste', 'Guindaste telescópico móvel 60 toneladas para montagens industriais e grandes obras.', 'https://images.vamos.com.br/liebherr-ltm1060.jpg', '{"capacidade_maxima": "60 t", "alcance_maximo": "48 m", "altura_lancamento": "50 m"}', 4500.00, 92000.00, 'RS', 'reservado',    '2026-06-25'),

-- ── Grove GMK3060L: 3 unidades totais (+2) ───────────────────────────────────
('Grove GMK3060L #02', 'guindaste', 'Guindaste all terrain 60t com lança 51,2m, versátil para eventos, construção e indústria.', 'https://images.vamos.com.br/grove-gmk3060.jpg', '{"capacidade_maxima": "60 t", "lancamento_maximo": "51,2 m"}', 4200.00, 86000.00, 'SP', 'reservado',  '2026-08-12'),
('Grove GMK3060L #03', 'guindaste', 'Guindaste all terrain 60t com lança 51,2m, versátil para eventos, construção e indústria.', 'https://images.vamos.com.br/grove-gmk3060.jpg', '{"capacidade_maxima": "60 t", "lancamento_maximo": "51,2 m"}', 4200.00, 86000.00, 'PR', 'disponivel', NULL),

-- ── Tadano GR-1000XL: 2 unidades totais (+1) ─────────────────────────────────
('Tadano GR-1000XL #02', 'guindaste', 'Guindaste sobre rodas 100 toneladas para grandes montagens e içamentos pesados.', 'https://images.vamos.com.br/tadano-gr1000.jpg', '{"capacidade_maxima": "100 t", "lancamento_maximo": "58 m", "motor": "528 cv"}', 6800.00, 138000.00, 'SP', 'reservado', '2026-07-05'),

-- ── JLG 600S Plataforma: 4 unidades totais (+3) ──────────────────────────────
('JLG 600S Plataforma #02', 'plataforma', 'Plataforma elevatória telescópica 18,2m para manutenção e construção em altura.', 'https://images.vamos.com.br/jlg-600s.jpg', '{"altura_trabalho": "18,2 m", "capacidade_cesta": "230 kg", "tracao": "4x4"}', 680.00, 14000.00, 'MG', 'reservado',  '2026-06-30'),
('JLG 600S Plataforma #03', 'plataforma', 'Plataforma elevatória telescópica 18,2m para manutenção e construção em altura.', 'https://images.vamos.com.br/jlg-600s.jpg', '{"altura_trabalho": "18,2 m", "capacidade_cesta": "230 kg", "tracao": "4x4"}', 680.00, 14000.00, 'RS', 'reservado',  '2026-07-14'),
('JLG 600S Plataforma #04', 'plataforma', 'Plataforma elevatória telescópica 18,2m para manutenção e construção em altura.', 'https://images.vamos.com.br/jlg-600s.jpg', '{"altura_trabalho": "18,2 m", "capacidade_cesta": "230 kg", "tracao": "4x4"}', 680.00, 14000.00, 'PR', 'disponivel', NULL),

-- ── Genie Z-60/37 FE: 3 unidades totais (+2) ─────────────────────────────────
('Genie Z-60/37 FE #02', 'plataforma', 'Plataforma articulada elétrica para uso interno em galpões e fábricas sem emissões.', 'https://images.vamos.com.br/genie-z6037.jpg', '{"altura_trabalho": "20,3 m", "capacidade_cesta": "227 kg", "alimentacao": "Elétrica"}', 590.00, 12200.00, 'PR', 'reservado',  '2026-05-28'),
('Genie Z-60/37 FE #03', 'plataforma', 'Plataforma articulada elétrica para uso interno em galpões e fábricas sem emissões.', 'https://images.vamos.com.br/genie-z6037.jpg', '{"altura_trabalho": "20,3 m", "capacidade_cesta": "227 kg", "alimentacao": "Elétrica"}', 590.00, 12200.00, 'MG', 'disponivel', NULL),

-- ── Skyjack SJ9250: 3 unidades totais (+2) ───────────────────────────────────
('Skyjack SJ9250 #02', 'plataforma', 'Plataforma tesoura com superfície de trabalho ampla para eventos e feiras.', 'https://images.vamos.com.br/skyjack-sj9250.jpg', '{"altura_trabalho": "15,9 m", "capacidade_plataforma": "680 kg", "tracao": "4x4"}', 480.00, 9800.00, 'SP', 'reservado',  '2026-06-08'),
('Skyjack SJ9250 #03', 'plataforma', 'Plataforma tesoura com superfície de trabalho ampla para eventos e feiras.', 'https://images.vamos.com.br/skyjack-sj9250.jpg', '{"altura_trabalho": "15,9 m", "capacidade_plataforma": "680 kg", "tracao": "4x4"}', 480.00, 9800.00, 'PR', 'disponivel', NULL),

-- ── Dynapac CA2500D: 3 unidades totais (+2) ──────────────────────────────────
('Dynapac CA2500D #02', 'compactador', 'Rolo compactador vibratório essencial para compactação de base em obras viárias.', 'https://images.vamos.com.br/dynapac-ca2500.jpg', '{"peso_operacional": "9.600 kg", "largura_tambor": "2.130 mm", "potencia": "134 cv"}', 780.00, 16000.00, 'PR', 'indisponivel', NULL),
('Dynapac CA2500D #03', 'compactador', 'Rolo compactador vibratório essencial para compactação de base em obras viárias.', 'https://images.vamos.com.br/dynapac-ca2500.jpg', '{"peso_operacional": "9.600 kg", "largura_tambor": "2.130 mm", "potencia": "134 cv"}', 780.00, 16000.00, 'RS', 'disponivel',   NULL),

-- ── Hamm H11i Rolo Tandem: 2 unidades totais (+1) ────────────────────────────
('Hamm H11i Rolo Tandem #02', 'compactador', 'Rolo tandem para compactação de asfalto em obras de pavimentação de alta qualidade.', 'https://images.vamos.com.br/hamm-h11i.jpg', '{"peso_operacional": "11.200 kg", "largura_trabalho": "2.150 mm", "potencia": "100 cv"}', 820.00, 16800.00, 'SP', 'reservado', '2026-07-01'),

-- ── Manitou MRT 2150: 3 unidades totais (+2) ─────────────────────────────────
('Manitou MRT 2150 #02', 'outro', 'Manipulador telescópico 4,5t e 21m de altura para movimentação de cargas em obras.', 'https://images.vamos.com.br/manitou-mrt2150.jpg', '{"capacidade_maxima": "4.500 kg", "altura_maxima": "21 m", "alcance_maximo": "17,6 m"}', 920.00, 18900.00, 'SP', 'reservado',  '2026-06-16'),
('Manitou MRT 2150 #03', 'outro', 'Manipulador telescópico 4,5t e 21m de altura para movimentação de cargas em obras.', 'https://images.vamos.com.br/manitou-mrt2150.jpg', '{"capacidade_maxima": "4.500 kg", "altura_maxima": "21 m", "alcance_maximo": "17,6 m"}', 920.00, 18900.00, 'MG', 'disponivel', NULL),

-- ── Caterpillar 950M: 3 unidades totais (+2) ─────────────────────────────────
('Caterpillar 950M #02', 'outro', 'Carregadeira de rodas balde 3m³ para carregamento de caminhões e grandes volumes.', 'https://images.vamos.com.br/cat-950m.jpg', '{"potencia": "193 cv", "peso_operacional": "18.700 kg", "capacidade_balde": "3,1 m³"}', 1350.00, 27500.00, 'SP', 'reservado',  '2026-07-08'),
('Caterpillar 950M #03', 'outro', 'Carregadeira de rodas balde 3m³ para carregamento de caminhões e grandes volumes.', 'https://images.vamos.com.br/cat-950m.jpg', '{"potencia": "193 cv", "peso_operacional": "18.700 kg", "capacidade_balde": "3,1 m³"}', 1350.00, 27500.00, 'RS', 'reservado',  '2026-05-24'),

-- ── Bobcat S650: 3 unidades totais (+2) ──────────────────────────────────────
('Bobcat S650 #02', 'outro', 'Minicarregadeira compacta para espaços reduzidos, materiais e jardinagem.', 'https://images.vamos.com.br/bobcat-s650.jpg', '{"potencia": "74 cv", "peso_operacional": "3.500 kg", "capacidade_carga": "975 kg"}', 520.00, 10500.00, 'MG', 'reservado',  '2026-06-03'),
('Bobcat S650 #03', 'outro', 'Minicarregadeira compacta para espaços reduzidos, materiais e jardinagem.', 'https://images.vamos.com.br/bobcat-s650.jpg', '{"potencia": "74 cv", "peso_operacional": "3.500 kg", "capacidade_carga": "975 kg"}', 520.00, 10500.00, 'PR', 'disponivel', NULL);


-- ── PASSO 3: Verificação final ───────────────────────────────────────────────

SELECT
  status,
  COUNT(*) AS total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS pct
FROM equipamentos
GROUP BY status
ORDER BY total DESC;

-- Resultado esperado:
-- reservado    ~47  60%
-- disponivel   ~19  24%
-- indisponivel ~12  15%
-- Total: 78 unidades

SELECT COUNT(*) AS total_unidades FROM equipamentos;

-- Distribuição por categoria
SELECT categoria, COUNT(*) AS total FROM equipamentos GROUP BY categoria ORDER BY total DESC;
