'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: TestimonialItem[]
}

// Define the Zod schema for a single testimonial
const testimonialSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name is too long' }),
  role: z
    .string()
    .min(1, { message: 'Role is required' })
    .max(100, { message: 'Role is too long' }),
  message: z
    .string()
    .min(1, { message: 'Message is required' })
    .max(500, { message: 'Message is too long' }),
  // Image will be handled separately
  _id: z.string().optional() // For unique identification
})

// Define the form for all testimonials
const testimonialsFormSchema = z.object({
  testimonials: z
    .array(testimonialSchema)
    .min(1, { message: 'At least one testimonial is required' })
})

type TestimonialsFormValues = z.infer<typeof testimonialsFormSchema>

export default function Testimonials({ data }: TProps) {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State for testimonial images (separate from form state to handle file uploads)
  const [testimonialImages, setTestimonialImages] = useState<(MediaFile | undefined)[]>(
    data?.map((item) => item.image) || []
  )

  // Create form with default values from data prop
  const form = useForm<TestimonialsFormValues>({
    resolver: zodResolver(testimonialsFormSchema),
    defaultValues: {
      testimonials: data?.map((item) => ({
        name: item.name || '',
        role: item.role || '',
        message: item.message || '',
        _id: Math.random().toString(36).substring(2, 9)
      })) || [
        {
          name: '',
          role: '',
          message: '',
          _id: Math.random().toString(36).substring(2, 9)
        }
      ]
    }
  })

  // Set up field array for managing testimonials
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'testimonials'
  })

  // Update testimonial image when adding or removing items
  const updateTestimonialImage = (index: number, image: MediaFile) => {
    const newImages = [...testimonialImages]
    newImages[index] = image
    setTestimonialImages(newImages)
  }

  // Add a new testimonial
  const addTestimonial = () => {
    append({
      name: '',
      role: '',
      message: '',
      _id: Math.random().toString(36).substring(2, 9)
    })
    // Add an empty image placeholder
    setTestimonialImages([...testimonialImages, undefined])
  }

  // Remove a testimonial
  const removeTestimonial = (index: number) => {
    remove(index)
    // Also remove the corresponding image
    const newImages = [...testimonialImages]
    newImages.splice(index, 1)
    setTestimonialImages(newImages)
  }

  // Submit handler
  const onSubmit = async (values: TestimonialsFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Combine form data with image data
      const testimonials = values.testimonials.map((item, index) => ({
        name: item.name,
        role: item.role,
        message: item.message,
        image: testimonialImages[index]
      }))

      // Call the server action to update the testimonials section
      const result = await updateHomepageSection('testimonials', testimonials)

      if (result.success) {
        toast.success('Testimonials updated successfully')
      } else {
        toast.error(result.error || 'An error occurred while updating testimonials')
        setError(result.error || 'An error occurred while updating testimonials')
      }
    } catch (err) {
      console.error('Error updating testimonials:', err)
      toast.error('An unexpected error occurred')
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className='text-lg my-5 font-semibold lg:text-3xl'>Testimonial Section</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          {/* Display error message */}
          {error && <FormError message={error} />}

          {/* Testimonials header with add button */}
          <div className='flex justify-end items-center'>
            <Button
              type='button'
              onClick={addTestimonial}
              size='sm'
              variant='success'
              className='cursor-pointer'
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Testimonial
            </Button>
          </div>

          {/* Testimonials list */}
          <div className='space-y-6'>
            {fields.map((field, index) => (
              <Card
                key={field._id}
                className='p-5 relative border border-gray-200 hover:border-black'
              >
                <div className='absolute top-4 right-4'>
                  <Button
                    type='button'
                    onClick={() => removeTestimonial(index)}
                    variant='ghost'
                    size='icon'
                    className='size-8 bg-red-100 text-destructive hover:text-white cursor-pointer hover:bg-destructive'
                    disabled={fields.length <= 1}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>

                <div className='grid gap-6 md:grid-cols-[200px_1fr]'>
                  {/* Client photo and info */}
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <FormLabel>Person Photo</FormLabel>

                      {/* Image preview */}
                      {testimonialImages[index]?.file && (
                        <div className='mb-4 relative'>
                          <div className='border rounded-full overflow-hidden relative w-24 h-24'>
                            <Image
                              src={testimonialImages[index]?.file || ''}
                              alt={`Testimonial from ${form.getValues().testimonials[index].name}`}
                              fill
                              className='object-cover'
                            />
                          </div>
                          <p className='text-xs text-muted-foreground mt-1'>Current photo</p>
                        </div>
                      )}

                      {/* Image uploader */}
                      <ImageUploader
                        fileId={testimonialImages[index]?.fileId}
                        setFile={(file) => updateTestimonialImage(index, file)}
                      />
                      <p className='text-xs text-muted-foreground'>
                        Upload a photo. Square photos work best.
                      </p>
                    </div>
                  </div>

                  <div className='grid gap-4 pt-4'>
                    {/* Testimonial message */}
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.message`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Testimonial Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Enter the testimonial message...'
                              className='min-h-[100px]'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Person name */}
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder='John Doe' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Person role */}
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role/Company</FormLabel>
                          <FormControl>
                            <Input placeholder='CEO at Company' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))}

            {fields.length === 0 && (
              <div className='text-center py-8 text-muted-foreground'>
                No testimonials added yet. Click the "Add Testimonial" button to add one.
              </div>
            )}
          </div>

          <Button type='submit' disabled={isSubmitting} className='mt-6'>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
