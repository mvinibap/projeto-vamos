import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const auth = request.headers.get('authorization')
    const password = process.env.ADMIN_PASSWORD || 'vamos2026'
    const expected = `Basic ${Buffer.from(`vamos:${password}`).toString('base64')}`

    if (auth !== expected) {
      return new NextResponse('Não autorizado', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="VAMOS Admin"' },
      })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
