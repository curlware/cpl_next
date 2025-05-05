'use client'

import { login } from '@/actions/users/auth'
import { FormError } from '@/components/shared/form-error'
import { FormSuccess } from '@/components/shared/form-success'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

// Define validation schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: LoginFormValues) => {
    setError(undefined)
    setSuccess(undefined)

    startTransition(async () => {
      try {
        const result = await login(values)
        console.log('rsutl', result)

        if (result.error) {
          setError(result.error)
        } else if (result.success) {
          setSuccess('Login successful! Redirecting...')
          router.push('/dashboard')
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    })
  }

  return (
    <div className='flex justify-center items-center min-h-screen py-12 px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>Sign In</CardTitle>
          <CardDescription className='text-center'>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormError message={error} />
              <FormSuccess message={success} />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='name@example.com'
                        type='email'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your password'
                        type='password'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex flex-col'>
          <div className='text-center text-sm text-muted-foreground mt-2'>
            Don&apos;t have an account?{' '}
            <a href='#' className='underline'>
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
