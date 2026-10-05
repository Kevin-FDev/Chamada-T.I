# 🛠️ Helpdesk System - Backend API

API RESTful robusta para gestão de chamados de suporte técnico e atendimento ao cliente, construída com boas práticas da indústria, arquitetura modular e tipagem estática.

---

## 🚀 Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com/) (Node.js + TypeScript)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Containerização:** [Docker](https://www.docker.com/) & Docker Compose
- **Testes:** Jest

---

## 📊 Estrutura do Banco de Dados

A aplicação utiliza o **Prisma ORM** com a seguinte modelagem principal:

- **User:** Gestão de utilizadores com perfis de acesso (`CLIENT`, `AGENT`, `ADMIN`).
- **Ticket:** Gestão de chamados com estados (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) e prioridades (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
- **Comment:** Histórico de interações e respostas dentro de cada chamado.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose

### Passos

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/teu-usuario/nome-do-projeto.git](https://github.com/teu-usuario/nome-do-projeto.git)
   cd nome-do-projeto