'use client'

import NavSheet from '@/components/shared/nav-sheet'
import { adminNavItems } from '@/configs/nav-data'
import { cn } from '@/lib/utils'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

// Recursive function to render nav items with children
export const renderadminNavItems = (pathname: string) => {
  const router = useRouter()
  return adminNavItems.map((item, idx) => {
    const isActive = (link: string) => pathname === link

    return (
      <div key={idx} className='mb-2'>
        <button
          onClick={() => (item.link ? router.push(item.link) : void 0)}
          className={cn(
            'flex gap-2 items-center w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
            isActive(item.link)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          {item.icon}
          {item.label}
        </button>
      </div>
    )
  })
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const MobileNav = () => {
    return (
      <div className='lg:hidden p-2 flex items-center'>
        <NavSheet pathname={pathname} logo='CPML Admin' items={adminNavItems} />
        <p className='font-semibold ml-3 text-lg'>Admin Dashboard</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      {/* Mobile Slide Sheet */}
      <MobileNav />
      <div className='flex'>
        {/* Desktop Sidebar */}
        <aside className='hidden lg:flex w-64 flex-col fixed inset-y-0 z-10 border-r bg-background'>
          <div className='px-6 py-5 border-b'>
            <Link href='/' className='flex items-center font-bold text-lg'>
              CPML Admin
            </Link>
          </div>
          <div className='flex-1 overflow-y-auto py-5'>
            <nav className='px-3 space-y-1'>{renderadminNavItems(pathname)}</nav>
          </div>
          <div className='px-6 py-4 border-t'>
            <div className='text-xs text-muted-foreground'>
              &copy; {new Date().getFullYear()} CPML Admin
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 lg:pl-64'>
          <div className='container mx-auto px-4 py-6'>{children}</div>
        </main>
      </div>
    </div>
  )
}
