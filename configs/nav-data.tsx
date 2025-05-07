import { LayoutDashboard, Users } from 'lucide-react'

export const adminNavItems = [
  {
    icon: <LayoutDashboard className='w-4 h-4' />,
    label: 'Dashboard',
    link: '/dashboard'
  },
  {
    icon: <Users className='w-4 h-4' />,
    label: 'Users',
    link: '/dashboard/users'
  }
]
