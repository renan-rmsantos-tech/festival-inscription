export function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function findDuplicateNames(names: string[]): Set<string> {
  const seen = new Map<string, number>()
  for (const name of names) {
    const key = normalizeName(name)
    seen.set(key, (seen.get(key) ?? 0) + 1)
  }

  const duplicates = new Set<string>()
  for (const [key, count] of seen) {
    if (count > 1) duplicates.add(key)
  }
  return duplicates
}
