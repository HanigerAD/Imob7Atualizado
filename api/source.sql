-- USUARIO
CREATE TABLE situacao (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(100)
);

CREATE TABLE usuario (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha TEXT NOT NULL,
    situacao INT(6) NOT NULL,
    CONSTRAINT FK_situacao_usuario
    FOREIGN KEY situacao REFERENCES situacao(codigo)
);

CREATE TABLE permissao (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(100)
);

CREATE TABLE permissao_usuario (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    usuario INT(6) NOT NULL,
    permissao INT(6) NOT NULL,
    CONSTRAINT FK_usuario_permissao
    FOREIGN KEY (usuario) REFERENCES usuario(codigo),
    CONSTRAINT FK_permissao_usuario
    FOREIGN KEY (permissao) REFERENCES permissao(codigo)
);

-- BLOG
CREATE TABLE blog (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    texto TEXT NOT NULL,
    keywords TEXT NOT NULL,
    data_cadastro DATETIME NOT NULL,
    imagem TEXT,
    usuario INT(6) NOT NULL,
    CONSTRAINT FK_blog_usuario
    FOREIGN KEY (usuario) REFERENCES usuario(codigo)
);

-- ENTIDADE COMERCIAL
CREATE TABLE entidade_comercial (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    cnpj VARCHAR(14) UNIQUE,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE telefone (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(30) NOT NULL,
    entidade_comercial INT(6) NOT NULL,
    CONSTRAINT FK_telefone_entidade_comercial
    FOREIGN KEY (entidade_comercial) REFERENCES entidade_comercial(codigo)
);

-- ENDERECO
CREATE TABLE unidade_federativa (
   codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
   descricao VARCHAR(2) NOT NULL
);

CREATE TABLE municipio (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(100) NOT NULL,
    unidade_federativa INT(6) NOT NULL,
    CONSTRAINT FK_unidade_federativa_localidade
    FOREIGN KEY (unidade_federativa) REFERENCES unidade_federativa(codigo)
);

CREATE TABLE bairro (
    codigo INT(8) PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(100) NOT NULL,
    municipio INT(6) NOT NULL,
    CONSTRAINT FK_municipio_bairro
    FOREIGN KEY (municipio) REFERENCES municipio(codigo)
);

CREATE TABLE endereco (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(8) NOT NULL,
    bairro INT(8) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100),
    latitude VARCHAR(100),
    longitude VARCHAR(100),
    CONSTRAINT FK_bairro_endereco
    FOREIGN KEY (bairro) REFERENCES bairro(codigo)
);

CREATE TABLE endereco_entidade_comercial (
    codigo INT(12) PRIMARY KEY AUTO_INCREMENT,
    entidade_comercial INT(6) NOT NULL,
    endereco INT(6) NOT NULL,
    CONSTRAINT FK_entidade_comercial_endereco
    FOREIGN KEY (entidade_comercial) REFERENCES entidade_comercial(codigo),
    CONSTRAINT FK_endereco_entidade_comercial
    FOREIGN KEY (endereco) REFERENCES endereco(codigo)
);


-- CONFIGURACAO SITE
CREATE TABLE configuracao_site (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    logo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    texto_institucional TEXT NOT NULL,
    resumo_texto_institucional TEXT NOT NULL
);

CREATE TABLE banner (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    imagem TEXT NOT NULL,
    titulo TEXT NOT NULL
);

-- IMOVEL
CREATE TABLE categoria_imovel (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL
);

INSERT INTO categoria_imovel (descricao)
VALUES ('Casa', 'Sobrado', 'Apartamento', 'Terreno', 'Fazenda');

CREATE TABLE tipo_imovel (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL
);

INSERT INTO tipo_imovel (descricao)
VALUES ('Residencial'), ('Comercial'), ('Terreno');

CREATE TABLE estado_conservacao (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL
);

INSERT INTO estado_conservacao (descricao)
VALUES ('Bom'), ('Excelente'), ('Modernizar'), ('Obra total');

CREATE TABLE perfil_imovel (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL
);

INSERT INTO perfil_imovel (descricao)
VALUES ('Lançamento'), ('Novo'), ('Usado');

CREATE TABLE zona_imovel (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL
);

INSERT INTO zona_imovel (descricao)
VALUES ('Rural'), ('Urbana');

CREATE TABLE agenciador (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    nome TEXT NOT NULL,
    telefone VARCHAR(50) NOT NULL
);

CREATE TABLE documento (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL,
    link TEXT NOT NULL
);

CREATE TABLE foto (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    ordem TEXT NOT NULL,
    link TEXT NOT NULL
);

CREATE TABLE transacao_imovel (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL
);

INSERT INTO transacao_imovel (descricao)
VALUES ('Venda'), ('Aluguel'), ('Temporada');

CREATE TABLE imovel (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    valor VARCHAR(50) DEFAULT '0',
    stiuacao INT(6) NOT NULL,
    dormitorio INT(3) DEFAULT '0',
    unidade_disponivel INT(4) DEFAULT '0',
    banheiro INT(3) DEFAULT '0',
    vaga INT(3) DEFAULT '0',
    area_privativa VARCHAR(50) DEFAULT '0',
    area_total VARCHAR(50) DEFAULT '0',
    pavimento INT(3) DEFAULT '1',
    financiavel BOOLEAN DEFAULT FALSE,
    descricao TEXT,
    informacao_privada TEXT,
    categoria INT(6) NOT NULL,
    exibir BOOLEAN DEFAULT FALSE,
    reservado BOOLEAN DEFAULT FALSE,
    expiracao_reserva DATE,
    hectare INT(6),
    ano_construcao INT(12),
    destaque BOOLEAN DEFAULT FALSE,
    super_destaque BOOLEAN DEFAULT FALSE,
    suite INT(6),
    alugado BOOLEAN DEFAULT FALSE,
    valor_condominio VARCHAR(100),
    perfil INT(6) NOT NULL,
    zona INT(6) NOT NULL,
    agenciador INT(6) NOT NULL,
    estado_conservacao INT(6) NOT NULL,
    tipo INT(6) NOT NULL,
    transacao INT(6) NOT NULL,
    exibir_valor BOOLEAN DEFAULT TRUE,
    municipio INT(6) NOT NULL,
    bairro INT(6) NOT NULL,
    cep VARCHAR(100) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero INT(6),
    complemento TEXT,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    CONSTRAINT FK_categoria_imovel
    FOREIGN KEY (categoria) REFERENCES categoria_imovel(codigo),
    CONSTRAINT FK_tipo_imovel
    FOREIGN KEY (tipo) REFERENCES tipo_imovel(codigo),
    CONSTRAINT FK_estado_conservacao_imovel
    FOREIGN KEY (estado_conservacao) REFERENCES estado_conservacao(codigo),
    CONSTRAINT FK_perfil_imovel
    FOREIGN KEY (perfil) REFERENCES perfil_imovel(codigo),
    CONSTRAINT FK_zona_imovel
    FOREIGN KEY (zona) REFERENCES zona_imovel(codigo),
    CONSTRAINT FK_agenciador_imovel
    FOREIGN KEY (agenciador) REFERENCES agenciador(codigo),
    CONSTRAINT FK_transacao_imovel
    FOREIGN KEY (transacao) REFERENCES transacao_imovel(codigo),
    CONSTRAINT FK_municipio_imovel
    FOREIGN KEY (municipio) REFERENCES municipio(codigo),
    CONSTRAINT FK_bairro_imovel
    FOREIGN KEY (bairro) REFERENCES bairro(codigo)
    CONSTRAINT FK_situacao_imovel
    FOREIGN KEY (situacao) REFERENCES situacao(codigo)
);

CREATE TABLE documento_imovel (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    imovel INT(6) NOT NULL,
    documento TEXT NOT NULL,
    CONSTRAINT FK_imovel_documento
    FOREIGN KEY (imovel) REFERENCES imovel(codigo)
);

CREATE TABLE foto_imovel (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    ordem INT(100) NOT NULL,
    imovel INT(6) NOT NULL,
    foto TEXT NOT NULL,
    CONSTRAINT FK_imovel_foto
    FOREIGN KEY (imovel) REFERENCES imovel(codigo),
);

-- Unidade
CREATE TABLE unidade (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    tipo INT(6) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cep VARCHAR(50) NOT NULL,
    bairro INT(6) NOT NULL,
    municipio INT(6) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero INT(6) NOT NULL,
    complemento TEXT,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    funcionamento TEXT NOT NULL,
    CONSTRAINT FK_tipo_unidade
    FOREIGN KEY (tipo) REFERENCES tipo_unidade(codigo)
);

CREATE TABLE tipo_unidade (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT
);

INSERT INTO tipo_unidade (descricao) VALUE ('Matriz'), ('Filial');


CREATE TABLE telefone_unidade (
    codigo INT(6) PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(20) NOT NULL,
    unidade INT(6) NOT NULL,
    CONSTRAINT FK_telefone_unidade
    FOREIGN KEY (unidade) REFERENCES telefone_unidade(codigo)
);
