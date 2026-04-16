# Festival Inscription

Aplicação de RSVP para inscrição em festival, construída em **Next.js 16** (App Router), **React 19**, **Drizzle ORM** sobre **Postgres** e **Tailwind CSS 4**.

Inclui formulário público de inscrição, página de confirmação por código, área administrativa protegida por senha e exportação de CSV.

## Stack

- Next.js 16.2.3 (App Router) + React 19
- Drizzle ORM + `postgres-js`
- Tailwind CSS 4 + Radix UI
- Zod + React Hook Form
- Auth admin via bcrypt + cookie HMAC assinado
- Gerenciador de pacotes: **pnpm**

> Atenção: este projeto usa convenções novas do Next.js 16. O middleware, por exemplo, vive em `proxy.ts` na raiz — não em `middleware.ts`. Consulte `AGENTS.md` antes de alterar estrutura.

## Pré-requisitos

- Node.js 20+ (o runtime padrão do Vercel hoje é Node 24 LTS)
- pnpm 9+
- Um banco Postgres (Neon, Supabase, Vercel Marketplace, local, etc.)

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com:

```bash
# URL de conexão Postgres (pooled, ex.: Neon/Supabase)
DATABASE_URL="postgres://user:pass@host:5432/db"

# Hash bcrypt da senha de admin (ver como gerar abaixo)
ADMIN_PASSWORD_HASH="$2b$12$..."

# Segredo usado para assinar o cookie de sessão do admin
COOKIE_SECRET="uma-string-aleatoria-longa"
```

### Gerar `ADMIN_PASSWORD_HASH`

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" 'minhaSenha'
```

### Gerar `COOKIE_SECRET`

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Rodando localmente

```bash
pnpm install
pnpm db:push        # aplica o schema Drizzle no banco apontado por DATABASE_URL
pnpm dev            # http://localhost:3000
```

Rotas principais:

- `/` — formulário público de inscrição
- `/confirmacao/[code]` — confirmação com o código gerado
- `/admin/login` — login (senha definida pelo hash)
- `/admin` — listagem das inscrições
- `/api/csv` — export em CSV (requer sessão admin)

## Banco de dados

O schema fica em `lib/db/schema.ts` (tabela `rsvps`). Para evoluir:

```bash
pnpm db:push
```

`db:push` é adequado para desenvolvimento e para este projeto simples. Para produção com histórico de migrations, gere arquivos com `drizzle-kit generate` e aplique-os no pipeline.

## Deploy no Vercel

O projeto roda em Fluid Compute padrão do Vercel sem configuração adicional.

### 1. Banco de dados

Antes de fazer deploy, provisione um Postgres. Opções via Vercel Marketplace:

- **Neon** (recomendado — serverless Postgres)
- **Supabase**

No Marketplace, a variável `DATABASE_URL` é injetada automaticamente no projeto após a integração. Use a **connection string pooled** (o driver aqui é `postgres-js` com `prepare: false`, compatível com pgBouncer/Neon pooler).

### 2. Criar o projeto

Via CLI:

```bash
pnpm dlx vercel@latest link
pnpm dlx vercel@latest env add ADMIN_PASSWORD_HASH
pnpm dlx vercel@latest env add COOKIE_SECRET
# DATABASE_URL geralmente já vem da integração do Marketplace
```

Ou via dashboard: **New Project → Import Git Repository**, e adicione as três variáveis em *Settings → Environment Variables* para **Production**, **Preview** e **Development**.

### 3. Aplicar o schema no banco de produção

Com `DATABASE_URL` de produção no shell:

```bash
pnpm dlx vercel@latest env pull .env.production.local
DATABASE_URL="$(grep ^DATABASE_URL .env.production.local | cut -d= -f2- | tr -d '\"')" pnpm db:push
```

### 4. Deploy

```bash
pnpm dlx vercel@latest          # preview
pnpm dlx vercel@latest --prod   # produção
```

Pushes na branch principal geram deploy de produção automaticamente; demais branches/PRs geram preview URLs.

### Build settings no Vercel

Detectados automaticamente (framework Next.js):

- Install: `pnpm install`
- Build: `pnpm build`
- Output: `.next`

Nenhum `vercel.json` é necessário.

## Scripts

| Comando        | O que faz                                 |
| -------------- | ----------------------------------------- |
| `pnpm dev`     | Servidor de desenvolvimento               |
| `pnpm build`   | Build de produção                         |
| `pnpm start`   | Serve o build local                       |
| `pnpm lint`    | ESLint                                    |
| `pnpm db:push` | Sincroniza o schema Drizzle com o Postgres |

## Estrutura

```
app/
  actions/        # Server Actions (auth, rsvp)
  admin/          # área protegida + login
  api/csv/        # export CSV
  confirmacao/    # página de confirmação por código
lib/
  db/             # client Drizzle + schema
  validators/     # schemas Zod
  cookie.ts       # assinatura HMAC do cookie admin
  deadline.ts     # data limite de inscrição
proxy.ts          # middleware do Next 16 (protege /admin)
```
