'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Button } from '@/components/ui/button'
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
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: AboutSection
}

// Define the Zod schema for validation
const aboutSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  subtitle: z
    .string()
    .min(1, { message: 'Subtitle is required' })
    .max(300, { message: 'Subtitle is too long' }),
  heading: z
    .string()
    .min(1, { message: 'Heading is required' })
    .max(100, { message: 'Heading is too long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description is too long' }),
  ctaText: z
    .string()
    .min(1, { message: 'Call-to-action text is required' })
    .max(30, { message: 'CTA text is too long' }),
  ctaLink: z.string().min(1, { message: 'Call-to-action link is required' })
})

// Define the form type
type AboutFormValues = z.infer<typeof aboutSchema>

export default function About({ data }: TProps) {
  // State for media image
  const [media, setMedia] = useState<MediaFile | undefined>(data?.media)

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create form with default values from data prop
  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: data?.title || '',
      subtitle: data?.subtitle || '',
      heading: data?.heading || '',
      description: data?.description || '',
      ctaText: data?.ctaText || '',
      ctaLink: data?.ctaLink || ''
    }
  })

  // Submit handler
  const onSubmit = async (values: AboutFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Prepare about data with form values and current media image
      const aboutData = {
        ...values,
        media: media
      }

      // Call the server action to update the about section
      const result = await updateHomepageSection('about', aboutData)

      if (result.success) {
        toast.success('About section updated successfully')
      } else {
        toast.error(result.error || 'An error occurred while updating the about section')
        setError(result.error || 'An error occurred while updating the about section')
      }
    } catch (err) {
      console.error('Error updating about section:', err)
      toast.error('An unexpected error occurred')
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className='text-lg my-5 font-semibold lg:text-3xl'>About Section</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Display error message */}
          {error && <FormError message={error} />}

          {/* Title field */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Title</FormLabel>
                <FormControl>
                  <Input placeholder='About Us' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subtitle field */}
          <FormField
            control={form.control}
            name='subtitle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder='Learn more about our company and mission' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Heading field */}
          <FormField
            control={form.control}
            name='heading'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heading</FormLabel>
                <FormControl>
                  <Input placeholder='Our Story' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description field */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter a detailed description about your company...'
                    className='min-h-[150px]'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CTA Text field */}
          <FormField
            control={form.control}
            name='ctaText'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Call-to-Action Text</FormLabel>
                <FormControl>
                  <Input placeholder='Learn More' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CTA Link field */}
          <FormField
            control={form.control}
            name='ctaLink'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Call-to-Action Link</FormLabel>
                <FormControl>
                  <Input placeholder='https://example.com/about' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Media Image Upload */}
          <div className='space-y-2'>
            <FormLabel>Media Image</FormLabel>

            {/* Image preview */}
            {media?.file && (
              <div className='mb-4 relative'>
                <div className='border rounded-md overflow-hidden relative aspect-video w-full max-w-md'>
                  <Image src={media.file} alt='About section media' fill className='object-cover' />
                </div>
                <p className='text-xs text-muted-foreground mt-1'>Current media image</p>
              </div>
            )}

            {/* Image uploader component */}
            <ImageUploader fileId={media?.fileId} setFile={(file) => setMedia(file)} />
            <p className='text-xs text-muted-foreground'>
              Upload an image for the about section. Recommended size: 1200x800px.
            </p>
          </div>

          <Button type='submit' disabled={isSubmitting} className='mt-4'>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
