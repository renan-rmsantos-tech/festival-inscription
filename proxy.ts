import { NextResponse, type NextRequest } from 'next/server'
import { verifyCookie } from '@/lib/cookie'

export function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  const cookie = req.cookies.get('admin')?.value
  if (!verifyCookie(cookie)) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = { matcher: '/admin/:path*' }
