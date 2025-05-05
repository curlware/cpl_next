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
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: ClientsSection
}

// Define the Zod schema for the main section
const clientsSectionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  logos: z.array(
    z.object({
      link: z.string().optional(),
      // Image will be handled separately
      _id: z.string().optional() // For unique identification
    })
  )
})

type ClientsFormValues = z.infer<typeof clientsSectionSchema>

export default function Clients({ data }: TProps) {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State for client logos (separate from form state to handle file uploads)
  const [clientLogos, setClientLogos] = useState<(MediaFile | undefined)[]>(
    data?.logos?.map((logo) => logo.image) || []
  )

  // Create form with default values from data prop
  const form = useForm<ClientsFormValues>({
    resolver: zodResolver(clientsSectionSchema),
    defaultValues: {
      title: data?.title || '',
      logos: data?.logos?.map((logo) => ({
        link: logo.link || '',
        _id: Math.random().toString(36).substring(2, 9)
      })) || [
        {
          link: '',
          _id: Math.random().toString(36).substring(2, 9)
        }
      ]
    }
  })

  // Set up field array for managing client logos
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'logos'
  })

  // Update client logo when adding or removing items
  const updateClientLogo = (index: number, image: MediaFile) => {
    const newLogos = [...clientLogos]
    newLogos[index] = image
    setClientLogos(newLogos)
  }

  // Add a new client logo
  const addClientLogo = () => {
    append({
      link: '',
      _id: Math.random().toString(36).substring(2, 9)
    })
    // Add an empty logo placeholder
    setClientLogos([...clientLogos, undefined])
  }

  // Remove a client logo
  const removeClientLogo = (index: number) => {
    remove(index)
    // Also remove the corresponding logo
    const newLogos = [...clientLogos]
    newLogos.splice(index, 1)
    setClientLogos(newLogos)
  }

  // Submit handler
  const onSubmit = async (values: ClientsFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Combine form data with logo data
      const clientsData: ClientsSection = {
        title: values.title,
        logos: values.logos.map((item, index) => ({
          link: item.link,
          image: clientLogos[index]
        }))
      }

      // Call the server action to update the clients section
      const result = await updateHomepageSection('clients', clientsData)

      if (result.success) {
        toast.success('Clients section updated successfully')
      } else {
        toast.error(result.error || 'An error occurred while updating the clients section')
        setError(result.error || 'An error occurred while updating the clients section')
      }
    } catch (err) {
      console.error('Error updating clients section:', err)
      toast.error('An unexpected error occurred')
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className='text-lg my-5 font-semibold lg:text-3xl'>Clients Section</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          {/* Display error message */}
          {error && <FormError message={error} />}

          {/* Section title */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Title</FormLabel>
                <FormControl>
                  <Input placeholder='Our Clients' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Client logos */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-medium'>Client Logos</h2>
              <Button
                type='button'
                onClick={addClientLogo}
                variant='success'
                size='sm'
                className='cursor-pointer'
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Client
              </Button>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {fields.map((field, index) => (
                <Card
                  key={field._id}
                  className='p-4 relative border border-gray-200 hover:border-black'
                >
                  <div className='absolute top-2 right-2'>
                    <Button
                      type='button'
                      onClick={() => removeClientLogo(index)}
                      variant='ghost'
                      size='icon'
                      className='size-8 bg-red-100 text-destructive hover:text-white cursor-pointer hover:bg-destructive'
                      disabled={fields.length <= 1}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>

                  <div className='space-y-4'>
                    {/* Client logo */}
                    <div className='space-y-2'>
                      <FormLabel>Logo</FormLabel>

                      {/* Logo preview */}
                      {clientLogos[index]?.file && (
                        <div className='mb-4 relative flex justify-center'>
                          <div className='border rounded-md overflow-hidden relative w-32 h-32 bg-gray-50 flex items-center justify-center'>
                            <Image
                              src={clientLogos[index]?.file || ''}
                              alt={`Client ${index + 1} logo`}
                              fill
                              className='object-contain p-2'
                            />
                          </div>
                        </div>
                      )}

                      {/* Logo uploader */}
                      <ImageUploader
                        fileId={clientLogos[index]?.fileId}
                        setFile={(file) => updateClientLogo(index, file)}
                      />
                    </div>

                    {/* Client link (optional) */}
                    <FormField
                      control={form.control}
                      name={`logos.${index}.link`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='https://client-website.com' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {fields.length === 0 && (
              <div className='text-center py-8 text-muted-foreground'>
                No client logos added yet. Click the "Add Client" button to add one.
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
