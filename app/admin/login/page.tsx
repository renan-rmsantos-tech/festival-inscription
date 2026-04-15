'use client'

import { useActionState } from 'react'
import { adminLogin } from '@/app/actions/auth'

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(adminLogin, null)

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <form action={action} className="w-full max-w-sm space-y-4">
        <h1 className="font-heading text-2xl font-bold text-center">
          Área Administrativa
        </h1>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {state?.ok === false && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
