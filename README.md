# Stories Server

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-520AD1)](https://opensource.org/licenses/MIT)
[![Typescript Version](https://img.shields.io/badge/Typescript-5%2B-520AD1)](https://www.typescriptlang.org/)
[![GitHub repo size](https://img.shields.io/github/repo-size/marllonmendez/stories?color=520AD1)]()
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/marllonmendez/stories?color=520AD1)]()

[![React.js](https://img.shields.io/badge/React-520AD1?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-520AD1?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/fastify-520AD1?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-520AD1?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![JWT](https://img.shields.io/badge/JWT-520AD1?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Zod](https://img.shields.io/badge/-Zod-520AD1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-520AD1?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

## Sobre
API desenvolvida para o projeto [Stories](https://github.com/marllonmendez/stories-web)

## Funcionalidades

- Criação de usuário;
- Login e autenticação com email e senha do usuário;
- Perfil de usuário onde o mesmo pode editar nome e email, além de deslogar;
- Usuários administradores tem acesso a página Admin, onde a mesma lista todos os usuários do banco de dados, podendo editar o nome e email, além de excluí-los.

## Execução

<h4>1. Clonagem</h4>

```bash
git clone https://github.com/marllonmendez/stories-server.git
```

<h4>2. Instalação das dependências</h4>

```bash
npm install
```

<h4>3. Execução local</h4>

```bash
npm run dev
```


<h4>4. Execução do prisma</h4>

```bash
npx prisma studio
```

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE)
