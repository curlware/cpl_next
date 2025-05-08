'use server'

import { connectToDatabase } from '@/configs/dbConnect'
import HomePage from '@/models/HomePage'
import { revalidatePath } from 'next/cache'

/**
 * Get homepage data
 * @returns Object with homepage data or empty object
 */
export async function getHomePageData() {
  try {
    await connectToDatabase()

    const data = await HomePage.findOne({}).populate('products.products')

    return {
      success: true,
      data: data ? JSON.parse(JSON.stringify(data)) : {}
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch homepage data'
    }
  }
}

/**
 * Update homepage data
 * @param data Partial homepage data to update
 * @returns Object with success status and data or error
 */
export async function updateHomePageData(data: Partial<HomePageType>) {
  try {
    await connectToDatabase()

    // Process the data to handle any special fields if needed
    const processedData = processHomePageData(data)

    // Find the first document or create one if it doesn't exist
    const result = await HomePage.findOneAndUpdate(
      {}, // empty filter to match any document
      processedData,
      {
        new: true,
        upsert: true, // create if doesn't exist
        runValidators: true // run schema validators
      }
    )

    // Revalidate paths that may display homepage data
    revalidatePath('/')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(result))
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update homepage data',
      details: error.errors || {}
    }
  }
}

/**
 * Helper function to process homepage data before saving
 */
function processHomePageData(data: Partial<HomePageType>) {
  // Create a deep copy to avoid mutating the input
  const processedData = { ...data }

  // Process specific sections if needed
  // For example, ensure arrays are properly formatted
  if (data.sliders) {
    processedData.sliders = data.sliders.map((slider) => ({
      title: slider.title || '',
      subtitle: slider.subtitle || '',
      images: slider.images || [],
      background: slider.background
    }))
  }

  // Process testimonials
  if (data.testimonials) {
    processedData.testimonials = data.testimonials.map((testimonial) => ({
      name: testimonial.name || '',
      designation: testimonial.designation || '',
      comment: testimonial.comment || ''
    }))
  }

  return processedData
}
