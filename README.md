# Sistema de Chamados de T.I. (API)

API back-end para abertura e acompanhamento de chamados de suporte de T.I., com cadastro de usuários, login e controle de acesso por papel.

## Descrição do sistema

Usuários abrem chamados e acompanham o andamento. A equipe de T.I. (administradores) enxerga todos os chamados e altera o status deles.

**Recurso principal do CRUD:** `Chamado` (título, descrição, status, data de criação e o usuário que o abriu).

**Status do chamado:** `ABERTO`, `EM_ANDAMENTO` e `CONCLUIDO`. Todo chamado nasce `ABERTO`.

### Regras de acesso

| Quem | O que pode fazer |
|---|---|
| Sem login | Cadastrar-se (`POST /usuarios`) e entrar (`POST /auth/login`) |
| Usuário comum (`USER`) | Criar chamados; listar, ver, editar título/descrição e remover **apenas os seus** |
| Administrador (`ADMIN`) | Tudo o que o usuário comum faz, em **qualquer** chamado, e alterar o status |

Segurança aplicada:

- A senha é guardada como hash (bcrypt). O hash nunca volta nas respostas.
- O papel (`ADMIN` ou `USER`) **não** pode ser escolhido no cadastro. Todo cadastro nasce `USER`.
- O dono do chamado vem do token, e nunca do corpo da requisição.
- Chamado de outra pessoa responde `404`, para não revelar quais ids existem.
- E-mail inexistente e senha errada no login respondem com a mesma mensagem (`401`).

## Tecnologias

- NestJS e TypeScript
- PostgreSQL 16 (Docker, com volume para persistência)
- Prisma ORM 7
- JWT (`@nestjs/jwt`) e bcrypt (`bcryptjs`)
- Validação com `class-validator` e `class-transformer`
- Swagger (`@nestjs/swagger`)
- Vitest (testes automatizados)
- pnpm

> **Decisão técnica:** o banco escolhido foi o PostgreSQL (relacional), com o Prisma, pois o sistema relaciona usuários e chamados.

## Pré-requisitos

- Node.js 22
- pnpm
- Docker e Docker Compose

## Como configurar e executar

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Crie o arquivo de variáveis de ambiente a partir do exemplo e preencha os valores:

   ```bash
   cp .env.example .env
   ```

3. Suba o banco de dados (PostgreSQL em Docker):

   ```bash
   docker compose up -d
   ```

4. Gere o cliente do Prisma:

   ```bash
   pnpm prisma generate
   ```

5. Aplique as migrations no banco:

   ```bash
   pnpm prisma migrate deploy
   ```

6. Inicie a aplicação:

   ```bash
   pnpm run start:dev
   ```

A API fica em `http://localhost:3000`.

### Banco de dados (Docker)

O `docker-compose.yml` sobe um PostgreSQL 16 na porta `5432`. Os dados ficam em um volume do Docker, então sobrevivem quando o container é parado ou recriado.

| Ação | Comando |
|---|---|
| Ligar o banco | `docker compose up -d` |
| Ver se está rodando | `docker compose ps` |
| Parar sem apagar nada | `docker compose stop` |
| Apagar o container, mantendo os dados | `docker compose down` |
| Apagar o container **e os dados** | `docker compose down -v` |

## Variáveis de ambiente

Copie o `.env.example` para `.env`. O `.env` não vai para o Git.

| Variável | Para que serve |
|---|---|
| `PORT` | Porta da API (padrão `3000`) |
| `POSTGRES_USER` | Usuário do PostgreSQL |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL |
| `POSTGRES_DB` | Nome do banco |
| `DATABASE_URL` | Endereço de conexão usado pelo Prisma. Deve usar o mesmo usuário, senha e banco acima |
| `JWT_SECRET` | Chave que assina os tokens. Use um texto longo e aleatório (por exemplo, `openssl rand -hex 32`) |

## Documentação da API (Swagger)

Com a aplicação rodando, abra:

**http://localhost:3000/api**

Como testar as rotas protegidas:

1. Cadastre um usuário em `POST /usuarios`.
2. Entre em `POST /auth/login` e copie o `accessToken` da resposta.
3. Clique em **Authorize** (cadeado, no alto da página), cole **somente o token** (sem escrever `Bearer`) e confirme.
4. Teste as rotas de `/chamados`. O token vale 1 hora.

## Rotas

| Método e rota | Acesso | Descrição |
|---|---|---|
| `POST /usuarios` | Público | Cadastra um usuário (nasce `USER`) |
| `POST /auth/login` | Público | Devolve o token JWT |
| `POST /chamados` | Logado | Abre um chamado |
| `GET /chamados` | Logado | Lista os seus chamados (o admin vê todos) |
| `GET /chamados/:id` | Dono ou admin | Busca um chamado |
| `PATCH /chamados/:id` | Dono ou admin | Altera título e/ou descrição |
| `PATCH /chamados/:id/status` | Somente `ADMIN` | Altera o status |
| `DELETE /chamados/:id` | Dono ou admin | Remove um chamado |

Respostas de erro comuns: `400` (dados inválidos), `401` (sem token, token inválido ou login errado), `403` (sem permissão), `404` (chamado não encontrado), `409` (e-mail já cadastrado).

### Como tornar um usuário administrador

Por segurança, a API não permite escolher o papel. Para promover um usuário, altere direto no banco (troque os valores entre `<>`):

```bash
docker compose exec postgres psql -U <usuario> -d <banco> -c "UPDATE \"Usuario\" SET papel = 'ADMIN' WHERE email = '<email-do-usuario>';"
```

O papel fica dentro do token, então o usuário precisa fazer **login de novo** depois da mudança.

## Testes

```bash
pnpm test
```

Os testes são unitários, com o Prisma substituído por um objeto falso, e cobrem sucesso e erro:

- **Chamados:** criação com o dono vindo do token, listagem filtrada por usuário (e sem filtro para o admin), busca pelo dono, por outro usuário (`404`) e pelo admin, id inexistente (`404`) e alteração de status.
- **Login:** credenciais corretas devolvem o token; e-mail inexistente e senha errada respondem `401` com a mesma mensagem.
- **Cadastro:** a senha é gravada como hash, o papel não é definido pelo cadastro e e-mail repetido responde `409`.

## Estrutura do projeto

```
prisma/              schema do banco e migrations
src/
  auth/              login, JWT, guards de autenticação e de papéis
  chamados/          CRUD de chamados
  usuarios/          cadastro de usuários
  prisma/            conexão com o banco
docker-compose.yml   PostgreSQL com volume
```

## Problemas comuns

- **A API não conecta ao banco:** confira se o container está de pé (`docker compose ps`). Depois de reiniciar o computador, rode `docker compose up -d` de novo.
- **O pnpm avisa de scripts de build ignorados:** rode `pnpm approve-builds` e aprove os pacotes do Prisma.
- **O banco foi criado com outra senha:** o PostgreSQL grava usuário e senha na primeira criação do volume. Para recomeçar do zero, use `docker compose down -v`, que **apaga os dados**.