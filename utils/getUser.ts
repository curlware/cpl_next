import { verifyToken } from '@/lib/auth/session'
import { cookies } from 'next/headers'

export default async function retrieveUserFromSession(): Promise<TUser | null> {
  const sessionCookie = (await cookies()).get('session')
  if (!sessionCookie || !sessionCookie.value) {
    return null
  }

  const sessionData = await verifyToken(sessionCookie.value)
  if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'string') {
    return null
  }

  return sessionData.user
}
