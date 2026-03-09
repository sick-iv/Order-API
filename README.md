# Order API

API desenvolvida em Node.js utilizando Express e MongoDB para gerenciamento de pedidos.

Este projeto implementa uma API REST capaz de criar, consultar, atualizar e deletar pedidos, realizando também a transformação (mapping) dos dados recebidos antes de salvar no banco de dados.

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Thunder Client / Postman para testes da API

## Como executar o projeto

1. Clonar o repositório

git clone https://github.com/sick-iv/Order-API.git

2. Entrar na pasta do projeto

cd Order-API

3. Instalar dependências

npm install

4. Executar o servidor

node server.js

Servidor iniciará em:

http://localhost:3000

## Endpoints da API

Criar pedido

POST /order

Exemplo de body:

{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}

Listar pedidos

GET /order/list

Buscar pedido

GET /order/{numeroPedido}

Exemplo:

GET /order/v10089015vdb-01

Atualizar pedido

PUT /order/{numeroPedido}

Deletar pedido

DELETE /order/{numeroPedido}

## Transformação de dados (Mapping)

A API recebe os dados no formato:

{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00"
}

E salva no banco no formato:

{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z"
}

## Banco de dados

Banco utilizado: MongoDB

Collection utilizada:

orders

Estrutura do documento salvo:

{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}

## Autor

Matheus de Mello Santos

Projeto desenvolvido para estudo de APIs REST com Node.js e MongoDB.