'use client'

import { createProduct, updateProduct } from '@/actions/data/products'
import ImageUploader from '@/components/others/ImageUploader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

// Define the Zod schema for validation
const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  images: z
    .array(
      z.object({
        thumbnail: z.string().optional(),
        file: z.string().optional(),
        fileId: z.string().optional()
      })
    )
    .optional(),
  attributes: z
    .array(
      z.object({
        key: z.string().optional(),
        value: z.string().optional()
      })
    )
    .optional()
})

// Define the inferred type from the schema
type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  productId?: string
  initialData?: ProductType
  onSuccess?: () => void
}

export default function ProductForm({ productId, initialData, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!productId

  // Initialize the form with react-hook-form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      images: [],
      attributes: []
    }
  })

  // Set initial form values if editing an existing product
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || '',
        description: initialData.description || '',
        images: initialData.images || [],
        attributes: initialData.attributes || []
      })
    }
  }, [initialData, form])

  // Handle form submission
  async function onSubmit(values: ProductFormValues) {
    setLoading(true)

    try {
      let response

      if (isEditing && productId) {
        response = await updateProduct(productId, values)
      } else {
        response = await createProduct(values)
      }

      if (response.success) {
        toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`)
        if (onSuccess) onSuccess()
        if (!isEditing) {
          // Reset form if creating a new product
          form.reset({
            title: '',
            description: '',
            images: [],
            attributes: []
          })
        }
      } else {
        toast.error(response.error || `Failed to ${isEditing ? 'update' : 'create'} product`)
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter product title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe your product'
                  className='min-h-[100px]'
                  {...field}
                />
              </FormControl>
              <FormDescription>Provide detailed information about the product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Images */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-medium'>Product Images</h3>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {(form.watch('images') || []).map((_, index) => (
              <div key={index} className='border rounded-md p-4 space-y-2'>
                <div className='flex justify-between items-center'>
                  <h4 className='font-medium'>Image {index + 1}</h4>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      const images = form.getValues('images') || []
                      images.splice(index, 1)
                      form.setValue('images', images)
                    }}
                  >
                    <Trash2 size={16} className='text-destructive' />
                  </Button>
                </div>
                <ImageUploader
                  fileId={form.watch(`images.${index}.fileId`)}
                  initialPreview={form.watch(`images.${index}.file`)}
                  setFile={(file) => {
                    form.setValue(`images.${index}`, file)
                  }}
                />
              </div>
            ))}
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              const images = form.getValues('images') || []
              images.push({ thumbnail: '', file: '', fileId: '' })
              form.setValue('images', images)
            }}
          >
            <PlusCircle className='mr-2 h-4 w-4' />
            Add Image
          </Button>
        </div>

        {/* Product Attributes */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-medium'>Product Attributes</h3>
          </div>

          <div className='space-y-4'>
            {(form.watch('attributes') || []).map((_, index) => (
              <div key={index} className='grid grid-cols-5 gap-4 items-end'>
                <FormField
                  control={form.control}
                  name={`attributes.${index}.key`}
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Attribute</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., Size, Color, Material' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`attributes.${index}.value`}
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., Large, Blue, Cotton' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='mb-1'
                  onClick={() => {
                    const attributes = form.getValues('attributes') || []
                    attributes.splice(index, 1)
                    form.setValue('attributes', attributes)
                  }}
                >
                  <Trash2 size={16} className='text-destructive' />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              const attributes = form.getValues('attributes') || []
              attributes.push({ key: '', value: '' })
              form.setValue('attributes', attributes)
            }}
          >
            <PlusCircle className='mr-2 h-4 w-4' />
            Add Attribute
          </Button>
        </div>

        <div className='flex justify-end space-x-2'>
          <Button type='submit' variant='success' disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
