'use client'

import { deleteUser, getUserById } from '@/actions/users'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserForm from '../../../../components/others/user-form'

export default function UserDetailPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        const result = await getUserById(id as string)
        if (result.user) {
          setUser(result.user)
        } else {
          // User not found
          alert(result.error || 'User not found')
          router.push('/dashboard/users')
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        alert('An error occurred while loading user data')
        router.push('/dashboard/users')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [id, router])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await deleteUser(id as string)
        if (result.success) {
          router.push('/dashboard/users')
        } else {
          alert(result.error || 'Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('An error occurred while deleting the user')
      }
    }
  }

  return (
    <div className='container mx-auto py-8'>
      <Button variant='outline' onClick={() => router.push('/dashboard/users')} className='mb-4'>
        <ArrowLeft className='h-4 w-4 mr-2' />
        Back to Users
      </Button>

      {isLoading ? (
        <div className='flex justify-center py-8'>Loading...</div>
      ) : user ? (
        <>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle className='text-2xl'>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
              <div className='flex space-x-2'>
                <Button variant='outline' onClick={() => setFormOpen(true)}>
                  <Edit className='h-4 w-4 mr-2' />
                  Edit
                </Button>
                <Button variant='destructive' onClick={handleDelete}>
                  <Trash2 className='h-4 w-4 mr-2' />
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-24 w-24'>
                  <AvatarFallback className='text-lg'>RS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className='font-medium'>Account Details</h3>
                  <p className='text-sm text-muted-foreground'>User information and preferences</p>
                </div>
              </div>

              <Separator />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>Account Created</h4>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>Last Updated</h4>
                  <p>{new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogContent className='max-w-md'>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <UserForm
                user={user}
                onSuccess={() => {
                  setFormOpen(false)
                  // Reload user data after update
                  getUserById(id as string).then((result) => {
                    if (result.user) {
                      setUser(result.user)
                    }
                  })
                }}
              />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Card>
          <CardContent className='py-10 text-center'>
            <p>User not found or has been deleted.</p>
            <Button className='mt-4' onClick={() => router.push('/dashboard/users')}>
              Return to Users List
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
