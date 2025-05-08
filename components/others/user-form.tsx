'use client'

import { createUser, updateUser } from '@/actions/users'
import { FormError } from '@/components/shared/form-error'
import { FormSuccess } from '@/components/shared/form-success'
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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface UserFormProps {
  user?: TUser & { _id: string } // Optional user prop for updating
  onSuccess?: () => void
}

// Define the Zod schema for user data validation
const createUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
})

// Schema for updating a user (password is optional)
const updateUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().optional()
})

// Define the form types to ensure type safety
type CreateUserFormValues = z.infer<typeof createUserSchema>
type UpdateUserFormValues = z.infer<typeof updateUserSchema>
type FormValues = CreateUserFormValues | UpdateUserFormValues

export default function UserForm({ user, onSuccess }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | undefined>()
  const [successMsg, setSuccessMsg] = useState<string | undefined>()

  // Select the appropriate schema based on whether we're creating or updating a user
  const formSchema = user ? updateUserSchema : createUserSchema

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || '',
      password: ''
    }
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setServerError(undefined) // Clear previous errors
    setSuccessMsg(undefined) // Clear previous success messages

    try {
      let result

      if (user) {
        // Update existing user
        const updateData = {
          email: data.email
        } as const

        // Only include password if it's not empty
        if (data.password && data.password.length > 0) {
          result = await updateUser(user._id, {
            ...updateData,
            password: data.password
          })
        } else {
          result = await updateUser(user._id, updateData)
        }
      } else {
        // Create new user - password is required
        // We can safely assert data has password because createUserSchema requires it
        const createData = {
          email: data.email,
          password: (data as CreateUserFormValues).password
        }

        result = await createUser(createData)
      }

      if (result.error) {
        setServerError(result.error)
      } else {
        setSuccessMsg(user ? 'User updated successfully!' : 'User created successfully!')

        // Only call onSuccess after a short delay so the user can see the success message
        setTimeout(() => {
          onSuccess?.()
        }, 1500)

        if (!user) {
          form.reset() // Reset form after successful creation
        }
      }
    } catch (error: any) {
      console.error('Error saving user:', error)
      setServerError(error.message || 'Failed to save user')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-2'>
        <FormError message={serverError} />
        <FormSuccess message={successMsg} />

        {/* Email field */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='Enter email address' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password field */}
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{user ? 'Password (leave blank to keep current)' : 'Password'}</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder={user ? 'Leave blank to keep current' : 'Enter password'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end pt-4'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
