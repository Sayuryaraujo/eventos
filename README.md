# Eventos Climáticos — Projeto Full Stack

Projeto didático para a Aula 05 — Prisma Seed. Backend em Node.js + Express + Prisma 7 + MySQL/MariaDB; frontend em HTML, CSS e JavaScript puro.

## Requisitos
- Node.js 20.19+ (recomendado Node 22)
- MySQL/MariaDB em execução (por exemplo, MySQL do XAMPP)
- Banco de dados `eventos` criado no MySQL

## 1. Preparar o banco
No phpMyAdmin ou cliente MySQL, execute:
```sql
CREATE DATABASE eventos;
```

## 2. Configurar a API
Abra um terminal na pasta `api`:
```bash
npm install
```
Copie `.env.example` para `.env` e ajuste usuário/senha/porta do seu MySQL. Exemplo local do XAMPP:
```env
PORT=3000
DATABASE_URL="mysql://root@localhost:3306/eventos"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD=""
DB_NAME="eventos"
```
Se seu MySQL tiver senha, informe-a em `DATABASE_URL` e `DB_PASSWORD`.

Depois execute:
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```
A API fica em `http://localhost:3000`. A rota `/` mostra as rotas disponíveis. Se você já criou a migração e executou o seed, não precisa repetir esses dois comandos.

## 3. Abrir o site
Com a API rodando, abra `web/index.html` no navegador. Se o navegador bloquear requisições locais por abrir o arquivo diretamente, rode um servidor estático dentro de `web`, por exemplo:
```bash
npx serve .
```
Depois acesse o endereço informado pelo comando. A API permite CORS para desenvolvimento.

## Login de demonstração
- ana@email.com / senha123
- maria@email.com / senha123
- joao@email.com / senha123
- paula@email.com / senha123
- pedro@email.com / senha123

## Rotas para testar no Insomnia
Base URL: `http://localhost:3000`

### Usuários
| Operação | Método | URL |
|---|---|---|
| Cadastrar | POST | `/usuario/cadastrar` |
| Login | POST | `/usuario/login` |
| Listar | GET | `/usuario/listar` |
| Buscar por ID | GET | `/usuario/buscar/:id` |
| Atualizar | PUT | `/usuario/atualizar/:id` |
| Excluir | DELETE | `/usuario/excluir/:id` |

Exemplo de Body para cadastrar:
```json
{
  "nome": "Maria Silva",
  "email": "maria.teste@example.com",
  "senha": "Teste123!"
}
```

Exemplo de Body para login:
```json
{
  "email": "ana@email.com",
  "senha": "senha123"
}
```

Exemplo de Body para atualizar (todos os campos são opcionais, mas informe pelo menos um):
```json
{
  "nome": "Maria Silva Atualizada",
  "email": "maria.teste@example.com"
}
```

### Eventos
| Operação | Método | URL |
|---|---|---|
| Listar | GET | `/evento` |
| Buscar por ID | GET | `/evento/:id` |
| Cadastrar | POST | `/evento` |
| Atualizar | PUT | `/evento/:id` |
| Excluir | DELETE | `/evento/:id` |

Exemplo de Body para cadastrar evento:
```json
{
  "usuarioId": 1,
  "cidade": "Amparo",
  "tipoEvento": "Tempestade",
  "temperaturaMaxima": 34.5,
  "nivelImpacto": "Alagamentos e queda de árvores"
}
```

Para editar um evento, envie `cidade`, `tipoEvento` e `nivelImpacto`, e opcionalmente `temperaturaMaxima` e `data`.

## Funcionalidades
- Login validado no banco
- Nome do usuário logado no cabeçalho
- Botão Sair
- CRUD de eventos climáticos
- Listagem de eventos vinculados ao usuário logado
- Seed com 5 usuários e 8 eventos de exemplo

## Observações importantes
- O Seed apaga os eventos e usuários existentes antes de inserir os dados de exemplo. Execute apenas em banco de teste.
- As senhas do Seed são armazenadas com hash bcrypt.
- Este é um projeto escolar para execução local, não uma solução pronta para produção. Para produção, use HTTPS, variáveis seguras e autenticação/token com expiração e proteção adicional.
