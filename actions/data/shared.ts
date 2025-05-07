'use server'

import { connectToDatabase } from '@/configs/dbConnect'
import SharedData from '@/models/Shared'
import { revalidatePath } from 'next/cache'

export async function updateSharedData(data: Partial<SharedDataType>) {
  try {
    await connectToDatabase()

    // Find the first document or create one if it doesn't exist
    const result = await SharedData.findOneAndUpdate(
      {}, // empty filter to match any document
      { $set: data }, // Use $set to only update the specified fields
      {
        new: true,
        upsert: true, // create if doesn't exist
        runValidators: true
      }
    )

    // Revalidate paths that may display shared data
    revalidatePath('/')
    revalidatePath('/dashboard')

    return {
      success: true
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update shared data',
      details: error.errors || {}
    }
  }
}

/**
 * Get shared data
 * @returns Object with shared data or empty object
 */
export async function getSharedData() {
  try {
    await connectToDatabase()

    const data = await SharedData.findOne({})

    return {
      success: true,
      data: data ? JSON.parse(JSON.stringify(data)) : {}
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch shared data'
    }
  }
}
