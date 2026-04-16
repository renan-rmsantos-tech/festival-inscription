'use client'

import { useState, useTransition, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitRsvp } from '@/app/actions/rsvp'
import { rsvpSchema, type RsvpInput } from '@/lib/validators/rsvp'

export function RsvpForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<RsvpInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      adults: 1,
      children: 0,
    },
    mode: 'onSubmit',
  })

  const adults = watch('adults')
  const children = watch('children')
  const name = watch('name')
  const total = adults + children
  const canSubmit = name.trim().length > 0 && total > 0

  function onSubmit(data: RsvpInput) {
    setServerError(null)
    startTransition(async () => {
      try {
        const result = await submitRsvp(data)
        if (result.ok) {
          router.push(`/confirmacao/${encodeURIComponent(result.code)}`)
          return
        }
        if (result.error === 'deadline') {
          setServerError('Inscrições encerradas.')
          return
        }
        if (result.error === 'validation' && result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            setError(field as keyof RsvpInput, { message })
          }
          return
        }
        setServerError('Não foi possível enviar. Tente novamente.')
      } catch {
        setServerError('Não foi possível enviar. Tente novamente.')
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-10 bg-creme-dark border border-navy/20 p-8 sm:p-10 lg:p-14"
    >
      {serverError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 bg-wine/10 border border-wine/30 px-4 py-3"
        >
          <p className="font-sans text-[14px] text-wine font-medium">
            {serverError}
          </p>
          <button
            type="button"
            onClick={() => setServerError(null)}
            className="shrink-0 text-wine/70 hover:text-wine text-lg leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pb-6 border-b border-navy/20">
        <h3 className="font-heading text-[22px] leading-[28px] tracking-[-0.005em] font-semibold text-navy">
          Ficha de Inscrição
        </h3>
        <span className="font-sans text-[12px] leading-[16px] tracking-[0.18em] uppercase font-medium text-body-ink/55">
          N.º 2026 / ____
        </span>
      </div>

      <Field
        label="Nome completo do responsável"
        badge="Obrigatório"
        badgeTone="required"
        error={errors.name?.message}
      >
        <input
          type="text"
          autoComplete="name"
          placeholder="Maria das Graças Oliveira"
          className="w-full bg-transparent pt-4 pb-3 border-b-[1.5px] border-navy font-accent text-[22px] leading-[28px] italic text-body-ink placeholder:text-body-ink/35 focus:outline-none"
          {...register('name')}
        />
      </Field>

      <div className="flex flex-col sm:flex-row gap-8">
        <Field
          label="E-mail"
          badge="Opcional"
          badgeTone="optional"
          error={errors.email?.message}
        >
          <input
            type="email"
            autoComplete="email"
            placeholder="maria@exemplo.com.br"
            className="w-full bg-transparent pt-4 pb-3 border-b-[1.5px] border-navy/55 font-accent text-[20px] leading-[24px] italic text-body-ink placeholder:text-body-ink/35 focus:outline-none focus:border-navy"
            {...register('email')}
          />
        </Field>
        <Field
          label="Telefone"
          badge="Opcional"
          badgeTone="optional"
          error={errors.phone?.message}
        >
          <input
            type="tel"
            autoComplete="tel"
            placeholder="(11) 98765-4321"
            className="w-full bg-transparent pt-4 pb-3 border-b-[1.5px] border-navy/55 font-accent text-[20px] leading-[24px] italic text-body-ink placeholder:text-body-ink/35 focus:outline-none focus:border-navy"
            {...register('phone')}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-5 pt-4 border-t border-dashed border-navy/25">
        <div className="flex items-baseline pt-1 gap-4">
          <span className="shrink-0 font-sans text-[11px] leading-[14px] tracking-[0.22em] uppercase font-semibold text-body-ink">
            Quantas pessoas virão com você
          </span>
          <div className="flex-1 h-px bg-navy/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <Counter
            tone="navy"
            label="Adultos"
            hint="12+ anos"
            value={adults}
            onChange={(v) => setValue('adults', v, { shouldValidate: false })}
            name="adultos"
          />
          <Counter
            tone="wine"
            label="Crianças"
            hint="Até 11 anos"
            value={children}
            onChange={(v) => setValue('children', v, { shouldValidate: false })}
            name="crianças"
          />
        </div>
        {errors.adults?.message && (
          <span className="font-sans text-[12px] text-wine">
            {errors.adults.message}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-4">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[11px] leading-[14px] tracking-[0.2em] uppercase font-semibold text-body-ink/55">
            Total da sua comitiva
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-[32px] leading-[36px] font-bold text-navy tabular-nums">
              {total}
            </span>
            <span className="font-accent text-[20px] leading-[24px] italic font-medium text-body-ink/70">
              {total === 1 ? 'pessoa' : 'pessoas'}
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={!canSubmit || isPending}
          className="inline-flex items-center justify-center gap-3.5 bg-navy py-[22px] px-9 transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-sans text-[14px] leading-[18px] tracking-[0.18em] uppercase font-semibold text-creme">
            {isPending ? 'Enviando…' : 'Confirmar Inscrição'}
          </span>
          <span aria-hidden className="font-sans text-[14px] leading-[18px] text-gold">
            →
          </span>
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  badge,
  badgeTone,
  error,
  children,
}: {
  label: string
  badge: string
  badgeTone: 'required' | 'optional'
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col grow gap-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-sans text-[11px] leading-[14px] tracking-[0.22em] uppercase font-semibold text-body-ink">
          {label}
        </span>
        <span
          className={
            badgeTone === 'required'
              ? 'font-sans text-[10px] leading-[12px] tracking-[0.18em] uppercase font-medium text-wine'
              : 'font-sans text-[10px] leading-[12px] tracking-[0.18em] uppercase font-medium text-body-ink/50'
          }
        >
          {badge}
        </span>
      </div>
      {children}
      {error && (
        <span className="font-sans text-[12px] text-wine">{error}</span>
      )}
    </div>
  )
}

function Counter({
  tone,
  label,
  hint,
  value,
  onChange,
  name,
}: {
  tone: 'navy' | 'wine'
  label: string
  hint: string
  value: number
  onChange: (v: number) => void
  name: string
}) {
  const labelClass =
    tone === 'navy'
      ? 'font-accent text-navy font-semibold italic text-[22px] leading-[28px]'
      : 'font-accent text-wine font-semibold italic text-[22px] leading-[28px]'
  const numberClass =
    tone === 'navy'
      ? 'font-heading font-bold text-[56px] leading-[56px] tracking-[-0.02em] tabular-nums text-navy'
      : 'font-heading font-bold text-[56px] leading-[56px] tracking-[-0.02em] tabular-nums text-wine'
  const minusClass =
    tone === 'navy'
      ? 'flex items-center justify-center w-11 h-11 border-[1.5px] border-navy text-navy font-heading text-[22px] leading-[28px] font-medium transition-opacity hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed'
      : 'flex items-center justify-center w-11 h-11 border-[1.5px] border-wine text-wine font-heading text-[22px] leading-[28px] font-medium transition-opacity hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed'
  const plusClass =
    tone === 'navy'
      ? 'flex items-center justify-center w-11 h-11 bg-navy text-creme font-heading text-[22px] leading-[28px] font-medium transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed'
      : 'flex items-center justify-center w-11 h-11 bg-wine text-creme font-heading text-[22px] leading-[28px] font-medium transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed'

  return (
    <div className="flex flex-col gap-3 bg-creme border border-navy/20 p-6">
      <div className="flex items-center justify-between gap-3">
        <span className={labelClass}>{label}</span>
        <span className="font-sans text-[10px] leading-[12px] tracking-[0.2em] uppercase font-medium text-body-ink/55">
          {hint}
        </span>
      </div>
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
          aria-label={`Diminuir ${name}`}
          className={minusClass}
        >
          −
        </button>
        <span className={numberClass}>{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(50, value + 1))}
          disabled={value >= 50}
          aria-label={`Aumentar ${name}`}
          className={plusClass}
        >
          +
        </button>
      </div>
    </div>
  )
}
