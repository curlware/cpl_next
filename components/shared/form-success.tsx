'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'

interface FormSuccessProps {
  message?: string
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null

  return (
    <Alert variant='default' className='bg-green-50 border-green-200'>
      <CheckCircle className='h-4 w-4 text-green-600' />
      <AlertDescription className='text-green-700'>{message}</AlertDescription>
    </Alert>
  )
}
