'use client' // This component must be a client component

import { cn } from '@/lib/utils'
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload
} from '@imagekit/next'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type TProps = {
  fileId?: string
  initialPreview?: string // Add optional initialPreview prop
  setFile: (value: MediaFile) => void
}
// ImageUploader component demonstrates file uploading using ImageKit's Next.js SDK.
export default function ImageUploader({ fileId, initialPreview, setFile }: TProps) {
  // State to keep track of the current upload progress (percentage)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(initialPreview)

  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController()

  // Set initial preview if passed as prop
  useEffect(() => {
    setPreview(initialPreview)
  }, [initialPreview])

  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch('/api/upload-auth')
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text()
        throw new Error(`Request failed with status ${response.status}: ${errorText}`)
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json()
      const { signature, expire, token, publicKey } = data
      return { signature, expire, token, publicKey }
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error('Authentication error:', error)
      throw new Error('Authentication request failed')
    }
  }

  const handleUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('Please select a file to upload')
      return
    }

    // Extract the first file from the file input
    const file = fileInput.files[0]

    // Retrieve authentication parameters for the upload.
    let authParams
    try {
      authParams = await authenticator()
    } catch (authError) {
      console.error('Failed to authenticate for upload:', authError)
      return
    }
    const { signature, expire, token, publicKey } = authParams

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal
      })

      const fileData = {
        file: uploadResponse.url,
        fileId: uploadResponse.fileId,
        thumbnail: uploadResponse.thumbnailUrl
      }

      // Update the preview
      setPreview(uploadResponse.url)
      setFile(fileData)
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error('Upload aborted:', error.reason)
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error('Invalid request:', error.message)
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error('Network error:', error.message)
      } else if (error instanceof ImageKitServerError) {
        console.error('Server error:', error.message)
      } else {
        // Handle any other errors that may occur.
        console.error('Upload error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async () => {
    setLoading(true)
    if (fileId) {
      if (window.confirm('Are you sure you want to delete the previous image?')) {
        try {
          await fetch(`/api/delete-image/?fileId=${fileId}`, {
            method: 'DELETE'
          })
          // Clear preview on delete
          setPreview(undefined)
        } catch (error) {
          toast.warning('Failed to delete the previous image')
          console.error('Error deleting image:', error)
          setLoading(false)
        }
      }
    }
    await handleUpload()
  }

  return (
    <div className='space-y-3'>
      <div className='flex flex-col'>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleDeleteImage}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer'
          )}
        />

        {/* Loading indicator */}
        {loading ? (
          <div className='my-2'>
            <p className='text-amber-500 font-medium text-sm'>Wait, Uploading...</p>
          </div>
        ) : null}

        {/* Image preview */}
        {preview && (
          <div className='mt-3'>
            <div className='relative w-20 h-20 overflow-hidden rounded-md border border-border'>
              <Image src={preview} alt='Uploaded image preview' fill className='object-cover' />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
