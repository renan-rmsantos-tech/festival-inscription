'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitRsvp } from '@/app/actions/rsvp'
import { rsvpSchema, type RsvpInput } from '@/lib/validators/rsvp'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function RsvpForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<RsvpInput>({
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

  const adults = form.watch('adults')
  const children = form.watch('children')
  const nameValue = form.watch('name')
  const total = adults + children
  const canSubmit = nameValue.trim().length > 0 && total > 0

  function onSubmit(data: RsvpInput) {
    setServerError(null)
    startTransition(async () => {
      try {
        const result = await submitRsvp(data)
        if (result.ok) {
          router.push(`/confirmacao/${result.code}`)
          return
        }
        if (result.error === 'deadline') {
          setServerError('Inscrições encerradas.')
          return
        }
        if (result.error === 'validation' && result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof RsvpInput, { message })
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
    <div className="w-full max-w-[560px] mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {serverError && (
            <div
              role="alert"
              className="flex items-center justify-between gap-3 rounded-md bg-wine/10 border border-wine/30 px-4 py-3"
            >
              <p className="font-sans text-body-sm text-wine font-medium">
                {serverError}
              </p>
              <button
                type="button"
                onClick={() => setServerError(null)}
                className="shrink-0 text-wine/70 hover:text-wine text-lg leading-none font-sans"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-sans text-caption tracking-[0.12em] uppercase font-semibold text-navy">
                  Nome da família *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex.: Família Santos"
                    className="h-12 text-body-sm font-sans bg-creme border-navy/20 focus-visible:border-navy focus-visible:ring-navy/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-caption tracking-[0.12em] uppercase font-semibold text-navy">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      className="h-12 text-body-sm font-sans bg-creme border-navy/20 focus-visible:border-navy focus-visible:ring-navy/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-caption tracking-[0.12em] uppercase font-semibold text-navy">
                    Telefone
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="(11) 99999-0000"
                      className="h-12 text-body-sm font-sans bg-creme border-navy/20 focus-visible:border-navy focus-visible:ring-navy/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="adults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-caption tracking-[0.12em] uppercase font-semibold text-navy">
                    Adultos
                  </FormLabel>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => field.onChange(Math.max(0, field.value - 1))}
                      disabled={field.value <= 0}
                      className="flex items-center justify-center w-11 h-11 rounded-md border border-navy/20 bg-creme text-navy font-heading text-h5 font-bold transition-colors hover:bg-creme-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/50 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Diminuir adultos"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-heading text-h4 font-bold text-navy tabular-nums">
                      {field.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => field.onChange(Math.min(50, field.value + 1))}
                      disabled={field.value >= 50}
                      className="flex items-center justify-center w-11 h-11 rounded-md border border-navy/20 bg-creme text-navy font-heading text-h5 font-bold transition-colors hover:bg-creme-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/50 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Aumentar adultos"
                    >
                      +
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="children"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-caption tracking-[0.12em] uppercase font-semibold text-navy">
                    Crianças
                  </FormLabel>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => field.onChange(Math.max(0, field.value - 1))}
                      disabled={field.value <= 0}
                      className="flex items-center justify-center w-11 h-11 rounded-md border border-navy/20 bg-creme text-navy font-heading text-h5 font-bold transition-colors hover:bg-creme-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/50 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Diminuir crianças"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-heading text-h4 font-bold text-navy tabular-nums">
                      {field.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => field.onChange(Math.min(50, field.value + 1))}
                      disabled={field.value >= 50}
                      className="flex items-center justify-center w-11 h-11 rounded-md border border-navy/20 bg-creme text-navy font-heading text-h5 font-bold transition-colors hover:bg-creme-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/50 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Aumentar crianças"
                    >
                      +
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <Button
              type="submit"
              disabled={!canSubmit || isPending}
              className="h-14 px-10 rounded-sm bg-navy text-creme font-sans text-[14px] leading-[18px] tracking-[0.16em] uppercase font-semibold transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
            >
              {isPending ? 'Enviando…' : 'Confirmar inscrição'}
            </Button>
            <span className="font-accent text-body italic font-medium text-body-ink/70 tabular-nums">
              {total} {total === 1 ? 'pessoa' : 'pessoas'}
            </span>
          </div>
        </form>
      </Form>
    </div>
  )
}
