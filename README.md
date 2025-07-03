# H8X - Plataforma de Marketplace Digital

<div align="center">
  <img src="public/logo.png" alt="H8X Logo" width="120" height="120">
  
  <p align="center">
    Uma plataforma moderna de marketplace que conecta compradores e vendedores
    <br />
    <a href="#sobre-o-projeto"><strong>Explorar a documentação »</strong></a>
    <br />
    <br />
    <a href="#demonstração">Ver Demo</a>
    ·
    <a href="#instalação">Instalação</a>
    ·
    <a href="#contribuição">Contribuir</a>
  </p>
</div>

## Sobre o Projeto

H8X é uma plataforma de marketplace digital desenvolvida com tecnologias modernas, oferecendo uma experiência intuitiva para compra e venda de produtos. A aplicação combina design responsivo, performance otimizada e funcionalidades avançadas de comunicação entre usuários.

### Principais Funcionalidades

- **Marketplace Completo**: Criação, visualização e gerenciamento de produtos
- **Tipos de Produto**: Produtos pagos e gratuitos (Bizu)
- **Autenticação Segura**: Sistema de login com Google OAuth
- **Chat Integrado**: Comunicação direta entre compradores e vendedores
- **Design Mobile-First**: Interface otimizada para dispositivos móveis
- **Busca Avançada**: Filtros e busca por produtos
- **Upload de Imagens**: Suporte a imagens por produto
- **Perfil de Vendedor**: Gerenciamento completo de produtos e conversas

## Tecnologias Utilizadas

### Frontend

- **[Next.js 15](https://nextjs.org/)** - Framework React com SSR/SSG
- **[React 19](https://react.dev/)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário

### Backend & Database

- **[Prisma](https://www.prisma.io/)** - ORM moderno para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Better Auth](https://www.better-auth.com/)** - Sistema de autenticação

### DevOps & Qualidade

- **[Jest](https://jestjs.io/)** - Framework de testes unitários
- **[Playwright](https://playwright.dev/)** - Testes end-to-end
- **[React Testing Library](https://testing-library.com/)** - Utilitários de teste

### Serviços Externos

- **[AWS S3](https://aws.amazon.com/s3/)** - Armazenamento de imagens

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** (versão 12 ou superior)
- **Git**

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/h8x-app.git
cd h8x-app
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/h8x_db"

# Authentication
BETTER_AUTH_SECRET="seu-secret-key-aqui"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# AWS S3
AWS_ACCESS_KEY_ID="seu-access-key"
AWS_SECRET_ACCESS_KEY="seu-secret-access-key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="seu-bucket-name"

# Email
RESEND_API_KEY="seu-resend-api-key"
```

### 4. Configure o banco de dados

```bash
# Execute as migrações
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate
```

### 5. Execute a aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                # Inicia o servidor de desenvolvimento
npm run build             # Gera build de produção
npm run start             # Inicia servidor de produção
npm run lint              # Executa verificação de código

# Testes
npm run test              # Executa testes unitários
npm run test:watch        # Executa testes em modo watch
npm run test:coverage     # Gera relatório de cobertura
npm run test:e2e          # Executa testes end-to-end
npm run test:all          # Executa todos os testes

# Banco de dados
npx prisma studio         # Interface visual do banco
npx prisma migrate dev    # Executa migrações em desenvolvimento # Popula banco com dados iniciais
```

## Estrutura do Projeto

```
h8x-app/
├── prisma/                 # Esquemas e migrações do banco
│   ├── migrations/         # Arquivos de migração
│   └── schema.prisma      # Modelo do banco de dados
├── public/                # Arquivos estáticos
├── src/
│   ├── app/               # App Router do Next.js
│   │   ├── (authentication)/  # Páginas de autenticação
│   │   ├── (home)/           # Página inicial
│   │   ├── api/              # Rotas da API
│   │   ├── components/       # Componentes globais
│   │   ├── products/         # Páginas de produtos
│   │   ├── profile/          # Páginas de perfil
│   │   └── styles/           # Estilos globais
│   ├── components/        # Componentes reutilizáveis
│   │   └── ui/           # Componentes de interface
│   ├── contexts/         # Contextos React
│   ├── lib/              # Utilitários e configurações
│   ├── schemas/          # Validação com Zod
│   └── __tests__/        # Testes automatizados
├── tests/
│   └── e2e/              # Testes end-to-end
└── docs/                 # Documentação adicional
```

## Testes

O projeto possui uma suíte completa de testes:

### Testes Unitários e de Integração

```bash
npm run test              # Executa todos os testes Jest
npm run test:coverage     # Gera relatório de cobertura
```

### Testes End-to-End

```bash
npm run test:e2e          # Executa testes com Playwright
npm run test:e2e:headed   # Executa com interface visual
```

Para mais detalhes sobre testes, consulte [README-TESTING.md](README-TESTING.md).

## Funcionalidades Detalhadas

### Autenticação

- Login social com Google

### Produtos

- Criação de produtos com imagens
- Categorização: Produtos pagos e gratuitos (Bizu)
- Buscas por nome e categoria
- Gerenciamento completo pelo vendedor

### Comunicação

- Sistema de chat em tempo real
- Conversas organizadas por produto
- Histórico de mensagens persistente

### Interface do Usuário

- Design responsivo e moderno
- Componentes acessíveis
- Tema consistente em toda aplicação

## Agradecimentos

- Ao professor Inaldo Capistrano pelo suporte e orientação.

---

<div align="center">
  <p>© 2025 H8X. Todos os direitos reservados.</p>
</div>
