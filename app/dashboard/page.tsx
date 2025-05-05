import About from '@/components/dashboard/About'
import Clients from '@/components/dashboard/Clients'
import Hero from '@/components/dashboard/Hero'
import Logo from '@/components/dashboard/Logo'
import Services from '@/components/dashboard/Services'
import Team from '@/components/dashboard/Team'
import Testimonials from '@/components/dashboard/Testimonials'
import { Card, CardContent } from '@/components/ui/card'

export default async function DashboardPage() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/get-data`, {
    next: { tags: ['data'] }
  })

  const data: ResponseData = await response.json()
  if (!data?.data) {
    return <div>No data available</div>
  }

  return (
    <div className='grid gap-4'>
      <div id='logo'>
        <Card>
          <CardContent>
            <Logo data={data.data.logo} />
          </CardContent>
        </Card>
      </div>
      <div id='hero'>
        <Card>
          <CardContent>
            <Hero data={data.data.hero} />
          </CardContent>
        </Card>
      </div>
      <div id='services'>
        <Card>
          <CardContent>
            <Services data={data.data.services} />
          </CardContent>
        </Card>
      </div>
      <div id='about'>
        <Card>
          <CardContent>
            <About data={data.data.about} />
          </CardContent>
        </Card>
      </div>
      <div id='clients'>
        <Card>
          <CardContent>
            <Clients data={data.data.clients} />
          </CardContent>
        </Card>
      </div>
      <div id='testimonials'>
        <Card>
          <CardContent>
            <Testimonials data={data.data.testimonials} />
          </CardContent>
        </Card>
      </div>
      <div id='team'>
        <Card>
          <CardContent>
            <Team data={data.data.team} />
          </CardContent>
        </Card>
      </div>
      <div id='footer'>
        <Card>
          <CardContent>
            <p className='text-sm'>Footer content goes here...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
