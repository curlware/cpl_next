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
  data?: ServicesSection
}

// Define the Zod schema for the main section
const servicesSectionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  subtitle: z
    .string()
    .min(1, { message: 'Subtitle is required' })
    .max(300, { message: 'Subtitle is too long' }),
  items: z.array(
    z.object({
      title: z
        .string()
        .min(1, { message: 'Service title is required' })
        .max(100, { message: 'Service title is too long' }),
      description: z
        .string()
        .min(1, { message: 'Description is required' })
        .max(500, { message: 'Description is too long' }),
      link: z.string().optional(),
      // Icon image will be handled separately
      _id: z.string().optional() // For unique identification
    })
  )
})

type ServicesFormValues = z.infer<typeof servicesSectionSchema>

export default function Services({ data }: TProps) {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State for service icons (separate from form state to handle file uploads)
  const [serviceIcons, setServiceIcons] = useState<(MediaFile | undefined)[]>(
    data?.items?.map((item) => item.icon) || []
  )

  // Create form with default values from data prop
  const form = useForm<ServicesFormValues>({
    resolver: zodResolver(servicesSectionSchema),
    defaultValues: {
      title: data?.title || '',
      subtitle: data?.subtitle || '',
      items: data?.items?.map((item) => ({
        title: item.title || '',
        description: item.description || '',
        link: item.link || '',
        _id: Math.random().toString(36).substring(2, 9)
      })) || [
        {
          title: '',
          description: '',
          link: '',
          _id: Math.random().toString(36).substring(2, 9)
        }
      ]
    }
  })

  // Set up field array for managing service items
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  })

  // Update service icons when adding or removing items
  const updateServiceIcon = (index: number, icon: MediaFile) => {
    const newIcons = [...serviceIcons]
    newIcons[index] = icon
    setServiceIcons(newIcons)
  }

  // Add a new service item
  const addServiceItem = () => {
    append({
      title: '',
      description: '',
      link: '',
      _id: Math.random().toString(36).substring(2, 9)
    })
    // Add an empty icon placeholder
    setServiceIcons([...serviceIcons, undefined])
  }

  // Remove a service item
  const removeServiceItem = (index: number) => {
    if (window.confirm('Are you sure want to delete this service?')) {
      remove(index)
      // Also remove the corresponding icon
      const newIcons = [...serviceIcons]
      newIcons.splice(index, 1)
      setServiceIcons(newIcons)
    }
  }

  // Submit handler
  const onSubmit = async (values: ServicesFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Combine form data with icon data
      const servicesData: ServicesSection = {
        title: values.title,
        subtitle: values.subtitle,
        items: values.items.map((item, index) => ({
          title: item.title,
          description: item.description,
          link: item.link,
          icon: serviceIcons[index]
        }))
      }

      // Call the server action to update the services section
      const result = await updateHomepageSection('services', servicesData)

      if (result.success) {
        toast.success('Services section updated successfully')
      } else {
        toast.error(result.error || 'An error occurred while updating the services section')
        setError(result.error || 'An error occurred while updating the services section')
      }
    } catch (err) {
      console.error('Error updating services section:', err)
      toast.error('An unexpected error occurred')
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className='text-lg my-5  font-semibold lg:text-3xl'>Services Section</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          {/* Display error message */}
          {error && <FormError message={error} />}

          {/* Section title & subtitle */}
          <div className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Services' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='subtitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder='What we offer' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Service items */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-medium'>Services</h2>
              <Button
                type='button'
                onClick={addServiceItem}
                variant='success'
                size='sm'
                className='cursor-pointer'
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Service
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card
                key={field._id}
                className='p-4 relative border border-gray-200 hover:border-black'
              >
                <div className='absolute top-4 right-4'>
                  <Button
                    type='button'
                    onClick={() => removeServiceItem(index)}
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 bg-red-100 text-destructive  hover:bg-destructive hover:text-white  cursor-pointer'
                    disabled={fields.length <= 1}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                  {/* Service icon */}
                  <div className='space-y-2'>
                    <FormLabel>Service Icon</FormLabel>

                    {/* Icon preview */}
                    {serviceIcons[index]?.file && (
                      <div className='mb-4 relative'>
                        <div className='border rounded-md overflow-hidden relative w-24 h-24'>
                          <Image
                            src={serviceIcons[index]?.file || ''}
                            alt={`Service ${index + 1} icon`}
                            fill
                            className='object-contain'
                          />
                        </div>
                        <p className='text-xs text-muted-foreground mt-1'>Current icon</p>
                      </div>
                    )}

                    {/* Icon uploader */}
                    <ImageUploader
                      fileId={serviceIcons[index]?.fileId}
                      setFile={(file) => updateServiceIcon(index, file)}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Upload an icon image. Recommended size: 128x128px.
                    </p>
                  </div>

                  <div className='space-y-4 pt-4'>
                    {/* Service title */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Title</FormLabel>
                          <FormControl>
                            <Input placeholder='Web Development' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Service description */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Enter a description of this service...'
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Service link (optional) */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.link`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='https://example.com/service' {...field} />
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
                No services added yet. Click the "Add Service" button to add one.
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
