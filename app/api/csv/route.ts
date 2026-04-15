import { cookies } from 'next/headers'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { rsvps } from '@/lib/db/schema'
import { verifyCookie } from '@/lib/cookie'
import { toCsv } from '@/lib/csv'

export const runtime = 'nodejs'

function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${d}/${m}/${y} ${h}:${min}`
}

export async function GET() {
  const jar = await cookies()
  const token = jar.get('admin')?.value
  if (!verifyCookie(token)) {
    return new Response('Não autorizado', { status: 401 })
  }

  try {
    const rows = await db
      .select()
      .from(rsvps)
      .orderBy(asc(rsvps.createdAt))

    const headers = [['N°', 'Nome', 'Email', 'Telefone', 'Adultos', 'Crianças', 'Enviado em']]
    const data = rows.map((r, i) => [
      String(i + 1),
      r.name,
      r.email ?? '',
      r.phone ?? '',
      String(r.adults),
      String(r.children),
      formatDate(r.createdAt),
    ])

    const csv = toCsv(headers, data)
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="inscricoes-festa-2026-04-25.csv"',
      },
    })
  } catch {
    return new Response('Erro ao gerar CSV', { status: 500 })
  }
}
