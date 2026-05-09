-- ============================================================
-- 02-equipamentos.sql
-- Insere os 20 modelos base com UUIDs fixos
-- Os UUIDs são os mesmos referenciados em 04-pedidos.sql
-- Execute APÓS 01-schema.sql
-- ============================================================

INSERT INTO equipamentos (id, nome, categoria, descricao, foto_url, specs, preco_dia, preco_mes, estado, status) VALUES

-- RETROESCAVADEIRAS
('71fd85ad-a6d1-4d21-84d8-bb3949641454',
 'Case 580N', 'retroescavadeira',
 'Retroescavadeira com 87cv de potência, ideal para obras de pequeno e médio porte, escavação de valas e fundações.',
 'https://images.vamos.com.br/case-580n.jpg',
 '{"potencia": "87 cv", "peso_operacional": "7.500 kg", "capacidade_balde": "0,28 m³", "profundidade_escavacao": "4,3 m"}',
 890.00, 18500.00, 'SP', 'disponivel'),

('2e12bfb9-d6c8-42bf-92f9-32d5a24c091e',
 'JCB 3CX', 'retroescavadeira',
 'Retroescavadeira versátil com transmissão powershift, alta produtividade em obras civis e infraestrutura.',
 'https://images.vamos.com.br/jcb-3cx.jpg',
 '{"potencia": "74 cv", "peso_operacional": "8.200 kg", "capacidade_balde": "0,30 m³", "profundidade_escavacao": "5,5 m"}',
 950.00, 19800.00, 'MG', 'disponivel'),

('b6ad690d-c98e-49b1-ad1c-7fb64188de7a',
 'Caterpillar 416F2', 'retroescavadeira',
 'Retroescavadeira Cat com tração 4x4, excelente para terrenos irregulares e trabalhos pesados.',
 'https://images.vamos.com.br/cat-416f2.jpg',
 '{"potencia": "93 cv", "peso_operacional": "8.800 kg", "capacidade_balde": "0,32 m³", "profundidade_escavacao": "5,9 m"}',
 1050.00, 21500.00, 'RS', 'disponivel'),

-- TRATORES
('02b71de7-dca4-455c-a6c7-68d7629cf8c9',
 'John Deere 5075E', 'trator',
 'Trator agrícola 75cv, versátil para preparo de solo, plantio e colheita em pequenas e médias propriedades.',
 'https://images.vamos.com.br/jd-5075e.jpg',
 '{"potencia": "75 cv", "tracao": "4x4", "peso": "3.850 kg", "transmissao": "PowerReverser 12x12"}',
 650.00, 13500.00, 'MT', 'disponivel'),

('6491bd7a-1257-473e-a641-9fa69ecb7243',
 'New Holland TL5.80', 'trator',
 'Trator compacto e robusto, ideal para pastagem, fruticultura e serviços gerais na propriedade rural.',
 'https://images.vamos.com.br/nh-tl580.jpg',
 '{"potencia": "80 cv", "tracao": "4x4", "peso": "3.600 kg", "transmissao": "Sincronizada 8x8"}',
 620.00, 12800.00, 'GO', 'disponivel'),

('d315a690-baca-4bbc-87fd-e0eff80162a4',
 'Massey Ferguson 4708', 'trator',
 'Trator de médio porte com cabine climatizada, para operações mais longas com conforto do operador.',
 'https://images.vamos.com.br/mf-4708.jpg',
 '{"potencia": "85 cv", "tracao": "4x4", "peso": "4.100 kg", "transmissao": "Dyna-4 16x16", "cabine": "Climatizada"}',
 750.00, 15500.00, 'PR', 'disponivel'),

-- CAMINHÕES
('1a085892-a161-4934-bca1-8ce10c07db6b',
 'Volvo FMX 440 Basculante', 'caminhao',
 'Caminhão basculante 6x4, robusto para transporte de terra, brita e materiais de construção em obras.',
 'https://images.vamos.com.br/volvo-fmx440.jpg',
 '{"potencia": "440 cv", "configuracao": "6x4", "capacidade_carga": "14.000 kg", "volume_cacamba": "10 m³"}',
 1200.00, 24500.00, 'SP', 'disponivel'),

('4e9c5c45-3f31-4209-8ef8-61663914d5d9',
 'Mercedes-Benz Actros 2651 Guincho', 'caminhao',
 'Caminhão guincho pesado para transporte de máquinas e equipamentos de grande porte.',
 'https://images.vamos.com.br/mb-actros-guincho.jpg',
 '{"potencia": "510 cv", "configuracao": "6x4", "capacidade_plataforma": "25.000 kg", "comprimento_plataforma": "9,5 m"}',
 1800.00, 37000.00, 'SP', 'disponivel'),

('532dbacf-f3d8-4744-9b56-53a27849bf46',
 'Scania P360 Caçamba', 'caminhao',
 'Caminhão caçamba truck, ideal para obras urbanas com necessidade de agilidade e capacidade de carga.',
 'https://images.vamos.com.br/scania-p360.jpg',
 '{"potencia": "360 cv", "configuracao": "6x2", "capacidade_carga": "12.000 kg", "volume_cacamba": "8 m³"}',
 1100.00, 22500.00, 'RJ', 'disponivel'),

-- GUINDASTES
('9fd82e09-be1e-4d09-8307-48086210efde',
 'Liebherr LTM 1060-3.1', 'guindaste',
 'Guindaste telescópico móvel com capacidade de 60 toneladas, para montagens industriais e obras de grande porte.',
 'https://images.vamos.com.br/liebherr-ltm1060.jpg',
 '{"capacidade_maxima": "60 t", "alcance_maximo": "48 m", "altura_lancamento": "50 m", "configuracao": "8x8x8"}',
 4500.00, 92000.00, 'SP', 'disponivel'),

('14ec6f76-fce6-4d86-8377-957971745111',
 'Grove GMK3060L', 'guindaste',
 'Guindaste all terrain 60t com lança de 51,2m, versátil para eventos, construção e indústria.',
 'https://images.vamos.com.br/grove-gmk3060.jpg',
 '{"capacidade_maxima": "60 t", "lancamento_maximo": "51,2 m", "altura_gancho": "56 m", "configuracao": "6x6x6"}',
 4200.00, 86000.00, 'MG', 'disponivel'),

('05547144-bd34-495d-99f5-b4a5132d1414',
 'Tadano GR-1000XL', 'guindaste',
 'Guindaste sobre rodas com capacidade de 100 toneladas, para grandes montagens e içamentos pesados.',
 'https://images.vamos.com.br/tadano-gr1000.jpg',
 '{"capacidade_maxima": "100 t", "lancamento_maximo": "58 m", "altura_gancho": "63 m", "motor": "528 cv"}',
 6800.00, 138000.00, 'RJ', 'disponivel'),

-- PLATAFORMAS ELEVATÓRIAS
('916dd0c8-4af4-4bf9-86dc-48f082079f32',
 'JLG 600S Plataforma Telescópica', 'plataforma',
 'Plataforma elevatória telescópica com 18,2m de altura de trabalho, para manutenção e construção em altura.',
 'https://images.vamos.com.br/jlg-600s.jpg',
 '{"altura_trabalho": "18,2 m", "capacidade_cesta": "230 kg", "alcance_horizontal": "10,5 m", "tracao": "4x4"}',
 680.00, 14000.00, 'SP', 'disponivel'),

('b2c20136-c841-4130-84f4-1f6031bca7d8',
 'Genie Z-60/37 FE Articulada', 'plataforma',
 'Plataforma articulada elétrica para uso interno, ideal para manutenção em galpões e fábricas sem emissões.',
 'https://images.vamos.com.br/genie-z6037.jpg',
 '{"altura_trabalho": "20,3 m", "capacidade_cesta": "227 kg", "alcance_horizontal": "11 m", "alimentacao": "Elétrica"}',
 590.00, 12200.00, 'SP', 'disponivel'),

('d044466e-530f-423a-bec2-ecba49be8517',
 'Skyjack SJ9250 Tesoura', 'plataforma',
 'Plataforma tesoura para trabalho em altura com superfície de trabalho ampla, ideal para eventos e feiras.',
 'https://images.vamos.com.br/skyjack-sj9250.jpg',
 '{"altura_trabalho": "15,9 m", "capacidade_plataforma": "680 kg", "largura_plataforma": "2,5 m", "tracao": "4x4"}',
 480.00, 9800.00, 'RS', 'disponivel'),

-- COMPACTADORES
('fe8bf06e-2675-430c-9ff5-4d2450ccf8f4',
 'Dynapac CA2500D Rolo Compactador', 'compactador',
 'Rolo compactador de solo vibratório, essencial para compactação de base em obras viárias e fundações.',
 'https://images.vamos.com.br/dynapac-ca2500.jpg',
 '{"peso_operacional": "9.600 kg", "largura_tambor": "2.130 mm", "potencia": "134 cv", "amplitude": "0,97/0,49 mm"}',
 780.00, 16000.00, 'MG', 'disponivel'),

('2d7a7d7f-37ef-46ef-8804-4d057fcf1600',
 'Hamm H11i Rolo Tandem', 'compactador',
 'Rolo tandem para compactação de asfalto em obras de pavimentação, acabamento de alta qualidade.',
 'https://images.vamos.com.br/hamm-h11i.jpg',
 '{"peso_operacional": "11.200 kg", "largura_trabalho": "2.150 mm", "potencia": "100 cv", "velocidade_max": "12 km/h"}',
 820.00, 16800.00, 'PR', 'disponivel'),

-- OUTROS
('c2f6fc1d-a93c-4b2c-bb38-a0dc594b08db',
 'Manitou MRT 2150 Telehandler', 'outro',
 'Manipulador telescópico com 4,5t de capacidade e 21m de altura, para movimentação de cargas em obras.',
 'https://images.vamos.com.br/manitou-mrt2150.jpg',
 '{"capacidade_maxima": "4.500 kg", "altura_maxima": "21 m", "alcance_maximo": "17,6 m", "tracao": "4x4x4"}',
 920.00, 18900.00, 'GO', 'disponivel'),

('b04a8fcf-e038-42d1-809c-5857a72c9ce0',
 'Caterpillar 950M Carregadeira', 'outro',
 'Carregadeira de rodas com balde de 3m³, para carregamento de caminhões e movimentação de grandes volumes.',
 'https://images.vamos.com.br/cat-950m.jpg',
 '{"potencia": "193 cv", "peso_operacional": "18.700 kg", "capacidade_balde": "3,1 m³", "forca_arrancamento": "14.200 kg"}',
 1350.00, 27500.00, 'MT', 'disponivel'),

('431c75a8-ac3b-4bd3-9fa7-0c6bd3084da9',
 'Bobcat S650 Minicarregadeira', 'outro',
 'Minicarregadeira compacta para espaços reduzidos, movimentação de materiais e trabalhos de jardinagem.',
 'https://images.vamos.com.br/bobcat-s650.jpg',
 '{"potencia": "74 cv", "peso_operacional": "3.500 kg", "capacidade_carga": "975 kg", "largura": "1.830 mm"}',
 520.00, 10500.00, 'SP', 'disponivel');

-- Confirma
SELECT COUNT(*) AS equipamentos_inseridos FROM equipamentos;
