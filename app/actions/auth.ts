'use server'

import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { signCookie } from '@/lib/cookie'

export async function adminLogin(_prev: unknown, formData: FormData) {
  const password = formData.get('password')
  if (typeof password !== 'string' || !password) {
    return { ok: false as const, error: 'Senha inválida' }
  }

  const hash = process.env.ADMIN_PASSWORD_HASH!
  if (!(await bcrypt.compare(password, hash))) {
    return { ok: false as const, error: 'Senha inválida' }
  }

  const jar = await cookies()
  jar.set('admin', signCookie('ok'), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  redirect('/admin')
}

export async function adminLogout() {
  const jar = await cookies()
  jar.delete('admin')
  redirect('/admin/login')
}
