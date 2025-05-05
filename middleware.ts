import { signToken, verifyToken } from '@/lib/auth/session'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const res = NextResponse.next()

  if (sessionCookie) {
    try {
      const parsed = await verifyToken(sessionCookie.value)

      res.cookies.set({
        name: 'session',
        value: await signToken({
          ...parsed
        }),
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      })
    } catch (error) {
      console.error('Error updating session:', error)
      res.cookies.delete('session')
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}
