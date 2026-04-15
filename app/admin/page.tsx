import { desc, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { rsvps } from '@/lib/db/schema'
import { findDuplicateNames } from '@/lib/duplicates'
import { adminLogout } from '@/app/actions/auth'
import { AdminTable } from '@/components/admin-table'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getTotals() {
  const [row] = await db
    .select({
      count: sql<number>`cast(count(*) as int)`,
      adults: sql<number>`cast(coalesce(sum(${rsvps.adults}), 0) as int)`,
      children: sql<number>`cast(coalesce(sum(${rsvps.children}), 0) as int)`,
      total: sql<number>`cast(coalesce(sum(${rsvps.adults} + ${rsvps.children}), 0) as int)`,
    })
    .from(rsvps)
  return row
}

async function getList() {
  return db
    .select()
    .from(rsvps)
    .orderBy(desc(rsvps.createdAt))
    .limit(500)
}

const stats = [
  { label: 'Inscrições', key: 'count' },
  { label: 'Adultos', key: 'adults' },
  { label: 'Crianças', key: 'children' },
  { label: 'Total de Pessoas', key: 'total' },
] as const

export default async function AdminPage() {
  const [totals, list] = await Promise.all([getTotals(), getList()])
  const duplicates = findDuplicateNames(list.map((r) => r.name))

  return (
    <main className="flex flex-col flex-1 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 lg:px-10 border-b border-border">
        <h1 className="font-heading text-h5 font-bold text-navy">
          Painel Administrativo
        </h1>
        <div className="flex items-center gap-4">
          <a
            href="/api/csv"
            className="font-sans text-body-sm font-medium text-navy underline underline-offset-4 hover:text-wine transition-colors"
          >
            Exportar CSV
          </a>
          <form action={adminLogout}>
            <button
              type="submit"
              className="font-sans text-body-sm font-medium text-wine hover:text-wine/70 transition-colors cursor-pointer"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      {/* Totals */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 lg:px-10 py-8">
        {stats.map(({ label, key }) => (
          <div
            key={key}
            className="flex flex-col gap-1 p-5 border border-border rounded-sm"
          >
            <span className="font-sans text-caption-sm tracking-[0.22em] uppercase font-semibold text-body-ink/55">
              {label}
            </span>
            <span className="font-heading text-h3 font-bold text-navy">
              {totals[key]}
            </span>
          </div>
        ))}
      </section>

      {/* List */}
      <section className="flex-1 px-6 lg:px-10 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-h5 font-bold text-navy">
            Inscrições
          </h2>
          {duplicates.size > 0 && (
            <span className="flex items-center gap-2 text-body-sm text-gold font-medium">
              <span className="inline-block w-3 h-3 rounded-full bg-gold/30" />
              {duplicates.size} nome{duplicates.size > 1 ? 's' : ''} duplicado
              {duplicates.size > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <AdminTable rows={list} duplicates={duplicates} />
      </section>
    </main>
  )
}
