import { register } from '@/actions/users/auth'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password, hash } = body

  // Validate the input
  if (!email || !password) {
    return Response.json(
      { error: 'Email and password are required' },
      {
        status: 400
      }
    )
  }

  if (!hash || hash.toString() !== process.env.HASH?.toString()) {
    return Response.json(
      { error: 'Invalid hash' },
      {
        status: 403
      }
    )
  }
  // Simulate user creation logic
  try {
    const registerUser = await register({ email, password })

    return Response.json(registerUser)
  } catch (error) {
    return Response.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
