# Golden Raspberry Awards - Aplicação Angular

Aplicação web desenvolvida em **Angular** para visualizar a lista de indicados e vencedores da categoria **Pior Filme** do **Golden Raspberry Awards**.

## Descrição

Esta aplicação consome dados da API [Golden Raspberry Awards](https://challenge.outsera.tech/swagger-ui/index.html) e oferece uma interface intuitiva para explorar informações sobre filmes indicados e vencedores.

### Funcionalidades

- **Dashboard**: Painéis com informações específicas de acordo com o desafio
  - tabela de anos com mais de um vencedor
  - tabela dos 3 estúdios com mais vitórias
  - tabelas com produtores de maior e menor intervalo entre vitórias
  - campo de busca para listar vencedores de um ano
- **Lista de Filmes**: Exibe todos os filmes com filtros por status (vencedor/indicado) e ano, com paginação
- **Paginação**: Navegação eficiente entre páginas de resultados
- **Interface Responsiva**: Design adaptado para desktop e mobile
- **Testes Unitários**: Cobertura de testes para serviços e componentes

## Começando

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Angular CLI (versão 21.2.0 ou superior)

### Instalação

1. Clone ou navegue até o diretório do projeto:

```bash
cd outsera-app
```

2. Instale as dependências:

```bash
npm install
```

> **Nota:** a aplicação consome dados de uma API externa. Para evitar erros de CORS/certificado local durante o `ng serve`, usamos o proxy configurado em `proxy.conf.json`. O comando de start já inclui essa configuração.

## Como Usar

### Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
ng serve
```

Ou usando npm:

```bash
npm start
```

O servidor estará disponível em **http://localhost:4200/**. A aplicação recarrega automaticamente quando arquivo são modificados.

## Testes

### Executar Testes Unitários

Para executar os testes unitários:

```bash
ng test
```

Ou usando npm:

```bash
npm test
```

## Build para Produção

Para compilar o projeto para produção:

```bash
ng build
```

Ou usando npm:

```bash
npm run build
```

Os arquivos compilados serão armazenados no diretório `dist/`. A compilação de produção otimiza a aplicação para desempenho.

