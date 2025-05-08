import { connectToDatabase } from '@/configs/dbConnect'
import SharedData from '@/models/Shared'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json()

    // Connect to the database
    await connectToDatabase()

    // Use direct object for update to ensure all nested properties are properly handled
    const result = await SharedData.findOneAndUpdate(
      {}, // empty filter to match any document
      data,
      {
        new: true,
        upsert: true // create if doesn't exist
      }
    )

    // Return successful response
    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(result))
    })
  } catch (error: any) {
    console.error('Error updating shared data:', error)

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update shared data',
        details: error.errors || {}
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectToDatabase()

    const data = await SharedData.findOne({})

    return NextResponse.json({
      success: true,
      data: data ? JSON.parse(JSON.stringify(data)) : {}
    })
  } catch (error: any) {
    console.error('Error fetching shared data:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch shared data'
      },
      { status: 500 }
    )
  }
}
