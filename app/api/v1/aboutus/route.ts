import { connectToDatabase } from '@/configs/dbConnect'
import Aboutus from '@/models/Aboutus'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectToDatabase()

    const aboutus = await Aboutus.findOne({})

    return NextResponse.json(aboutus || {})
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch about us data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()

    // Find the existing document or create a new one if it doesn't exist
    const aboutus = await Aboutus.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true
    })

    return NextResponse.json(aboutus)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update about us data' },
      { status: 500 }
    )
  }
}
