function escapeField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

export function toCsv(headers: string[][], rows: string[][]): string {
  const lines = [...headers, ...rows]
    .map(row => row.map(escapeField).join(','))
    .join('\r\n')
  return `\uFEFF${lines}\r\n`
}
