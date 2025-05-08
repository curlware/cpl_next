'use client'

import { deleteProduct, getProducts } from '@/actions/data/products'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Edit, Plus, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProductForm from './product-form'

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await getProducts()
      if (response.success && response.data) {
        setProducts(response.data)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('An error occurred while fetching products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle product deletion
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await deleteProduct(id)
        if (response.success) {
          toast.success('Product deleted successfully')
          fetchProducts()
        } else {
          toast.error(response.error || 'Failed to delete product')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error('An error occurred while deleting the product')
      }
    }
  }

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products

  return (
    <div className='container py-10'>
      <h1 className='text-2xl font-bold mb-6'>Products Management</h1>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>All Products</CardTitle>
            <CardDescription>
              Manage your products. You can add, edit, or delete products.
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant='success'>
                <Plus className='h-4 w-4 md:mr-2' />
                <span className='hidden md:inline'>Add Product</span>
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Create a new product with details and attributes.
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                onSuccess={() => {
                  setShowAddDialog(false)
                  fetchProducts()
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center'>
            <div className='relative w-full max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search products...'
                className='pl-8'
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {loading ? (
            <div className='py-8 text-center text-muted-foreground'>Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground'>
              {searchTerm ? 'No products match your search' : 'No products found'}
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className='w-24'>Images</TableHead>
                    <TableHead className='w-24'>Attributes</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className='font-medium'>{product.title}</TableCell>
                      <TableCell>
                        {product.description && product.description.length > 100
                          ? `${product.description.substring(0, 100)}...`
                          : product.description}
                      </TableCell>
                      <TableCell>{product.images?.length || 0}</TableCell>
                      <TableCell>{product.attributes?.length || 0}</TableCell>
                      <TableCell className='text-right space-x-2'>
                        <Link href={`/dashboard/products/${product._id}`}>
                          <Button variant='outline' size='sm'>
                            <Edit className='h-4 w-4' />
                          </Button>
                        </Link>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => handleDelete(product._id as string)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
