import { connectToDatabase } from '@/configs/dbConnect'
import Products from '@/models/Product'
import { NextRequest, NextResponse } from 'next/server'

// GET all products without pagination
export async function GET() {
  try {
    await connectToDatabase()

    const products = await Products.find({}).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(products))
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch products'
      },
      { status: 500 }
    )
  }
}

// POST a new product
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    await connectToDatabase()

    const product = await Products.create(data)

    return NextResponse.json(
      {
        success: true,
        data: JSON.parse(JSON.stringify(product))
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create product'
      },
      { status: 500 }
    )
  }
}
