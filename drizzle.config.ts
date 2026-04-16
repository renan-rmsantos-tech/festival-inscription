import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'drizzle-kit'
import { resolve } from 'node:path'

// drizzle-kit only auto-loads `.env`; Next.js also loads `.env.local`. Match that so
// `pnpm db:push` uses the same DATABASE_URL as `pnpm dev`. `override` lets `.env.local`
// win over a stray DATABASE_URL injected by the shell/IDE.
const root = process.cwd()
loadEnv({ path: resolve(root, '.env'), quiet: true })
loadEnv({ path: resolve(root, '.env.local'), override: true, quiet: true })

export default defineConfig({
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
