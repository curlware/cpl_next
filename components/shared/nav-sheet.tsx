'use client'

import { renderadminNavItems } from '@/app/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { AlignLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'

type TProps = {
  logo: string
  currentHash: string
  setCurrentHash: (hash: string) => void
  items: any[]
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export default function NavSheet({
  logo,
  items,
  side = 'left',
  currentHash,
  setCurrentHash
}: TProps) {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline'>
          <AlignLeft />
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>
            {logo}
            {/* <Image src={logo} alt='Logo' width={100} height={100} /> */}
          </SheetTitle>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto py-5'>
          <nav className='px-3 space-y-1'>
            {renderadminNavItems(items, currentHash, setCurrentHash)}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
