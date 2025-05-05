'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import ImageUploader from '@/components/others/ImageUploader'
import { FormError } from '@/components/shared/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
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
import SocialIcon from '@/components/ui/SocialIcon'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { memo, useMemo, useState } from 'react'
import { Control, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type TProps = {
  data?: TeamSection
}

// Available social media platforms from SocialIcon
const SOCIAL_PLATFORMS = [
  'facebook',
  'twitter',
  'x',
  'instagram',
  'linkedin',
  'youtube',
  'pinterest',
  'tiktok',
  'snapchat',
  'behance',
  'dribbble',
  'github',
  'gitlab',
  'medium',
  'reddit',
  'slack',
  'twitch',
  'whatsapp',
  'telegram',
  'discord',
  'vimeo',
  'threads',
  'mastodon'
]

// Define the Zod schema for social links
const socialLinkSchema = z.object({
  icon: z.string().min(1, { message: 'Platform is required' }),
  link: z.string().min(1, { message: 'Please enter a valid URL' }),
  _id: z.string().optional() // For unique identification
})

// Define the Zod schema for team members
const teamMemberSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name is too long' }),
  role: z
    .string()
    .min(1, { message: 'Role is required' })
    .max(100, { message: 'Role is too long' }),
  bio: z.string().max(500, { message: 'Bio is too long' }).optional(),
  // Image will be handled separately with ImageUploader
  socialLinks: z.array(socialLinkSchema).optional(),
  _id: z.string().optional() // For unique identification
})

// Define the Zod schema for the team section
const teamSectionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),
  subtitle: z
    .string()
    .min(1, { message: 'Subtitle is required' })
    .max(300, { message: 'Subtitle is too long' }),
  leftText: z.string().max(500, { message: 'Left text is too long' }).optional(),
  rightText: z.string().max(500, { message: 'Right text is too long' }).optional(),
  members: z.array(teamMemberSchema).min(1, { message: 'At least one team member is required' })
})

type TeamFormValues = z.infer<typeof teamSectionSchema>

// Social link item component - memoized for better performance
const SocialLinkItem = memo(
  ({
    index,
    socialIndex,
    control,
    onRemove
  }: {
    index: number
    socialIndex: number
    control: Control<TeamFormValues>
    onRemove: () => void
  }) => {
    return (
      <div className='flex gap-2 items-end'>
        {/* Social Platform */}
        <FormField
          control={control}
          name={`members.${index}.socialLinks.${socialIndex}.icon`}
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-[140px]'>
                    <SelectValue placeholder='Platform'>
                      {field.value && (
                        <div className='flex items-center gap-2'>
                          <SocialIcon network={field.value} size={16} />
                          <span className='capitalize'>{field.value}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        <div className='flex items-center gap-2'>
                          <SocialIcon network={platform} size={16} />
                          <span className='capitalize'>{platform}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Social Link */}
        <FormField
          control={control}
          name={`members.${index}.socialLinks.${socialIndex}.link`}
          render={({ field }) => (
            <FormItem className='flex-[2]'>
              <FormControl>
                <Input placeholder='https://...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remove Link Button */}
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='h-9 w-9 text-destructive'
          onClick={onRemove}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
    )
  }
)
SocialLinkItem.displayName = 'SocialLinkItem'

// Team member card component - memoized for better performance
const TeamMemberCard = memo(
  ({
    index,
    memberImage,
    onImageChange,
    onRemove,
    form,
    control,
    disabled
  }: {
    index: number
    memberImage?: MediaFile
    onImageChange: (file: MediaFile) => void
    onRemove: () => void
    form: any
    control: Control<TeamFormValues>
    disabled: boolean
  }) => {
    return (
      <Card className='p-5 relative border border-gray-200'>
        <div className='absolute top-4 right-4'>
          <Button
            type='button'
            onClick={onRemove}
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-destructive'
            disabled={disabled}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>

        <div className='grid gap-6 md:grid-cols-[200px_1fr]'>
          {/* Team member photo and basic info */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <FormLabel>Profile Photo</FormLabel>

              {/* Image preview */}
              {memberImage?.file && (
                <div className='mb-4 relative'>
                  <div className='border rounded-md overflow-hidden relative w-32 h-32'>
                    <Image
                      src={memberImage.file}
                      alt={`${form.getValues().members[index].name || 'Team member'} profile`}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>Current photo</p>
                </div>
              )}

              {/* Image uploader */}
              <ImageUploader fileId={memberImage?.fileId} setFile={onImageChange} />
              <p className='text-xs text-muted-foreground'>
                Upload a profile photo. Square photos work best.
              </p>
            </div>

            {/* Member name */}
            <FormField
              control={control}
              name={`members.${index}.name`}
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

            {/* Member role */}
            <FormField
              control={control}
              name={`members.${index}.role`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role/Position</FormLabel>
                  <FormControl>
                    <Input placeholder='CEO' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='space-y-6'>
            {/* Member bio */}
            <FormField
              control={control}
              name={`members.${index}.bio`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='A brief bio about this team member...'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social Links */}
            <SocialLinksSection index={index} form={form} control={control} />
          </div>
        </div>
      </Card>
    )
  }
)
TeamMemberCard.displayName = 'TeamMemberCard'

// Social links section component - extracted for better performance
const SocialLinksSection = memo(
  ({ index, form, control }: { index: number; form: any; control: Control<TeamFormValues> }) => {
    const addSocialLink = () => {
      const currentLinks = form.getValues(`members.${index}.socialLinks`) || []
      form.setValue(`members.${index}.socialLinks`, [
        ...currentLinks,
        {
          icon: 'linkedin',
          link: '',
          _id: Math.random().toString(36).substring(2, 9)
        }
      ])
    }

    const socialLinks = form.getValues(`members.${index}.socialLinks`) || []
    const socialLinksLength = socialLinks.length

    return (
      <div className='space-y-3'>
        <div className='flex justify-between items-center'>
          <FormLabel>Social Media Links</FormLabel>

          <Button type='button' variant='outline' size='sm' onClick={addSocialLink}>
            <Plus className='h-3 w-3 mr-1' />
            Add Link
          </Button>
        </div>

        <div className='space-y-2'>
          {useMemo(() => {
            const links = form.getValues(`members.${index}.socialLinks`) || []
            return links.map((_: any, socialIndex: any) => (
              <SocialLinkItem
                key={`${index}-${socialIndex}`}
                index={index}
                socialIndex={socialIndex}
                control={control}
                onRemove={() => {
                  const currentLinks = [...(form.getValues(`members.${index}.socialLinks`) || [])]
                  currentLinks.splice(socialIndex, 1)
                  form.setValue(`members.${index}.socialLinks`, currentLinks)
                }}
              />
            ))
          }, [form, index, socialLinksLength, control])}

          {(!socialLinks || socialLinks.length === 0) && (
            <div className='text-sm text-muted-foreground py-2'>
              No social links added. Click "Add Link" to add social media profiles.
            </div>
          )}
        </div>
      </div>
    )
  }
)
SocialLinksSection.displayName = 'SocialLinksSection'

export default function Team({ data }: TProps) {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State for team member images (separate from form state to handle file uploads)
  const [memberImages, setMemberImages] = useState<(MediaFile | undefined)[]>(
    data?.members?.map((member) => member.image) || []
  )

  // Create form with default values from data prop and optimize validation
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSectionSchema),
    defaultValues: {
      title: data?.title || '',
      subtitle: data?.subtitle || '',
      leftText: data?.leftText || '',
      rightText: data?.rightText || '',
      members: data?.members?.map((member) => ({
        name: member.name || '',
        role: member.role || '',
        bio: member.bio || '',
        socialLinks:
          member.socialLinks?.map((link) => ({
            icon: link.icon || '',
            link: link.link || '',
            _id: Math.random().toString(36).substring(2, 9)
          })) || [],
        _id: Math.random().toString(36).substring(2, 9)
      })) || [
        {
          name: '',
          role: '',
          bio: '',
          socialLinks: [],
          _id: Math.random().toString(36).substring(2, 9)
        }
      ]
    },
    mode: 'onBlur', // Only validate when focus leaves a field
    shouldUnregister: false, // Keep fields registered when they unmount
    reValidateMode: 'onBlur' // Only revalidate when focus leaves a field
  })

  const { control } = form

  // Set up field array for managing team members
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members'
  })

  // Update team member image when adding or removing items
  const updateMemberImage = (index: number, image: MediaFile) => {
    const newImages = [...memberImages]
    newImages[index] = image
    setMemberImages(newImages)
  }

  // Add a new team member
  const addTeamMember = () => {
    append({
      name: '',
      role: '',
      bio: '',
      socialLinks: [],
      _id: Math.random().toString(36).substring(2, 9)
    })
    // Add an empty image placeholder
    setMemberImages([...memberImages, undefined])
  }

  // Remove a team member
  const removeTeamMember = (index: number) => {
    remove(index)
    // Also remove the corresponding image
    const newImages = [...memberImages]
    newImages.splice(index, 1)
    setMemberImages(newImages)
  }

  // Submit handler
  const onSubmit = async (values: TeamFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Combine form data with image data
      const teamData: TeamSection = {
        title: values.title,
        subtitle: values.subtitle,
        leftText: values.leftText,
        rightText: values.rightText,
        members: values.members.map((member, index) => ({
          name: member.name,
          role: member.role,
          bio: member.bio,
          image: memberImages[index],
          // Filter out _id from socialLinks to prevent MongoDB validation errors
          socialLinks: member.socialLinks?.map((link) => ({
            icon: link.icon,
            link: link.link
            // Intentionally omitting _id here
          }))
        }))
      }

      // Call the server action to update the team section
      const result = await updateHomepageSection('team', teamData)

      if (result.success) {
        toast.success('Team section updated successfully')
      } else {
        toast.error(result.error || 'An error occurred while updating the team section')
        setError(result.error || 'An error occurred while updating the team section')
      }
    } catch (err) {
      console.error('Error updating team section:', err)
      toast.error('An unexpected error occurred')
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Memoize team members to prevent unnecessary re-renders
  const teamMembers = useMemo(() => {
    return fields.map((field, index) => (
      <TeamMemberCard
        key={field._id}
        index={index}
        memberImage={memberImages[index]}
        onImageChange={(file) => updateMemberImage(index, file)}
        onRemove={() => removeTeamMember(index)}
        form={form}
        control={control}
        disabled={fields.length <= 1}
      />
    ))
  }, [fields.length, memberImages, form, control])

  return (
    <div>
      <h1 className='text-lg my-5 font-semibold lg:text-3xl'>Team Section</h1>

      <Card>
        <CardContent className='pt-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              {/* Display error message */}
              {error && <FormError message={error} />}

              {/* Section title and subtitle */}
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={control}
                  name='title'
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
                  control={control}
                  name='subtitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder='Meet the experts behind our success' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Optional text columns */}
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={control}
                  name='leftText'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Left Column Text (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Additional information about your team...'
                          className='h-24'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='rightText'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Right Column Text (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Additional information about your team...'
                          className='h-24'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Team members */}
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-lg font-medium'>Team Members</h2>
                  <Button type='button' onClick={addTeamMember} variant='outline' size='sm'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Team Member
                  </Button>
                </div>

                <div className='space-y-6'>{teamMembers}</div>

                {fields.length === 0 && (
                  <div className='text-center py-8 text-muted-foreground'>
                    No team members added yet. Click the "Add Team Member" button to add one.
                  </div>
                )}
              </div>

              <Button type='submit' disabled={isSubmitting} className='mt-6'>
                {isSubmitting ? 'Saving...' : 'Save Team Section'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
