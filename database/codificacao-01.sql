/* remover vinculo de imovel com municipio */
alter table imovel drop foreign key FK_municipio_imovel;
/* remover coluna municipio de imovel */
alter table imovel drop column municipio;
/* criar tabela para salvar banner da pagina sobre nos */
create table sobre_nos_banner (
  codigo int auto_increment,
  imagem varchar(255) not null,
  constraint sobre_nos_banner_pk primary key (codigo)
);