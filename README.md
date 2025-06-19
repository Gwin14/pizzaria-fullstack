# Pizzaria Fullstack

Projeto completo de uma aplicação de pizzaria, com backend em Spring Boot e frontend em React. O sistema permite cadastro de clientes, gerenciamento de pizzas, pedidos, histórico, painel administrativo e muito mais.

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
  - [Usando Docker Compose (Recomendado)](#usando-docker-compose-recomendado)
  - [Rodando Manualmente](#rodando-manualmente)
- [Configurações Importantes](#configurações-importantes)
- [Scripts Úteis](#scripts-úteis)
- [Testes](#testes)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

Sistema web para gestão de pizzaria, com funcionalidades para clientes e administradores:

- Cadastro e login de clientes
- Listagem e CRUD de pizzas
- Carrinho de compras e finalização de pedidos
- Histórico de pedidos
- Painel administrativo para gestão de itens e usuários

## Tecnologias Utilizadas

- **Backend:** Java 17, Spring Boot, Spring Data JPA, MySQL
- **Frontend:** React, React Router, Axios, Bootstrap
- **Infraestrutura:** Docker, Docker Compose

## Estrutura do Projeto

```
├── backend/    # API REST em Spring Boot
├── frontend/   # Aplicação React
├── docker-compose.yml
└── README.md
```

## Como Rodar o Projeto

### Usando Docker Compose (Recomendado)

Certifique-se de ter [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

```bash
git clone https://github.com/Gwin14/pizzaria-fullstack.git
cd pizzaria-fullstack
docker-compose up --build
```

- O backend estará disponível em: http://localhost:8080
- O frontend estará disponível em: http://localhost:3000

### Rodando Manualmente

#### Backend (Spring Boot)

Pré-requisitos: Java 17+ e Gradle

```bash
cd backend
./gradlew bootRun
```

A API estará em http://localhost:8080

#### Frontend (React)

Pré-requisitos: Node.js 18+

```bash
cd frontend
npm install
npm start
```

A aplicação estará em http://localhost:3000

## Configurações Importantes

- O backend utiliza banco MySQL (configurado em `backend/src/main/resources/application.properties`).
- Por padrão, o banco está configurado para um serviço externo. Para rodar localmente, ajuste as variáveis de conexão conforme necessário.
- O volume `backend/src/main/resources/pizzaria.db` é mapeado para persistência.

## Scripts Úteis

- **Backend:**
  - `./gradlew build` — Compila o backend
  - `./gradlew test` — Executa os testes
- **Frontend:**
  - `npm run build` — Gera build de produção
  - `npm test` — Executa testes do frontend

## Testes

- Backend: Os testes estão em `backend/src/test/java/com/pizzaria/`.
- Frontend: Testes em `frontend/src/` com Jest/React Testing Library.

## Contribuição

Pull requests são bem-vindos! Para contribuir:

1. Fork este repositório
2. Crie uma branch (`git checkout -b feature/nome-feature`)
3. Commit suas alterações
4. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
