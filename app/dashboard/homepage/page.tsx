'use client'

import { getHomePageData } from '@/actions/data/homepage'
import ImageUploader from '@/components/others/ImageUploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

// Define the Zod schema for validation
const homePageSchema = z.object({
  sliders: z
    .array(
      z.object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
        images: z
          .array(
            z.object({
              thumbnail: z.string().optional(),
              file: z.string().optional(),
              fileId: z.string().optional()
            })
          )
          .optional(),
        background: z
          .object({
            thumbnail: z.string().optional(),
            file: z.string().optional(),
            fileId: z.string().optional()
          })
          .optional()
          .nullable()
      })
    )
    .optional(),
  about: z
    .object({
      title: z.string().optional(),
      description: z.string().optional()
    })
    .optional(),
  products: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      products: z.array(z.string()).optional()
    })
    .optional(),
  stats: z
    .object({
      title: z.string().optional(),
      image: z
        .object({
          thumbnail: z.string().optional(),
          file: z.string().optional(),
          fileId: z.string().optional()
        })
        .optional(),
      stats: z
        .array(
          z.object({
            title: z.string().optional(),
            value: z.string().optional()
          })
        )
        .optional()
    })
    .optional(),
  testimonials: z
    .array(
      z.object({
        name: z.string().optional(),
        designation: z.string().optional(),
        comment: z.string().optional()
      })
    )
    .optional(),
  video: z
    .object({
      thumbnail: z
        .object({
          thumbnail: z.string().optional(),
          file: z.string().optional(),
          fileId: z.string().optional()
        })
        .optional(),
      link: z.string().optional()
    })
    .optional()
})

// Define the inferred type from the schema
type HomePageFormValues = z.infer<typeof homePageSchema>

export default function HomePage() {
  const [loading, setLoading] = useState(false)

  // Initialize the form with react-hook-form
  const form = useForm<HomePageFormValues>({
    resolver: zodResolver(homePageSchema),
    defaultValues: {
      sliders: [],
      about: { title: '', description: '' },
      products: { title: '', description: '', products: [] },
      stats: { title: '', stats: [] },
      testimonials: [],
      video: { link: '' }
    }
  })

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await getHomePageData()
        console.log('homepage data', response)
        if (response.success && response.data) {
          // Reset form with fetched data
          form.reset(response.data)
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error)
        toast.error('Could not load homepage data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [form])

  // Handle form submission
  async function onSubmit(values: HomePageFormValues) {
    setLoading(true)

    try {
      // Use the POST API endpoint
      const response = await fetch('/api/v1/homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Homepage data has been updated')
      } else {
        toast.error(result.error || 'Failed to update homepage data')
        console.error('Error details from server:', result.details)
      }
    } catch (error) {
      console.error('Error updating homepage data:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container py-10'>
      <h1 className='text-2xl font-bold mb-6'>Homepage Settings</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue='sliders' className='w-full'>
            <TabsList className='mb-4'>
              <TabsTrigger value='sliders'>Hero Sliders</TabsTrigger>
              <TabsTrigger value='about'>About Section</TabsTrigger>
              <TabsTrigger value='products'>Products Section</TabsTrigger>
              <TabsTrigger value='stats'>Stats Section</TabsTrigger>
              <TabsTrigger value='testimonials'>Testimonials</TabsTrigger>
              <TabsTrigger value='video'>Video Section</TabsTrigger>
            </TabsList>

            {/* Hero Sliders Tab */}
            <TabsContent value='sliders'>
              <Card>
                <CardHeader>
                  <CardTitle>Hero Sliders</CardTitle>
                  <CardDescription>Manage the carousel sliders on your homepage</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    {(form.watch('sliders') || []).map((_, index) => (
                      <Card key={index} className='p-4'>
                        <div className='flex justify-between items-center mb-4'>
                          <h4 className='font-medium'>Slider {index + 1}</h4>
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              const sliders = form.getValues('sliders') || []
                              sliders.splice(index, 1)
                              form.setValue('sliders', sliders)
                            }}
                          >
                            Remove Slider
                          </Button>
                        </div>

                        <div className='space-y-4'>
                          <FormField
                            control={form.control}
                            name={`sliders.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder='Slider Title' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`sliders.${index}.subtitle`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subtitle</FormLabel>
                                <FormControl>
                                  <Input placeholder='Slider Subtitle' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`sliders.${index}.background`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                  <ImageUploader
                                    fileId={field.value?.fileId}
                                    initialPreview={field.value?.file}
                                    setFile={(file) => {
                                      form.setValue(`sliders.${index}.background`, file)
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>Background image for this slider</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div>
                            <h5 className='font-medium mb-2'>Slider Images</h5>
                            <div className='space-y-4'>
                              {(form.watch(`sliders.${index}.images`) || []).map(
                                (_, imageIndex) => (
                                  <div key={imageIndex} className='flex flex-col space-y-2'>
                                    <div className='flex justify-between items-center'>
                                      <h6 className='text-sm font-medium'>
                                        Image {imageIndex + 1}
                                      </h6>
                                      <Button
                                        type='button'
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => {
                                          const images =
                                            form.getValues(`sliders.${index}.images`) || []
                                          images.splice(imageIndex, 1)
                                          form.setValue(`sliders.${index}.images`, images)
                                        }}
                                      >
                                        <Trash2 size={16} className='text-destructive' />
                                      </Button>
                                    </div>
                                    <ImageUploader
                                      fileId={form.watch(
                                        `sliders.${index}.images.${imageIndex}.fileId`
                                      )}
                                      initialPreview={form.watch(
                                        `sliders.${index}.images.${imageIndex}.file`
                                      )}
                                      setFile={(file) => {
                                        form.setValue(`sliders.${index}.images.${imageIndex}`, file)
                                      }}
                                    />
                                  </div>
                                )
                              )}
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={() => {
                                  const images = form.getValues(`sliders.${index}.images`) || []
                                  images.push({ thumbnail: '', file: '', fileId: '' })
                                  form.setValue(`sliders.${index}.images`, images)
                                }}
                              >
                                <PlusCircle className='mr-2 h-4 w-4' />
                                Add Image
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        const sliders = form.getValues('sliders') || []
                        sliders.push({
                          title: '',
                          subtitle: '',
                          images: [],
                          background: null
                        })
                        form.setValue('sliders', sliders)
                      }}
                    >
                      <PlusCircle className='mr-2 h-4 w-4' />
                      Add Slider
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* About Section Tab */}
            <TabsContent value='about'>
              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                  <CardDescription>Manage the about section on your homepage</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='about.title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder='About Us' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='about.description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='About your company...'
                            className='min-h-[200px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Section Tab */}
            <TabsContent value='products'>
              <Card>
                <CardHeader>
                  <CardTitle>Products Section</CardTitle>
                  <CardDescription>Manage the products section on your homepage</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='products.title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder='Our Products' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='products.description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Description of your products...' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Products selector will be added here */}
                  <div className='p-4 border border-dashed rounded-md'>
                    <p className='text-sm text-muted-foreground'>
                      Product selection will be implemented in a future update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Section Tab */}
            <TabsContent value='stats'>
              <Card>
                <CardHeader>
                  <CardTitle>Stats Section</CardTitle>
                  <CardDescription>Manage the statistics section on your homepage</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='stats.title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Title</FormLabel>
                        <FormControl>
                          <Input placeholder='Our Achievements' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='stats.image'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Image</FormLabel>
                        <FormControl>
                          <ImageUploader
                            fileId={field.value?.fileId}
                            initialPreview={field.value?.file}
                            setFile={(file) => {
                              form.setValue('stats.image', file)
                            }}
                          />
                        </FormControl>
                        <FormDescription>Background image for the stats section</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <h5 className='font-medium mb-4'>Statistics</h5>
                    <div className='space-y-4'>
                      {(form.watch('stats.stats') || []).map((_, index) => (
                        <div key={index} className='grid grid-cols-5 gap-4 mb-4'>
                          <FormField
                            control={form.control}
                            name={`stats.stats.${index}.title`}
                            render={({ field }) => (
                              <FormItem className='col-span-2'>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                  <Input placeholder='Happy Clients' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`stats.stats.${index}.value`}
                            render={({ field }) => (
                              <FormItem className='col-span-2'>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                  <Input placeholder='500+' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='self-center mt-6'
                            onClick={() => {
                              const stats = form.getValues('stats.stats') || []
                              stats.splice(index, 1)
                              form.setValue('stats.stats', stats)
                            }}
                          >
                            <Trash2 size={16} className='text-destructive' />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const stats = form.getValues('stats.stats') || []
                          stats.push({ title: '', value: '' })
                          form.setValue('stats.stats', stats)
                        }}
                      >
                        <PlusCircle className='mr-2 h-4 w-4' />
                        Add Statistic
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value='testimonials'>
              <Card>
                <CardHeader>
                  <CardTitle>Testimonials</CardTitle>
                  <CardDescription>
                    Manage the testimonials section on your homepage
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    {(form.watch('testimonials') || []).map((_, index) => (
                      <Card key={index} className='p-4'>
                        <div className='flex justify-between items-center mb-4'>
                          <h4 className='font-medium'>Testimonial {index + 1}</h4>
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              const testimonials = form.getValues('testimonials') || []
                              testimonials.splice(index, 1)
                              form.setValue('testimonials', testimonials)
                            }}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className='space-y-4'>
                          <FormField
                            control={form.control}
                            name={`testimonials.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder='Client Name' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`testimonials.${index}.designation`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                  <Input placeholder='CEO, Company Name' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`testimonials.${index}.comment`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Testimonial</FormLabel>
                                <FormControl>
                                  <Textarea placeholder='Client testimonial...' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Card>
                    ))}

                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        const testimonials = form.getValues('testimonials') || []
                        testimonials.push({
                          name: '',
                          designation: '',
                          comment: ''
                        })
                        form.setValue('testimonials', testimonials)
                      }}
                    >
                      <PlusCircle className='mr-2 h-4 w-4' />
                      Add Testimonial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Video Section Tab */}
            <TabsContent value='video'>
              <Card>
                <CardHeader>
                  <CardTitle>Video Section</CardTitle>
                  <CardDescription>Manage the video section on your homepage</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='video.link'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder='https://www.youtube.com/watch?v=...' {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a YouTube, Vimeo, or other video URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='video.thumbnail'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Thumbnail</FormLabel>
                        <FormControl>
                          <ImageUploader
                            fileId={field.value?.fileId}
                            initialPreview={field.value?.file}
                            setFile={(file) => {
                              form.setValue('video.thumbnail', file)
                            }}
                          />
                        </FormControl>
                        <FormDescription>Thumbnail image for the video</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className='mt-6'>
            <Button type='submit' disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
