'use server'

import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { rsvps } from '@/lib/db/schema'
import { generateCode } from '@/lib/code'
import { isBeforeDeadline } from '@/lib/deadline'
import { verifyCookie } from '@/lib/cookie'
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
  } catch (err) {
    console.error('[submitRsvp]', err)
    return { ok: false, error: 'server' }
  }
}

export async function deleteRsvp(code: string): Promise<{ ok: boolean; error?: string }> {
  const jar = await cookies()
  if (!verifyCookie(jar.get('admin')?.value)) {
    return { ok: false, error: 'Não autorizado' }
  }

  try {
    await db.delete(rsvps).where(eq(rsvps.code, code))
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    console.error('[deleteRsvp]', err)
    return { ok: false, error: 'Erro ao excluir' }
  }
}
