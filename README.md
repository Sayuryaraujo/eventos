# Eventos Climáticos — Projeto Full Stack

Projeto didático da Aula 05 — Prisma Seed, desenvolvido com Node.js, Express, Prisma 7, MySQL e frontend em HTML, CSS e JavaScript.

## Requisitos
- Node.js 20.19+
- MySQL em execução (XAMPP)
- Banco de dados `eventos`

## 1. Configurar o banco

```sql
CREATE DATABASE eventos;
```

## 2. Instalar e configurar a API

No terminal, dentro da pasta `api`:

```bash
npm install
```

Configure o arquivo `.env`:

```env
PORT=3000
DATABASE_URL="mysql://root@localhost:3306/eventos"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD=""
DB_NAME="eventos"
```

## 3. Prisma e Seed

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Se a migração e o seed já foram executados, não precisa repeti-los.

A API estará disponível em `http://localhost:3000`.

**Atenção:** o seed apaga usuários e eventos existentes antes de inserir os dados de exemplo.

## 4. Frontend

Abra `web/index.html` no navegador. Se necessário, execute dentro da pasta `web`:

```bash
npx serve .
```

## 5. Login de demonstração

Todos utilizam a senha `senha123`.

- ana@email.com
- maria@email.com
- joao@email.com
- paula@email.com
- pedro@email.com

## 6. Rotas para o Insomnia

Base URL: `http://localhost:3000`

### Usuários

| Método | Rota |
|---|---|
| POST | `/usuario/cadastrar` |
| POST | `/usuario/login` |
| GET | `/usuario/listar` |
| GET | `/usuario/buscar/:id` |
| PUT | `/usuario/atualizar/:id` |
| DELETE | `/usuario/excluir/:id` |

### Eventos

| Método | Rota |
|---|---|
| POST | `/evento/cadastrar` |
| GET | `/evento/listar` |
| GET | `/evento/buscar/:id` |
| PUT | `/evento/atualizar/:id` |
| DELETE | `/evento/excluir/:id` |

Organize as requisições no Insomnia em grupos de **Usuários** e **Eventos**.

## Funcionalidades
- Cadastro e login.
- CRUD de eventos climáticos.
- Associação de eventos aos usuários.
- Seed com 5 usuários e 8 eventos.

**Observação:** confirme se as rotas documentadas correspondem às implementadas nos arquivos do backend.
