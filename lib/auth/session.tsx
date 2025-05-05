'use server'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const key = new TextEncoder().encode(process.env.AUTH_SECRET || 'fallBack_secure_key_2666')

export type SessionData = {
  user: TUser
}

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('3 days from now')
    .sign(key)
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256']
  })
  return payload as SessionData
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value
  if (!session) return null
  return await verifyToken(session)
}

export async function setSession(user: TUser) {
  const session: SessionData = {
    user: {
      id: user.id,
      email: user.email
    }
  }
  const encryptedSession = await signToken(session)
  ;(await cookies()).set('session', encryptedSession, {
    httpOnly: true,
    // secure: true,
    sameSite: 'lax'
  })
}
