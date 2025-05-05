import { connectToDatabase } from '@/configs/dbConnect'
import HomePage from '@/models/HomePage'
import { NextResponse } from 'next/server'

/**
 * GET API endpoint to retrieve homepage content
 */
export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase()

    // Find existing content
    const content = await HomePage.findOne()

    return NextResponse.json({
      success: true,
      data: content?.content || null
    })
  } catch (error: any) {
    console.error('Error fetching homepage content:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch homepage content'
      },
      { status: 500 }
    )
  }
}
