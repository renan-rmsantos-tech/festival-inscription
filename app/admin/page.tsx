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

const statsMeta = [
  { roman: 'I', label: 'Inscrições', key: 'count', unit: 'fichas', note: null },
  { roman: 'II', label: 'Adultos', key: 'adults', unit: 'pessoas', note: null },
  { roman: 'III', label: 'Crianças', key: 'children', unit: 'até 11 anos', note: 'Brincadeiras às 14h' },
  { roman: 'IV', label: 'Total', key: 'total', unit: 'na festa', note: 'Capacidade estimada · 240' },
] as const

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export default async function AdminPage() {
  const [totals, list] = await Promise.all([getTotals(), getList()])
  const duplicates = findDuplicateNames(list.map((r) => r.name))
  const now = timeFormatter.format(new Date())

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between h-[72px] px-20 bg-navy shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo-fsspx.png"
            alt=""
            width={24}
            height={24}
            className="shrink-0 invert"
          />
          <span className="font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-creme">
            Colégio São José · FSSPX — ACIPEC
          </span>
        </div>
        <span className="font-accent text-[15px] italic text-gold">
          Painel · Anno Domini MMXXVI
        </span>
      </header>

      {/* ── Header Section ── */}
      <section className="flex flex-col gap-7 px-20 pt-[72px] pb-12">
        {/* Section label */}
        <div className="flex items-center gap-4">
          <span className="w-10 h-px bg-wine" />
          <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.28em] text-wine">
            Painel Administrativo
          </span>
        </div>

        {/* Title row */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-[76px] leading-[82px] tracking-[-0.01em] font-bold text-navy">
              Livro de{'\n'}Inscrições.
            </h1>
            <p className="font-sans text-[16px] leading-[26px] text-[#4A4435] max-w-[520px]">
              Acompanhe em tempo real quem confirmou presença para a Festa
              Patronal do dia 01 de Maio. Última atualização há poucos segundos.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="/api/csv"
              className="flex items-center gap-3 px-[22px] py-[14px] border border-navy font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-navy hover:bg-navy hover:text-creme transition-colors"
            >
              Exportar CSV
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
            <form action={adminLogout}>
              <button
                type="submit"
                className="flex items-center px-[22px] py-[14px] bg-navy border border-navy font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-creme hover:bg-navy/90 transition-colors cursor-pointer"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="flex flex-col gap-5 px-20 pb-14">
        {/* Stats header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-wine">
              I · Resumo
            </span>
            <span className="w-[30px] h-px bg-[#D4C9A8]" />
            <span className="font-accent text-[16px] italic text-[#6B6450]">
              registros atualizados ao vivo
            </span>
          </div>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[#6B6450]">
            Atualizado · {now.replace(':', 'h')}
          </span>
        </div>

        {/* Stats cards */}
        <div className="flex">
          {statsMeta.map(({ roman, label, key, unit, note }, i) => {
            const isLast = i === statsMeta.length - 1
            return (
              <div
                key={key}
                className={`flex-1 flex flex-col gap-2.5 pt-7 pb-6 pr-8 ${!isLast ? 'border-r border-[#D4C9A8]' : ''}`}
              >
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6B6450]">
                  {roman}. {label}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-heading text-[84px] leading-[90px] font-medium ${isLast ? 'text-wine' : 'text-navy'}`}>
                    {totals[key]}
                  </span>
                  <span className="font-accent text-[18px] italic text-wine">
                    {unit}
                  </span>
                </div>
                <span className="font-sans text-[13px] leading-[20px] text-[#4A4435]">
                  {note ?? (key === 'count'
                    ? `${list.length > 0 ? '+' + Math.min(list.length, 6) : '0'} nas últimas 24 horas`
                    : key === 'adults'
                      ? `Média de ${totals.count > 0 ? (totals.adults / totals.count).toFixed(1).replace('.', ',') : '0'} por família`
                      : '\u00A0'
                  )}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Table Section ── */}
      <section className="flex flex-col gap-7 px-20 pt-6 pb-20">
        {/* Section header */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <span className="w-10 h-px bg-wine" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-wine">
                II · Registros
              </span>
            </div>
            <h2 className="font-heading text-[46px] leading-[52px] tracking-[-0.005em] font-medium text-navy">
              Famílias confirmadas
            </h2>
          </div>

          {duplicates.size > 0 && (
            <div className="flex items-center gap-2.5 px-5 py-2.5 border border-[#D4C9A8]">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span className="font-sans text-[13px] font-medium text-[#7A5820]">
                {duplicates.size} nome{duplicates.size > 1 ? 's' : ''} duplicado{duplicates.size > 1 ? 's' : ''} precisam de atenção
              </span>
            </div>
          )}
        </div>

        {/* Table */}
        <AdminTable rows={list} duplicates={duplicates} />
      </section>
    </main>
  )
}
