import { createHmac, timingSafeEqual } from 'node:crypto'

const SECRET = process.env.COOKIE_SECRET!

export function signCookie(value: string): string {
  const sig = createHmac('sha256', SECRET).update(value).digest('base64url')
  return `${Buffer.from(value).toString('base64url')}.${sig}`
}

export function verifyCookie(token: string | undefined): boolean {
  if (!token) return false
  const [payloadB64, sig] = token.split('.')
  if (!payloadB64 || !sig) return false
  const expected = createHmac('sha256', SECRET)
    .update(Buffer.from(payloadB64, 'base64url').toString())
    .digest('base64url')
  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length) return false
  return timingSafeEqual(sigBuf, expBuf)
}
