import { connectToDatabase } from '@/configs/dbConnect'
import HomePage from '@/models/HomePage'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json()

    console.log('data on api', data)

    // Connect to the database
    await connectToDatabase()

    // Use direct object for update to ensure all nested properties are properly handled
    const result = await HomePage.findOneAndUpdate(
      {}, // empty filter to match any document
      data,
      {
        new: true,
        upsert: true // create if doesn't exist
      }
    )

    revalidatePath('/')
    revalidatePath('/dashboard', 'layout')

    // Return successful response
    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(result))
    })
  } catch (error: any) {
    console.error('Error updating homepage data:', error)

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update homepage data',
        details: error.errors || {}
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectToDatabase()

    const data = await HomePage.findOne({}).populate('products.products')

    return NextResponse.json({
      success: true,
      data: data ? JSON.parse(JSON.stringify(data)) : {}
    })
  } catch (error: any) {
    console.error('Error fetching homepage data:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch homepage data'
      },
      { status: 500 }
    )
  }
}
