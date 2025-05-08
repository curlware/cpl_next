import { connectToDatabase } from '@/configs/dbConnect'
import Products from '@/models/Product'
import { NextRequest, NextResponse } from 'next/server'

// GET a single product by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await connectToDatabase()

    const product = await Products.findById(id)

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(product))
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch product'
      },
      { status: 500 }
    )
  }
}

// UPDATE a product by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()

    await connectToDatabase()

    const product = await Products.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(product))
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update product'
      },
      { status: 500 }
    )
  }
}

// DELETE a product by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await connectToDatabase()

    const product = await Products.findByIdAndDelete(id)

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete product'
      },
      { status: 500 }
    )
  }
}
