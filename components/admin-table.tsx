import type { Rsvp } from '@/lib/db/schema'
import { normalizeName } from '@/lib/duplicates'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function AdminTable({
  rows,
  duplicates,
}: {
  rows: Rsvp[]
  duplicates: Set<string>
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-navy/5">
          <TableHead className="w-[60px]">N°</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead className="text-right">Adultos</TableHead>
          <TableHead className="text-right">Crianças</TableHead>
          <TableHead className="text-right">Enviado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => {
          const isDuplicate = duplicates.has(normalizeName(row.name))
          return (
            <TableRow
              key={row.code}
              className={isDuplicate ? 'bg-gold/15' : undefined}
            >
              <TableCell className="font-medium text-body-ink/60">
                {i + 1}
              </TableCell>
              <TableCell>
                <span className="font-medium">{row.name}</span>
                {isDuplicate && (
                  <span className="ml-2 text-caption-sm font-semibold uppercase tracking-[0.18em] text-gold">
                    Duplicado
                  </span>
                )}
              </TableCell>
              <TableCell className="text-body-ink/70">
                {row.email || row.phone || '—'}
              </TableCell>
              <TableCell className="text-right">{row.adults}</TableCell>
              <TableCell className="text-right">{row.children}</TableCell>
              <TableCell className="text-right text-body-ink/60">
                {dateFormatter.format(row.createdAt)}
              </TableCell>
            </TableRow>
          )
        })}
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-24 text-center text-muted-foreground"
            >
              Nenhuma inscrição registrada.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
