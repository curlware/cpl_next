'use client'

import { getSharedData, updateSharedData } from '@/actions/data/shared'
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
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

// Define the Zod schema for validation
const sharedFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ctatext: z.string().optional(),
  ctalink: z.string().optional(),
  favicon: z
    .object({
      thumbnail: z.string().optional(),
      file: z.string().optional(),
      fileId: z.string().optional()
    })
    .optional(),
  nav: z
    .object({
      logo: z
        .object({
          thumbnail: z.string().optional(),
          file: z.string().optional(),
          fileId: z.string().optional()
        })
        .optional(),
      items: z
        .array(
          z.object({
            title: z.string().optional(),
            link: z.string().optional(),
            children: z
              .array(
                z.object({
                  title: z.string().optional(),
                  link: z.string().optional()
                })
              )
              .optional()
          })
        )
        .optional()
    })
    .optional()
})

// Define the inferred type from the schema
type SharedFormValues = z.infer<typeof sharedFormSchema>

export default function SharedDataPage() {
  const [loading, setLoading] = useState(false)

  // Initialize the form with react-hook-form
  const form = useForm<SharedFormValues>({
    resolver: zodResolver(sharedFormSchema),
    defaultValues: {
      title: '',
      description: '',
      keywords: '',
      ctatext: '',
      ctalink: '',
      favicon: {
        thumbnail: '',
        file: '',
        fileId: ''
      },
      nav: {
        logo: {
          thumbnail: '',
          file: '',
          fileId: ''
        },
        items: []
      }
    }
  })

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await getSharedData()
        if (response.success && response.data) {
          // Reset form with fetched data
          form.reset(response.data)
        }
      } catch (error) {
        console.error('Error fetching shared data:', error)
        toast.error('Could not load shared data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [form])

  // Handle form submission
  async function onSubmit(values: SharedFormValues) {
    setLoading(true)
    try {
      const response = await updateSharedData(values)

      if (response.success) {
        toast.success('Shared data has been updated')
      } else {
        toast.error(response.error || 'Failed to update shared data')
      }
    } catch (error) {
      console.error('Error updating shared data:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container py-10'>
      <h1 className='text-2xl font-bold mb-6'>Site Settings</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue='general' className='w-full'>
            <TabsList className='mb-4'>
              <TabsTrigger value='general'>General</TabsTrigger>
              <TabsTrigger value='navigation'>Navigation</TabsTrigger>
              <TabsTrigger value='cta'>Call to Action</TabsTrigger>
            </TabsList>

            <TabsContent value='general'>
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your site's metadata and favicon</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Title</FormLabel>
                        <FormControl>
                          <Input placeholder='Your site title' {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be displayed in browser tabs and search results
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Brief description of your site' {...field} />
                        </FormControl>
                        <FormDescription>Used in search results and social shares</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='keywords'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Input placeholder='keyword1, keyword2, keyword3' {...field} />
                        </FormControl>
                        <FormDescription>Comma-separated keywords for SEO</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='favicon'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favicon</FormLabel>
                        <FormControl>
                          <ImageUploader
                            fileId={field.value?.fileId}
                            initialPreview={field.value?.file}
                            setFile={(file) => {
                              form.setValue('favicon', file)
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Image shown in browser tabs (recommended size: 32x32)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='navigation'>
              <Card>
                <CardHeader>
                  <CardTitle>Navigation</CardTitle>
                  <CardDescription>Manage your site's navigation menu</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='nav.logo'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Logo</FormLabel>
                        <FormControl>
                          <ImageUploader
                            fileId={field.value?.fileId}
                            initialPreview={field.value?.file}
                            setFile={(file) => {
                              form.setValue('nav.logo', file)
                            }}
                          />
                        </FormControl>
                        <FormDescription>Your site's main logo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <h3 className='text-lg font-medium mb-2'>Navigation Items</h3>
                    <div className='space-y-4'>
                      {form.watch('nav.items')?.map((_, index) => (
                        <Card key={index} className='p-4'>
                          <div className='flex justify-between items-center mb-2'>
                            <h4 className='font-medium'>Menu Item {index + 1}</h4>
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              onClick={() => {
                                const items = form.getValues('nav.items') || []
                                items.splice(index, 1)
                                form.setValue('nav.items', items)
                              }}
                            >
                              Remove
                            </Button>
                          </div>

                          <div className='grid grid-cols-2 gap-4 mb-4'>
                            <FormField
                              control={form.control}
                              name={`nav.items.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`nav.items.${index}.link`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Link</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div>
                            <h5 className='font-medium mb-2'>Dropdown Items</h5>
                            <div className='space-y-4 pl-4 border-l-2 border-gray-200'>
                              {(form.watch(`nav.items.${index}.children`) || []).map(
                                (_, childIndex) => (
                                  <div key={childIndex} className='grid grid-cols-5 gap-4 mb-2'>
                                    <FormField
                                      control={form.control}
                                      name={`nav.items.${index}.children.${childIndex}.title`}
                                      render={({ field }) => (
                                        <FormItem className='col-span-2'>
                                          <FormLabel>Title</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name={`nav.items.${index}.children.${childIndex}.link`}
                                      render={({ field }) => (
                                        <FormItem className='col-span-2'>
                                          <FormLabel>Link</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
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
                                        const children =
                                          form.getValues(`nav.items.${index}.children`) || []
                                        children.splice(childIndex, 1)
                                        form.setValue(`nav.items.${index}.children`, children)
                                      }}
                                    >
                                      <Trash2 size={16} className='text-destructive' />
                                    </Button>
                                  </div>
                                )
                              )}

                              <Button
                                type='button'
                                variant='success'
                                size='sm'
                                onClick={() => {
                                  const children =
                                    form.getValues(`nav.items.${index}.children`) || []
                                  children.push({ title: '', link: '' })
                                  form.setValue(`nav.items.${index}.children`, children)
                                }}
                              >
                                Add Dropdown Item
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}

                      <Button
                        type='button'
                        variant='success'
                        onClick={() => {
                          const items = form.getValues('nav.items') || []
                          items.push({ title: '', link: '', children: [] })
                          form.setValue('nav.items', items)
                        }}
                      >
                        Add Menu Item
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='cta'>
              <Card>
                <CardHeader>
                  <CardTitle>Call to Action</CardTitle>
                  <CardDescription>Configure your site-wide call to action button</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='ctatext'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder='Get Started' {...field} />
                        </FormControl>
                        <FormDescription>Text displayed on your CTA button</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='ctalink'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder='/contact' {...field} />
                        </FormControl>
                        <FormDescription>Where the button should link to</FormDescription>
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
