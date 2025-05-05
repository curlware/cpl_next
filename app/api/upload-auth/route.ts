import { getUploadAuthParams } from '@imagekit/next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string
    // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
    // token: "random-token", // Optional, a unique token for request
  })

  return Response.json({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY })
}
