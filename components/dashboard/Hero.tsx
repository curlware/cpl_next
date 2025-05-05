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
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: HeroSection
}

// Define the Zod schema for validation
const heroSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  subtitle: z
    .string()
    .min(1, { message: 'Subtitle is required' })
    .max(300, { message: 'Subtitle is too long' }),
  ctaText: z
    .string()
    .min(1, { message: 'Call-to-action text is required' })
    .max(30, { message: 'CTA text is too long' }),
  ctaLink: z.string().min(1, { message: 'Call-to-action link is required' })
})

// Define the form type
type HeroFormValues = z.infer<typeof heroSchema>

export default function Hero({ data }: TProps) {
  // State for background image
  const [backgroundImage, setBackgroundImage] = useState<MediaFile | undefined>(
    data?.backgroundImage
  )

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create form with default values from data prop
  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: data?.title || '',
      subtitle: data?.subtitle || '',
      ctaText: data?.ctaText || '',
      ctaLink: data?.ctaLink || ''
    }
  })

  // Submit handler
  const onSubmit = async (values: HeroFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Prepare hero data with form values and current background image
      const heroData = {
        ...values,
        backgroundImage: backgroundImage
      }

      // Call the server action to update the hero section
      const result = await updateHomepageSection('hero', heroData)

      if (result.success) {
        toast.success('Hero section updated successfully')
      } else {
        toast.error(result.error || 'An error occurred while updating the hero section')
      }
    } catch (err) {
      console.error('Error updating hero section:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className='text-lg my-5 font-semibold lg:text-3xl'>Hero Section</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Display success/error messages */}
          {error && <FormError message={error} />}

          {/* Title field */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter title' {...field} />
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
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder='Enter subtitle' {...field} />
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
                  <Input placeholder="Enter CTA text (e.g., 'Learn More')" {...field} />
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
                  <Input placeholder="Enter CTA link (e.g., 'https://example.com')" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Background Image Upload */}
          <div className='space-y-2'>
            <FormLabel>Background Image</FormLabel>

            {/* Image preview */}
            {backgroundImage?.file && (
              <div className='mb-4 relative'>
                <div className='border rounded-md overflow-hidden relative aspect-video w-full max-w-md'>
                  <Image
                    src={backgroundImage.file}
                    alt='Background image preview'
                    fill
                    className='object-cover'
                  />
                </div>
                <p className='text-xs text-muted-foreground mt-1'>Current background image</p>
              </div>
            )}

            {/* Image uploader component */}
            <ImageUploader
              fileId={backgroundImage?.fileId}
              setFile={(file) => setBackgroundImage(file)}
            />
            <p className='text-xs text-muted-foreground'>
              Upload a new image for the hero background. Recommended size: 1920x1080px.
            </p>
          </div>

          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
