'use server'

import { connectToDatabase } from '@/configs/dbConnect'
import Products from '@/models/Product'
import { revalidatePath } from 'next/cache'

/**
 * Get all products
 */
export async function getProducts() {
  try {
    await connectToDatabase()

    const products = await Products.find({}).sort({ createdAt: -1 })

    return {
      success: true,
      data: JSON.parse(JSON.stringify(products))
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch products'
    }
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string) {
  try {
    await connectToDatabase()

    const product = await Products.findById(id)

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      }
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(product))
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch product'
    }
  }
}

/**
 * Create a new product
 */
export async function createProduct(data: Partial<ProductType>) {
  try {
    await connectToDatabase()

    const product = await Products.create(data)

    // Revalidate paths
    revalidatePath('/dashboard/products')
    revalidatePath('/')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(product))
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create product'
    }
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, data: Partial<ProductType>) {
  try {
    await connectToDatabase()

    const product = await Products.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      }
    }

    // Revalidate paths
    revalidatePath('/dashboard/products')
    revalidatePath(`/dashboard/products/${id}`)
    revalidatePath('/')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(product))
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update product'
    }
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string) {
  try {
    await connectToDatabase()

    // First check if the product exists in the HomePage model

    // Now delete the product itself
    const product = await Products.findByIdAndDelete(id)

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      }
    }

    // Revalidate paths
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/dashboard', 'layout')
    revalidatePath('/dashboard/homepage')

    return {
      success: true,
      message: 'Product deleted successfully'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete product'
    }
  }
}
