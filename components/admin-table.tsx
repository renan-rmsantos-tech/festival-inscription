'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Rsvp } from '@/lib/db/schema'
import { normalizeName } from '@/lib/duplicates'
import { deleteRsvp } from '@/app/actions/rsvp'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'agora mesmo'
  if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`
  const days = Math.floor(hours / 24)
  return `há ${days} dia${days > 1 ? 's' : ''}`
}

type Filter = 'all' | 'today' | 'duplicates'

export function AdminTable({
  rows,
  duplicates,
}: {
  rows: Rsvp[]
  duplicates: Set<string>
}) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleting, startDelete] = useTransition()

  const todayCount = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return rows.filter((r) => r.createdAt >= today).length
  }, [rows])

  const filtered = useMemo(() => {
    let result = rows

    if (filter === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      result = result.filter((r) => r.createdAt >= today)
    } else if (filter === 'duplicates') {
      result = result.filter((r) => duplicates.has(normalizeName(r.name)))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((r) => r.name.toLowerCase().includes(q))
    }

    return result
  }, [rows, filter, search, duplicates])

  return (
    <div className="flex flex-col">
      {/* Search & Filters */}
      <div className="flex items-center justify-between pb-5 border-b border-[#D4C9A8]">
        {/* Search */}
        <div className="flex items-center gap-3 w-[500px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6450" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar pelo nome do responsável…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent font-accent text-[18px] italic text-[#6B6450] placeholder:text-[#6B6450]/60 focus:outline-none"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setFilter('all')}
            className={`font-sans text-[11px] font-semibold uppercase tracking-[0.22em] cursor-pointer transition-colors ${
              filter === 'all' ? 'text-navy' : 'text-[#6B6450]'
            }`}
          >
            Todas · {rows.length}
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`font-sans text-[11px] font-medium uppercase tracking-[0.22em] cursor-pointer transition-colors ${
              filter === 'today' ? 'text-navy font-semibold' : 'text-[#6B6450]'
            }`}
          >
            Hoje · {todayCount}
          </button>
          <button
            onClick={() => setFilter('duplicates')}
            className={`font-sans text-[11px] font-medium uppercase tracking-[0.22em] cursor-pointer transition-colors ${
              filter === 'duplicates' ? 'text-navy font-semibold' : 'text-[#6B6450]'
            }`}
          >
            Duplicadas · {duplicates.size}
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2 pl-6 border-l border-[#D4C9A8]">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[#6B6450]">
              Ordenar
            </span>
            <span className="font-accent text-[17px] italic text-navy">
              mais recentes primeiro
            </span>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="flex items-center py-3.5 border-b-2 border-navy">
        <span className="w-[60px] shrink-0 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B6450]">
          N.º
        </span>
        <span className="w-[360px] shrink-0 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B6450]">
          Responsável
        </span>
        <span className="w-[280px] shrink-0 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B6450]">
          Contato
        </span>
        <span className="w-[90px] shrink-0 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B6450]">
          Adultos
        </span>
        <span className="w-[90px] shrink-0 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B6450]">
          Crianças
        </span>
        <span className="w-[90px] shrink-0 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B6450]">
          Total
        </span>
        <span className="w-[160px] shrink-0 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B6450] pl-4">
          Recebida em
        </span>
        <span className="w-[150px] shrink-0 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B6450]">
          Ação
        </span>
      </div>

      {/* Rows */}
      {filtered.map((row, i) => {
        const isDuplicate = duplicates.has(normalizeName(row.name))
        const total = row.adults + row.children
        const isNew = Date.now() - row.createdAt.getTime() < 3_600_000

        return (
          <div key={row.code}>
          <div
            className={`flex items-center py-4 border-b border-[#E8E0CF] ${
              isNew ? 'bg-[#C28E3C]/6' : ''
            }`}
          >
            {/* Number */}
            <span className="w-[60px] shrink-0 font-accent text-[18px] italic text-gold">
              {rows.length - i}
            </span>

            {/* Name */}
            <div className="w-[360px] shrink-0 flex items-start gap-3">
              <div className="flex flex-col">
                <span className="font-sans text-[15px] font-semibold leading-[18px] text-navy">
                  {row.name}
                </span>
                <span className={`font-sans text-[11px] italic leading-[14px] ${isNew ? 'text-gold' : 'text-[#6B6450]'}`}>
                  {relativeTime(row.createdAt)}
                </span>
              </div>
              {isDuplicate && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-gold/15">
                  <span className="w-[5px] h-[5px] rounded-full bg-gold" />
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7A5820]">
                    Duplo
                  </span>
                </span>
              )}
            </div>

            {/* Contact */}
            <div className="w-[280px] shrink-0 flex flex-col">
              <span className="font-sans text-[13px] leading-[16px] text-[#4A4435]">
                {row.email || '—'}
              </span>
              <span className="font-sans text-[13px] leading-[16px] text-[#4A4435]">
                {row.phone || '—'}
              </span>
            </div>

            {/* Adults */}
            <span className="w-[90px] shrink-0 text-right font-heading text-[22px] leading-[28px] font-medium text-navy">
              {row.adults}
            </span>

            {/* Children */}
            <span className="w-[90px] shrink-0 text-right font-heading text-[22px] leading-[28px] font-medium text-navy">
              {row.children}
            </span>

            {/* Total */}
            <span className="w-[90px] shrink-0 text-right font-heading text-[22px] leading-[28px] font-semibold text-wine">
              {total}
            </span>

            {/* Date */}
            <div className="w-[160px] shrink-0 flex flex-col pl-4">
              <span className="font-sans text-[13px] leading-[16px] text-[#4A4435]">
                {dateFormatter.format(row.createdAt).replace('.', '')}
              </span>
              <span className="font-sans text-[11px] leading-[14px] text-[#6B6450]">
                {timeFormatter.format(row.createdAt).replace(':', 'h')}
              </span>
            </div>

            {/* Actions */}
            <div className="w-[150px] shrink-0 flex items-center justify-end gap-4">
              <button
                onClick={() => setExpanded(expanded === row.code ? null : row.code)}
                className="font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-navy underline underline-offset-[3px] decoration-1 cursor-pointer hover:text-navy/70 transition-colors"
              >
                {expanded === row.code ? 'Fechar' : 'Detalhes'}
              </button>
              <button
                disabled={deleting}
                onClick={() => {
                  if (!confirm(`Excluir inscrição de ${row.name}?`)) return
                  startDelete(async () => {
                    await deleteRsvp(row.code)
                    router.refresh()
                  })
                }}
                className="font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-wine cursor-pointer hover:text-wine/70 transition-colors disabled:opacity-50"
              >
                Excluir
              </button>
            </div>
          </div>

          {/* Expanded details */}
          {expanded === row.code && (
            <div className="flex gap-8 px-[60px] py-5 bg-creme border-b border-[#E8E0CF]">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6450]">Código</span>
                <span className="font-heading text-[18px] font-medium text-navy">{row.code}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6450]">Responsável</span>
                <span className="font-sans text-[14px] text-navy">{row.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6450]">E-mail</span>
                <span className="font-sans text-[14px] text-navy">{row.email || '—'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6450]">Telefone</span>
                <span className="font-sans text-[14px] text-navy">{row.phone || '—'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6450]">Adultos</span>
                <span className="font-sans text-[14px] text-navy">{row.adults}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6450]">Crianças</span>
                <span className="font-sans text-[14px] text-navy">{row.children}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6450]">Inscrito em</span>
                <span className="font-sans text-[14px] text-navy">
                  {dateFormatter.format(row.createdAt)} às {timeFormatter.format(row.createdAt)}
                </span>
              </div>
            </div>
          )}
          </div>
        )
      })}

      {filtered.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <span className="font-accent text-[18px] italic text-[#6B6450]">
            Nenhuma inscrição encontrada.
          </span>
        </div>
      )}
    </div>
  )
}
