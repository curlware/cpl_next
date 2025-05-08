import { Home, LayoutDashboard, Settings, Users } from 'lucide-react'

export const adminNavItems = [
  {
    icon: <LayoutDashboard className='w-4 h-4' />,
    label: 'Dashboard',
    link: '/dashboard'
  },
  {
    icon: <Settings className='w-4 h-4' />,
    label: 'Site Settings',
    link: '/dashboard/commons'
  },
  {
    icon: <Home className='w-4 h-4' />,
    label: 'Home Page',
    link: '/dashboard/homepage'
  },
  {
    icon: <Users className='w-4 h-4' />,
    label: 'Users',
    link: '/dashboard/users'
  }
]
