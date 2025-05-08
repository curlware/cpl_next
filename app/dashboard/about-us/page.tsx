'use client'

import { getAboutUs, updateAboutUs } from '@/actions/data/aboutus'
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
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

// Define the Zod schema for validation
const aboutUsSchema = z.object({
  title: z.string().optional(),
  background: z
    .object({
      thumbnail: z.string().optional(),
      file: z.string().optional(),
      fileId: z.string().optional()
    })
    .optional(),
  banner: z
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
        description: z.string().optional(),
        hash: z.string().optional(),
        image: z
          .object({
            thumbnail: z.string().optional(),
            file: z.string().optional(),
            fileId: z.string().optional()
          })
          .optional()
      })
    )
    .optional(),
  team: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      members: z
        .array(
          z.object({
            name: z.string().optional(),
            designation: z.string().optional(),
            description: z.string().optional()
          })
        )
        .optional()
    })
    .optional()
})

// Define the inferred type from the schema
type AboutUsFormValues = z.infer<typeof aboutUsSchema>

export default function AboutUsPage() {
  const [loading, setLoading] = useState(false)

  // Initialize the form with react-hook-form
  const form = useForm<AboutUsFormValues>({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: {
      title: '',
      items: [],
      team: {
        title: '',
        description: '',
        members: []
      }
    }
  })

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await getAboutUs()
        if (response.success && response.data) {
          // Reset form with fetched data
          form.reset(response.data)
        }
      } catch (error) {
        console.error('Error fetching about us data:', error)
        toast.error('Could not load about us data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [form])

  // Handle form submission
  async function onSubmit(values: AboutUsFormValues) {
    setLoading(true)

    try {
      // Create a copy of the values to modify
      const formData = { ...values }

      // Use the server action to update about us data
      const response = await updateAboutUs(formData)

      if (response.success) {
        toast.success('About us data has been updated')
      } else {
        toast.error(response.error || 'Failed to update about us data')
      }
    } catch (error: any) {
      console.error('Error updating about us data:', error)
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container py-10'>
      <h1 className='text-2xl font-bold mb-6'>About Us Settings</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue='general' className='w-full'>
            <TabsList className='mb-4'>
              <TabsTrigger value='general'>General</TabsTrigger>
              <TabsTrigger value='sections'>Content Sections</TabsTrigger>
              <TabsTrigger value='team'>Team</TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value='general'>
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage the main about us page settings</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Title</FormLabel>
                        <FormControl>
                          <Input placeholder='About Our Company' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='background'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Image</FormLabel>
                        <FormControl>
                          <ImageUploader
                            fileId={field.value?.fileId}
                            initialPreview={field.value?.file}
                            setFile={(file) => {
                              form.setValue('background', file)
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Main background image for the about us page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='banner'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image</FormLabel>
                        <FormControl>
                          <ImageUploader
                            fileId={field.value?.fileId}
                            initialPreview={field.value?.file}
                            setFile={(file) => {
                              form.setValue('banner', file)
                            }}
                          />
                        </FormControl>
                        <FormDescription>Banner image for the about us page</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Sections Tab */}
            <TabsContent value='sections'>
              <Card>
                <CardHeader>
                  <CardTitle>Content Sections</CardTitle>
                  <CardDescription>Manage different sections in the about us page</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    {(form.watch('items') || []).map((_, index) => (
                      <Card key={index} className='p-4'>
                        <div className='flex justify-between items-center mb-4'>
                          <h4 className='font-medium'>Section {index + 1}</h4>
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              const items = form.getValues('items') || []
                              items.splice(index, 1)
                              form.setValue('items', items)
                            }}
                          >
                            Remove Section
                          </Button>
                        </div>

                        <div className='space-y-4'>
                          <FormField
                            control={form.control}
                            name={`items.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder='Section Title' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder='Section Description'
                                    className='min-h-[100px]'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`items.${index}.hash`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Section ID</FormLabel>
                                <FormControl>
                                  <Input placeholder='section-id' {...field} />
                                </FormControl>
                                <FormDescription>
                                  Used for direct linking (e.g., #section-id)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`items.${index}.image`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Section Image</FormLabel>
                                <FormControl>
                                  <ImageUploader
                                    fileId={field.value?.fileId}
                                    initialPreview={field.value?.file}
                                    setFile={(file) => {
                                      form.setValue(`items.${index}.image`, file)
                                    }}
                                  />
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
                        const items = form.getValues('items') || []
                        items.push({
                          title: '',
                          description: '',
                          hash: '',
                          image: { thumbnail: '', file: '', fileId: '' }
                        })
                        form.setValue('items', items)
                      }}
                    >
                      <PlusCircle className='mr-2 h-4 w-4' />
                      Add Section
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value='team'>
              <Card>
                <CardHeader>
                  <CardTitle>Team Section</CardTitle>
                  <CardDescription>Manage the team section on your about us page</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='team.title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Title</FormLabel>
                        <FormControl>
                          <Input placeholder='Our Team' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='team.description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Description of your team...'
                            className='min-h-[100px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-y-4'>
                    <h5 className='font-medium mb-2'>Team Members</h5>
                    {(form.watch('team.members') || []).map((_, index) => (
                      <Card key={index} className='p-4'>
                        <div className='flex justify-between items-center mb-4'>
                          <h4 className='font-medium'>Member {index + 1}</h4>
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              const members = form.getValues('team.members') || []
                              members.splice(index, 1)
                              form.setValue('team.members', members)
                            }}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className='space-y-4'>
                          <FormField
                            control={form.control}
                            name={`team.members.${index}.name`}
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

                          <FormField
                            control={form.control}
                            name={`team.members.${index}.designation`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                  <Input placeholder='CEO' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`team.members.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder='Brief bio...'
                                    className='min-h-[100px]'
                                    {...field}
                                  />
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
                        const members = form.getValues('team.members') || []
                        members.push({
                          name: '',
                          designation: '',
                          description: ''
                        })
                        form.setValue('team.members', members)
                      }}
                    >
                      <PlusCircle className='mr-2 h-4 w-4' />
                      Add Team Member
                    </Button>
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
