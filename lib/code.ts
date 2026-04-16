import { customAlphabet } from 'nanoid'

const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // 31 chars, sem 0/O/1/I/L
const nano = customAlphabet(alphabet, 5)

export function generateCode(year = 2026): string {
  return `${year}-${nano()}`
}
