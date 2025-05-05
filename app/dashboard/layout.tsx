'use client'

import { handleResetData } from '@/components/others/resetData'
import NavSheet from '@/components/shared/nav-sheet'
import { adminNavItems } from '@/configs/nav-data'
import { cn } from '@/lib/utils'
import { scrollToElement } from '@/utils/scrollTo'
import { Undo2 } from 'lucide-react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Recursive function to render nav items with children
export const renderadminNavItems = (
  items: typeof adminNavItems,
  currentHash: string,
  setCurrentHash: (hash: string) => void
) => {
  const router = useRouter()
  return items.map((item, idx) => {
    const isActive = (link: string) => currentHash === link

    return (
      <div key={idx} className='mb-2'>
        <button
          onClick={() => (item.link ? router.push(item.link) : void 0)}
          className={cn(
            'flex items-center w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors',
            isActive(item.link)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            item.link === '' && 'bg-transparent hover:bg-transparent'
          )}
        >
          {item.icon}
          {item.label}
        </button>

        {item.children && (
          <div className='ml-4 mt-1 border-l pl-2'>
            {item.children.map((child, idx) => (
              <button
                key={idx}
                onClick={() => {
                  scrollToElement(child.link)
                  setCurrentHash(child.link)
                }}
                className={cn(
                  'flex items-center w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-colors mt-1',
                  isActive(child.link)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {child.icon}
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  })
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [currentHash, setCurrentHash] = useState('')

  useEffect(() => {
    if (window) {
      const id = window.location.hash?.substring(1) || ''
      setCurrentHash(id)
      scrollToElement(id)
    }
  }, [])

  const MobileNav = () => {
    return (
      <div className='lg:hidden p-2 flex items-center'>
        <NavSheet
          logo='Blanka Admin'
          items={adminNavItems}
          currentHash={currentHash}
          setCurrentHash={setCurrentHash}
        />
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
              Blanka Admin
            </Link>
          </div>
          <div className='flex-1 overflow-y-auto py-5'>
            <nav className='px-3 space-y-1'>
              {renderadminNavItems(adminNavItems, currentHash, setCurrentHash)}
              <button
                onClick={handleResetData}
                className={cn(
                  'flex items-center w-full cursor-pointer gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Undo2 className='size-5' />
                Reset all data
              </button>
            </nav>
          </div>
          <div className='px-6 py-4 border-t'>
            <div className='text-xs text-muted-foreground'>
              &copy; {new Date().getFullYear()} Blanka Admin
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
