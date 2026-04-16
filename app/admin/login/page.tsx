'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { adminLogin } from '@/app/actions/auth'

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(adminLogin, null)

  return (
    <main className="flex min-h-svh">
      {/* Left Panel — Navy */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#1B2340] px-20 py-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/images/logo-fsspx.png"
            alt=""
            width={24}
            height={24}
            className="shrink-0 invert"
          />
          <span className="font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-[#F6F1E6]/70">
            Colégio São José · FSSPX
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="w-10 h-px bg-[#F6F1E6]/20" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
              Festa Patronal MMXXVI
            </span>
          </div>
          <h1 className="font-heading text-[68px] leading-[74px] tracking-[-0.01em] font-bold text-[#F6F1E6]">
            Livro de{'\n'}Inscrições.
          </h1>
          <p className="font-sans text-[16px] leading-[28px] text-[#F6F1E6]/55 max-w-[380px]">
            Acesse o painel para acompanhar as famílias confirmadas e gerir os preparativos da festa.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4">
          <span className="font-accent text-[15px] italic text-[#F6F1E6]/35">
            Ite ad Joseph
          </span>
          <span className="w-5 h-px bg-[#F6F1E6]/15" />
          <span className="font-accent text-[15px] italic text-[#F6F1E6]/35">
            01 de Maio de 2026
          </span>
        </div>
      </div>

      {/* Right Panel — Cream */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-6 py-12">
        <form action={action} className="w-full max-w-[380px] flex flex-col gap-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-wine">
              Área Restrita
            </span>
            <h2 className="font-heading text-[36px] leading-[42px] font-medium text-[#1B2340] text-center">
              Acesso ao{'\n'}Painel
            </h2>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="password"
                className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B6450]"
              >
                Senha de Acesso
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                className="w-full h-[52px] px-[18px] bg-white border border-[#D4C9A8] font-sans text-[16px] text-[#1B2340] focus:border-[#1B2340] focus:outline-none transition-colors"
              />
            </div>

            {state?.ok === false && (
              <p className="font-sans text-[13px] text-wine">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="flex items-center justify-center gap-3 w-full h-[52px] bg-[#1B2340] border border-[#1B2340] font-sans text-[12px] font-semibold uppercase tracking-[0.24em] text-[#F6F1E6] hover:bg-[#141B30] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {pending ? 'Entrando…' : 'Entrar'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <span className="flex-1 h-px bg-[#D4C9A8]" />
            <span className="font-accent text-[14px] italic text-[#6B6450]">ou</span>
            <span className="flex-1 h-px bg-[#D4C9A8]" />
          </div>

          {/* Back link */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="font-sans text-[13px] text-[#6B6450] hover:text-[#1B2340] transition-colors"
            >
              Voltar ao site principal
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
