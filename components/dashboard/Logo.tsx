'use client'

import { updateHomepageSection } from '@/actions/data/homepage'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import ImageUploader from '../others/ImageUploader'
import { Button } from '../ui/button'

type TProps = {
  data?: Logo
}

export default function Logo({ data }: TProps) {
  const [logo, setLogo] = useState<Logo>()
  const handleLogoUpload = async () => {
    try {
      const result = await updateHomepageSection('logo', logo)
      if (result.success) {
        toast.success('Logo uploaded successfully')
      } else {
        toast.error(result.error || 'Failed to upload logo')
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      toast.error('Error uploading logo')
    }
  }

  return (
    <div>
      <h1 className='text-lg my-5 font-semibold lg:text-3xl'>Site Logo</h1>
      <p>Current Logo</p>
      <Image src={data?.file as string} alt='Logo' width={200} height={200} className='my-2 p-2' />
      <ImageUploader fileId={data?.fileId} setFile={setLogo} />
      <div className='mt-5'>
        <Button onClick={handleLogoUpload}>Upload New Image</Button>
      </div>
    </div>
  )
}
