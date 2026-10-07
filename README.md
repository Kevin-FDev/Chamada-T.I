# Backend de Gerenciamento de Chamados de TI

Este projeto é um backend desenvolvido para o gerenciamento de chamados de suporte de TI no contexto acadêmico. A aplicação permite a abertura, consulta, atualização e remoção (CRUD completo) de chamados, contando com validações automáticas de dados, persistência em banco relacional e documentação de API.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem & Framework:** TypeScript, NestJS
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Containerização:** Docker e Docker Compose
- **Documentação de API:** Swagger (`@nestjs/swagger`)
- **Validação de Dados:** `class-validator` e `class-transformer`
- **Testes Automatizados:** Vitest / NestJS Testing
- **Gerenciador de Pacotes:** `pnpm`

---

## ⚙️ Instruções de Configuração e Execução

### Pré-requisitos
- Node.js instalado (v18 ou superior)
- `pnpm` instalado (`npm install -g pnpm`)
- Docker e Docker Compose instalados e em execução

### Passo a Passo

1. **Instalar as dependências do projeto:**
   ```bash
   pnpm install