import { z } from 'zod'

export const rsvpSchema = z
  .object({
    name: z.string().trim().min(2, 'Informe o nome completo'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    adults: z.number().int().min(0).max(50),
    children: z.number().int().min(0).max(50),
  })
  .refine((d) => d.adults + d.children > 0, {
    message: 'Adicione ao menos 1 pessoa',
    path: ['adults'],
  })

export type RsvpInput = z.input<typeof rsvpSchema>

export type RsvpResult =
  | { ok: true; code: string }
  | {
      ok: false
      error: 'deadline' | 'validation' | 'server'
      fieldErrors?: Record<string, string>
    }
