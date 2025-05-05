'use server'

import { connectToDatabase } from '@/configs/dbConnect'
import { SessionData, signToken } from '@/lib/auth/session'
import User from '@/models/User'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

type LoginInput = {
  email: string
  password: string
}

/**
 * Register a new user
 */
export async function register(userData: LoginInput) {
  try {
    await connectToDatabase()

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      return { error: 'User with this email already exists' }
    }

    // Create new user
    await User.create({
      ...userData
    })

    return { success: true }
  } catch (error: any) {
    return {
      error: error.message || 'Failed to register user',
      details: error.errors || {}
    }
  }
}

/**
 * User login
 */
export async function login({ email, password }: LoginInput) {
  try {
    await connectToDatabase()

    // Find the user
    const user = await User.findOne({ email })
    if (!user) {
      return { error: 'Invalid email or password' }
    }

    // Verify password
    const isPasswordValid = password === user.password
    if (!isPasswordValid) {
      return { error: 'Invalid email or password' }
    }

    // Return the user without password
    const userObject = user.toObject()

    // Set session cookie
    const session: SessionData = {
      user: {
        id: userObject.id,
        email: userObject.email
      }
    }
    const encryptedSession = await signToken(session)
    ;(await cookies()).set('session', encryptedSession, {
      httpOnly: true,
      // secure: true,
      sameSite: 'lax'
    })

    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to login' }
  }
}

/**
 * User logout
 */
export async function logout() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies()
    cookieStore.delete('sessionId')

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to logout' }
  }
}

/**
 * Change password
 */
export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    await connectToDatabase()

    // Find the user
    const user = await User.findById(userId)
    if (!user) {
      return { error: 'User not found' }
    }

    // Verify current password
    const isPasswordValid = currentPassword === user.password
    if (!isPasswordValid) {
      return { error: 'Current password is incorrect' }
    }

    // Update password
    user.password = newPassword
    await user.save()

    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to change password' }
  }
}

/**
 * Check if user is authenticated based on session
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId) {
      return { user: null }
    }

    // In a real app, verify the session token properly
    // This is a simplified example
    const userId = sessionId.split('_')[2]
    if (!userId) {
      return { user: null }
    }

    await connectToDatabase()

    const user = await User.findById(userId).select('-password')
    if (!user) {
      return { user: null }
    }

    return { user }
  } catch (error: any) {
    return { error: error.message, user: null }
  }
}
