-- Atualiza foto_url com imagens reais do site da VAMOS
-- Execute no SQL Editor do Supabase

-- Retroescavadeiras (SVG oficial da VAMOS)
UPDATE equipamentos
SET foto_url = 'https://apisite.vamos.com.br/uploads/retroescavadeira_cf19be359a.svg'
WHERE categoria = 'retroescavadeira';

-- Tratores (foto real da frota agro VAMOS)
UPDATE equipamentos
SET foto_url = 'https://apisite.vamos.com.br/uploads/Trator_27d227a826.png?format=webp&quality=80&w=800'
WHERE categoria = 'trator';

-- Caminhões (fotos reais do catálogo VAMOS)
UPDATE equipamentos
SET foto_url = 'https://apisite.vamos.com.br/uploads/normal_KV_Graneleiro_28bdba18db_cfc4fe62ad.jpg?format=webp&quality=80&w=800'
WHERE nome = 'Volvo FMX 440 Basculante';

UPDATE equipamentos
SET foto_url = 'https://apisite.vamos.com.br/uploads/normal_VWC_Delivery_Express34_Motorista_PARACINZARETLONGOAMARELOBEMTEVI_aa00060046_e0837810e2.jpg?format=webp&quality=80&w=800'
WHERE nome = 'Mercedes-Benz Actros 2651 Guincho';

UPDATE equipamentos
SET foto_url = 'https://apisite.vamos.com.br/uploads/normal_xlarge_Constellation_24_280_3_4_Frontal_Lado_Motorista_a93d7677c9_d78fc347f2_d9e8521f1b.webp?format=webp&quality=80&w=800'
WHERE nome = 'Scania P360 Caçamba';

-- Guindastes e compactadores (equipamentos pesados da linha amarela VAMOS)
UPDATE equipamentos
SET foto_url = 'https://apisite.vamos.com.br/uploads/PC_160_86cd8d96a4.svg'
WHERE categoria = 'guindaste';

UPDATE equipamentos
SET foto_url = 'https://apisite.vamos.com.br/uploads/TRATOR_DE_ESTEIRA_dd9621efa2_f1d3c9085c.png?format=webp&quality=80&w=800'
WHERE categoria = 'compactador';

-- Carregadeiras e equipamentos de movimentação (foto real VAMOS)
UPDATE equipamentos
SET foto_url = 'https://apisite.vamos.com.br/uploads/normal_938_Pa_carregadeira_5685049dca_f694855b48.jpg?format=webp&quality=80&w=800'
WHERE categoria = 'outro';

-- Confirma
SELECT nome, categoria, LEFT(foto_url, 60) AS foto_preview FROM equipamentos ORDER BY categoria, nome;
