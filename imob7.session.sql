ALTER TABLE agenciador
ADD flag_visivel_site  BOOLEAN DEFAULT TRUE;
UPDATE agenciador SET flag_visivel_site = FALSE WHERE nome LIKE '%Imobiliária 7 Setembro%';

-- SELECT * FROM agenciador

-- ALTER TABLE imovel DROP FOREIGN KEY FK_municipio_imovel
-- ALTER TABLE imovel DROP COLUMN municipio
-- 
-- select unidade_federativa from imovel
-- JOIN bairro ON bairro.codigo = imovel.bairro
-- JOIN municipio ON municipio.codigo = bairro.municipio
-- JOIN unidade_federativa ON unidade_federativa.codigo = municipio.unidade_federativa
-- where codigo = 409
-- select * from bairro where codigo = 38