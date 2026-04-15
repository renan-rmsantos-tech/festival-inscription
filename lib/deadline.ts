const DEADLINE_ISO = '2026-04-25T23:59:59-03:00' // America/Sao_Paulo

export function isBeforeDeadline(now: Date = new Date()): boolean {
  return now < new Date(DEADLINE_ISO)
}
