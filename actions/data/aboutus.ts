'use server'

import { connectToDatabase } from '@/configs/dbConnect'
import Aboutus from '@/models/Aboutus'
import { revalidatePath } from 'next/cache'

/**
 * Get about us data
 */
export async function getAboutUs() {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne({})

    return {
      success: true,
      data: JSON.parse(JSON.stringify(aboutus || {}))
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch about us data'
    }
  }
}

/**
 * Update about us data
 */
export async function updateAboutUs(data: Partial<AboutUsType>) {
  try {
    await connectToDatabase()

    // Find the existing document or create a new one if it doesn't exist
    const aboutus = await Aboutus.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      runValidators: true
    })

    // Revalidate paths
    revalidatePath('/dashboard/about-us')
    revalidatePath('/about-us')
    revalidatePath('/')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(aboutus))
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update about us data'
    }
  }
}

// Define TypeScript types for our model
export interface AboutUsType {
  _id?: string
  title?: string
  background?: {
    thumbnail?: string
    file?: string
    fileId?: string
  }
  banner?: {
    thumbnail?: string
    file?: string
    fileId?: string
  }
  items?: Array<{
    title?: string
    description?: string
    hash?: string
    image?: {
      thumbnail?: string
      file?: string
      fileId?: string
    }
  }>
  team?: {
    title?: string
    description?: string
    members?: Array<{
      name?: string
      designation?: string
      description?: string
    }>
  }
}
