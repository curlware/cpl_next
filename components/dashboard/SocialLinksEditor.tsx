'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SocialIcon from '@/components/ui/SocialIcon'
import React, { useState } from 'react'

interface SocialLink {
  network: string
  link: string
}

interface SocialLinksEditorProps {
  initialLinks: SocialLink[]
}

const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({ initialLinks = [] }) => {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)
  const [isLoading, setIsLoading] = useState(false)

  const addNewLink = () => {
    setLinks([...links, { network: '', link: '' }])
  }

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...links]
    updatedLinks[index][field] = value
    setLinks(updatedLinks)
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // setIsLoading(true)

    try {
      // Filter out empty links
      const filteredLinks = links.filter((link) => link.network && link.link)

      // Show success message or notification
      console.log('Social links updated successfully', filteredLinks)
    } catch (error) {
      console.error('Failed to update social links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold'>Social Media Links</h2>

        {links.map((link, index) => (
          <div key={index} className='flex items-center space-x-4'>
            <div className='w-1/3'>
              <Label htmlFor={`network-${index}`}>Platform</Label>
              <div className='flex items-center space-x-2'>
                <SocialIcon network={link.network || 'default'} size={20} />
                <Input
                  id={`network-${index}`}
                  placeholder='facebook, twitter, etc.'
                  value={link.network}
                  onChange={(e) => updateLink(index, 'network', e.target.value)}
                />
              </div>
            </div>

            <div className='flex-1'>
              <Label htmlFor={`link-${index}`}>URL</Label>
              <Input
                id={`link-${index}`}
                placeholder='https://...'
                value={link.link}
                onChange={(e) => updateLink(index, 'link', e.target.value)}
              />
            </div>

            <Button
              type='button'
              variant='destructive'
              onClick={() => removeLink(index)}
              className='mt-6'
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className='flex space-x-4'>
        <Button type='button' variant='outline' onClick={addNewLink}>
          Add Social Link
        </Button>

        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Social Links'}
        </Button>
      </div>
    </form>
  )
}

export default SocialLinksEditor
