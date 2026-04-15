'use server'

import { db } from '@/lib/db'
import { rsvps } from '@/lib/db/schema'
import { generateCode } from '@/lib/code'
import { isBeforeDeadline } from '@/lib/deadline'
import { rsvpSchema, type RsvpResult } from '@/lib/validators/rsvp'

export async function submitRsvp(input: unknown): Promise<RsvpResult> {
  if (!isBeforeDeadline()) {
    return { ok: false, error: 'deadline' }
  }

  const parsed = rsvpSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.')
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message
      }
    }
    return { ok: false, error: 'validation', fieldErrors }
  }

  const { name, email, phone, adults, children } = parsed.data

  try {
    const code = generateCode()
    await db.insert(rsvps).values({
      code,
      name,
      email: email || null,
      phone: phone || null,
      adults,
      children,
    })
    return { ok: true, code }
  } catch {
    return { ok: false, error: 'server' }
  }
}
