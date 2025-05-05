import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

type TProps = {}

export default async function page({}: TProps) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API}/get-data`)
  console.log('data', await data.json())
  return (
    <div>
      <div>
        <Link className='flex' href='/dashboard'>
          Dashboard <ArrowRight />
        </Link>
      </div>
    </div>
  )
}
