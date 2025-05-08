'use client'

import { getSharedData } from '@/actions/data/shared'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { SOCIAL_PLATFORMS } from '@/configs/reset-data'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Trash2 } from 'lucide-react'
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
    .optional(),
  footer: z
    .object({
      copywrite: z.string().optional(),
      contactoffice: z
        .array(
          z.object({
            key: z.string().optional(),
            value: z.string().optional()
          })
        )
        .optional(),
      contactfactory: z
        .array(
          z.object({
            key: z.string().optional(),
            value: z.string().optional()
          })
        )
        .optional(),
      sociallinks: z
        .array(
          z.object({
            icon: z.string().optional(),
            link: z.string().optional()
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
      },
      footer: {
        copywrite: '',
        contactoffice: [],
        contactfactory: [],
        sociallinks: []
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
  }, [])

  // Handle form submission
  async function onSubmit(values: SharedFormValues) {
    setLoading(true)

    try {
      // Use the POST API endpoint instead of the server action
      const response = await fetch('/api/v1/shared', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Shared data has been updated')
      } else {
        toast.error(result.error || 'Failed to update shared data')
        console.error('Error details from server:', result.details)
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
              <TabsTrigger value='footer'>Footer</TabsTrigger>
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

            <TabsContent value='footer'>
              <Card>
                <CardHeader>
                  <CardTitle>Footer Settings</CardTitle>
                  <CardDescription>
                    Manage your site's footer information and social links
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-8'>
                  {/* Copyright Text */}
                  <FormField
                    control={form.control}
                    name='footer.copywrite'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Copyright Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='© 2025 Your Company Name. All rights reserved.'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Copyright text displayed at the bottom of your website
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Office Contact Information */}
                  <div>
                    <h3 className='text-lg font-medium mb-4'>Office Contact Information</h3>
                    <div className='space-y-4'>
                      {(form.watch('footer.contactoffice') || []).map((_, index) => (
                        <div key={index} className='grid grid-cols-5 gap-4 mb-4'>
                          <FormField
                            control={form.control}
                            name={`footer.contactoffice.${index}.key`}
                            render={({ field }) => (
                              <FormItem className='col-span-2'>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                  <Input placeholder='Address, Phone, Email, etc.' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`footer.contactoffice.${index}.value`}
                            render={({ field }) => (
                              <FormItem className='col-span-2'>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='123 Main St, +1 555-123-4567, etc.'
                                    {...field}
                                  />
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
                              const items = form.getValues('footer.contactoffice') || []
                              items.splice(index, 1)
                              form.setValue('footer.contactoffice', items)
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
                        className='mt-2'
                        onClick={() => {
                          const items = form.getValues('footer.contactoffice') || []
                          items.push({ key: '', value: '' })
                          form.setValue('footer.contactoffice', items)
                        }}
                      >
                        <PlusCircle className='mr-2 h-4 w-4' />
                        Add Office Contact
                      </Button>
                    </div>
                  </div>

                  {/* Factory Contact Information */}
                  <div>
                    <h3 className='text-lg font-medium mb-4'>Factory Contact Information</h3>
                    <div className='space-y-4'>
                      {(form.watch('footer.contactfactory') || []).map((_, index) => (
                        <div key={index} className='grid grid-cols-5 gap-4 mb-4'>
                          <FormField
                            control={form.control}
                            name={`footer.contactfactory.${index}.key`}
                            render={({ field }) => (
                              <FormItem className='col-span-2'>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                  <Input placeholder='Address, Phone, Email, etc.' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`footer.contactfactory.${index}.value`}
                            render={({ field }) => (
                              <FormItem className='col-span-2'>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='456 Factory Rd, +1 555-987-6543, etc.'
                                    {...field}
                                  />
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
                              const items = form.getValues('footer.contactfactory') || []
                              items.splice(index, 1)
                              form.setValue('footer.contactfactory', items)
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
                        className='mt-2'
                        onClick={() => {
                          const items = form.getValues('footer.contactfactory') || []
                          items.push({ key: '', value: '' })
                          form.setValue('footer.contactfactory', items)
                        }}
                      >
                        <PlusCircle className='mr-2 h-4 w-4' />
                        Add Factory Contact
                      </Button>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className='text-lg font-medium mb-4'>Social Media Links</h3>
                    <div className='space-y-4'>
                      {(form.watch('footer.sociallinks') || []).map((_, index) => (
                        <div key={index} className='grid grid-cols-5 gap-4 mb-4'>
                          <FormField
                            control={form.control}
                            name={`footer.sociallinks.${index}.icon`}
                            render={({ field }) => (
                              <FormItem className='col-span-2'>
                                <FormLabel>Platform</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select platform' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {SOCIAL_PLATFORMS.map((platform) => (
                                      <SelectItem key={platform} value={platform}>
                                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`footer.sociallinks.${index}.link`}
                            render={({ field }) => (
                              <FormItem className='col-span-2'>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                  <Input placeholder='https://www.example.com/profile' {...field} />
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
                              const items = form.getValues('footer.sociallinks') || []
                              items.splice(index, 1)
                              form.setValue('footer.sociallinks', items)
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
                        className='mt-2'
                        onClick={() => {
                          const items = form.getValues('footer.sociallinks') || []
                          items.push({ icon: '', link: '' })
                          form.setValue('footer.sociallinks', items)
                        }}
                      >
                        <PlusCircle className='mr-2 h-4 w-4' />
                        Add Social Link
                      </Button>
                    </div>
                  </div>
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
