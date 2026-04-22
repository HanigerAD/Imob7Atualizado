# Imobiliaria 7 de Setembro
Repositorio com o codigo de [API](#api), [FRONTEND](#frontend) e [ADMIN](#admin)

### Instruções para desenvolvimento em [DEV MODE](#dev-mode)

## API
Api desenvolvida com NestJS
### Como executar em modo desenvolvimento?
```sh
docker compose up api
```
### Como executar o build?
```sh
docker compose up build-api
```

## FRONTEND
Aplicação construida com AngularJS
### Como executar em modo desenvolvimento?
```sh
docker compose up site
```
### Como executar o build?
```sh
docker compose up build-site
```


## ADMIN
Aplicação construida com ReactJS
### Como executar em modo desenvolvimento?
```sh
docker compose up admin
```
### Como executar o build?
```sh
docker compose up build-admin
```

# IMPORTANTE
Depois de executar o comando build de todas as aplicações, é necessario rodar o seguinte comando na pasta raiz do projeto
```sh
npm run build
```
Isso fará com que as pastas dos servers sejam atualizadas com os arquivos de builds gerados.

Após sua execução, você deve subir seu conteudo manualmente para seus respectivos servidores.

> **ATENÇÃO**: Os diretórios de Build nas aplicações provavelmente não estarão atualizados com a última versão do código fonte no repositório do GitHub. Isto iria pesar desnessariamente o repositório com builds subsequentes, já que não há nenhum tipo de processo de CI/CD no momento que utilize estes diretórios a partir deste repositório.

## DEV MODE

Este projeto foi desenvolvido em modo containerizado (Docker) e no paradigma  MonoRepo. Portanto para o correto funcionamento do ambiente de desenvolvimento você deve:

1. Ter o [Docker](https://docker.com) instalado na sua máquina de desenvolvimento;
2. Para subir a aplicação base você deve copiar o arquivo `./.dev.api.env`, que está no diretório raíz deste projeto, para a raiz da pasta API e renomeá-lo para `.env`. Após isto executar o comando `docker compose up api` que irá subir os ambientes `API`e `Database`, liberando com isto as portas 3000 e 3306 em cada container para os serviços prestados pela API e o banco MySQL respectivamente;
Para subir a aplicação `Site` utilize como parametro da variável ambiente o termo `development`, também copiando o arquivo `./admin/env.example` e renomeando o mesmo para `.env`. Ainda para o site modifique o arquivo `./admin/package.json` na propriedade `start` inserindo o termo `PORT=xxxx react-scripts start` para Linux/MacOS ou `Set PORT=xxxx && react-scripts start`. Voce pode utilizar por exemplo a porta `5000`
3. Após este procedimento as duas aplicações frontend **(Admin e Site)** podem ser iniciadas conforme instruções de cada seção como está no início deste documento.

> **IMPORTANTE**: Se você rodar o projeto pela primeira vez, para que seja possível utilizar a aplicação Admin para criar imóveis é necessário alguns ajustes manuais na base de dados de desenvolvimento para que a mesma tenha o mesmo tipo de campo da base de produção nas seguintes tabelas:

- `imoveis`
  - coluna 'código' alterar para Auto Increment e Primary Key.
- `foto_imovel`
  - coluna 'código' alterar para Auto Increment e Primary Key.

Para acessar as aplicações utilize:

- Para Site: http://localhost:5000 (caso tenha optado por esta porta na configuração descrita acima)
- Para Admin: http://localhost:4200