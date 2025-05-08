'use client'

import { getProductById } from '@/actions/data/products'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProductForm from '../product-form'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await getProductById(productId)
        if (response.success && response.data) {
          setProduct(response.data)
        } else {
          toast.error(response.error || 'Failed to fetch product')
          router.push('/dashboard/products')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('An error occurred while fetching the product')
        router.push('/dashboard/products')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, router])

  // Handle successful update
  const handleSuccess = () => {
    toast.success('Product updated successfully')
  }

  if (loading) {
    return (
      <div className='container py-10 text-center'>
        <p className='text-muted-foreground'>Loading product data...</p>
      </div>
    )
  }

  return (
    <div className='container py-10'>
      <div className='flex items-center mb-6'>
        <Link href='/dashboard/products'>
          <Button variant='ghost' size='sm'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Products
          </Button>
        </Link>
        <h1 className='text-2xl font-bold ml-4'>Edit Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{product?.title || 'Edit Product'}</CardTitle>
          <CardDescription>Update the details of your product</CardDescription>
        </CardHeader>
        <CardContent>
          {product ? (
            <ProductForm productId={productId} initialData={product} onSuccess={handleSuccess} />
          ) : (
            <p className='text-muted-foreground'>Product not found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
