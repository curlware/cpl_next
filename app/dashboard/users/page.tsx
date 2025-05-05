'use client'

import { deleteUser, getUsers } from '@/actions/users'
import UserForm from '@/components/others/user-form'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Edit, Eye, PlusCircle, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const router = useRouter()

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const result = await getUsers(1, 100) // Simple implementation
      if (result.users) {
        setUsers(result.users)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await deleteUser(userId)
        if (result.success) {
          loadUsers() // Reload users after deletion
        } else {
          alert(result.error || 'Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('An error occurred while deleting the user')
      }
    }
  }

  const columns = [
    {
      header: 'Email',
      accessorKey: 'email'
    },
    {
      header: 'Actions',
      accessorKey: (row: any) => (
        <div className='flex space-x-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/dashboard/users/${row._id}`)
            }}
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={(e) => {
              e.stopPropagation()
              setSelectedUser(row)
              setFormOpen(true)
            }}
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row._id)
            }}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className='container mx-auto py-8'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Users</CardTitle>
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedUser(null)}>
                <PlusCircle className='h-4 w-4 mr-2' />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-md'>
              <DialogHeader>
                <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
              </DialogHeader>
              <UserForm
                user={selectedUser}
                onSuccess={() => {
                  setFormOpen(false)
                  loadUsers()
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex justify-center py-8'>Loading...</div>
          ) : (
            <DataTable
              data={users}
              columns={columns}
              searchable
              pagination
              pageSize={10}
              onRowClick={(user) => router.push(`/dashboard/users/${user._id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
