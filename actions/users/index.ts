'use server'

import { connectToDatabase } from '@/configs/dbConnect'
import User from '@/models/User'
import { revalidatePath } from 'next/cache'

/**
 * Create a new user
 */
export async function createUser(userData: UserInput) {
  try {
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      return { error: 'User with this email already exists' }
    }

    // Create new user
    const user = await User.create(userData)

    // Return the user without password
    const { password, ...userWithoutPassword } = user.toObject()
    revalidatePath('/dashboard/users')
    return { success: true, user: userWithoutPassword }
  } catch (error: any) {
    return {
      error: error.message || 'Failed to create user',
      details: error.errors || {}
    }
  }
}

/**
 * Get all users with pagination
 */
export async function getUsers(page = 1, limit = 10) {
  try {
    await connectToDatabase()

    const skip = (page - 1) * limit
    const users = await User.find({})
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments()

    return {
      users: JSON.parse(JSON.stringify(users)), // Convert Mongoose documents to plain objects
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    }
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch users' }
  }
}

/**
 * Get a single user by ID
 */
export async function getUserById(id: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(id).select('-password')
    if (!user) {
      return { error: 'User not found' }
    }

    return { user: JSON.parse(JSON.stringify(user)) } // Convert Mongoose document to plain object
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch user' }
  }
}

/**
 * Update a user
 */
export async function updateUser(id: string, userData: Partial<UserInput>) {
  try {
    await connectToDatabase()

    // Check if email is being updated and if it's already in use
    if (userData.email) {
      const existingUser = await User.findOne({
        email: userData.email,
        _id: { $ne: id }
      })

      if (existingUser) {
        return { error: 'Email already in use' }
      }
    }

    const user = await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    }).select('-password')

    if (!user) {
      return { error: 'User not found' }
    }

    revalidatePath('/dashboard/users')
    revalidatePath(`/dashboard/users/${id}`)
    return { success: true, user: JSON.parse(JSON.stringify(user)) } // Convert Mongoose document to plain object
  } catch (error: any) {
    return {
      error: error.message || 'Failed to update user',
      details: error.errors || {}
    }
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  try {
    await connectToDatabase()

    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return { error: 'User not found' }
    }

    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete user' }
  }
}
