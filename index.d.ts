type TUser = {
  id: string
  email: string
}

// Base types
type MediaFile = {
  thumbnail?: string
  file?: string
  fileId?: string
}

type SocialLink = {
  icon?: string
  link?: string
}

// Section types
type Logo = MediaFile

type HeroSection = {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: MediaFile
}

type ServiceItem = {
  icon?: MediaFile
  title?: string
  description?: string
  link?: string
}

type ServicesSection = {
  title?: string
  subtitle?: string
  items?: ServiceItem[]
}

type PortfolioItem = {
  title?: string
  subTitle?: string
  category?: string
  image?: MediaFile
  link?: string
}

type PortfolioSection = {
  title?: string
  categories?: string[]
  items?: PortfolioItem[]
}

type AboutSection = {
  title?: string
  subtitle?: string
  heading?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  media?: MediaFile
}

type SkillItem = {
  title?: string
  percentage?: number
}

type ClientsSection = {
  title?: string
  // stats?: {
  //   count?: number
  //   label?: string
  // }
  logos?: {
    // brand logos
    image?: MediaFile
    link?: string
  }[]
}

type TestimonialItem = {
  name?: string
  role?: string
  image?: MediaFile
  message?: string
}

type TeamMember = {
  name?: string
  role?: string
  image?: MediaFile
  bio?: string
  socialLinks?: SocialLink[]
}

type TeamSection = {
  title?: string
  subtitle?: string
  rightText?: string
  leftText?: string
  members?: TeamMember[]
}

type PricingPlan = {
  name?: string
  price?: number
  period?: string
  features?: string[]
  ctaText?: string
  ctaLink?: string
}

type PricingSection = {
  title?: string
  subtitle?: string
  plans?: PricingPlan[]
}

type ContactSection = {
  title?: string
  subtitle?: string
  heading?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  mapLocation?: {
    lat?: number
    lng?: number
  }
}

type FooterSection = {
  copyright?: string
  socialLinks?: SocialLink[]
}

// Main content type
type SiteContentData = {
  logo?: Logo
  hero?: HeroSection
  services?: ServicesSection
  portfolio?: PortfolioSection
  about?: AboutSection
  skills?: SkillItem[]
  clients?: ClientsSection
  testimonials?: TestimonialItem[]
  team?: TeamSection
  pricing?: PricingSection
  contact?: ContactSection
  footer?: FooterSection
}

// Complete site content type
type SiteContent = {
  _id?: string
  content: SiteContentData
  createdAt?: string | Date
  updatedAt?: string | Date
}

type ResponseData = {
  success: boolean
  data?: SiteContentData | null
  error?: string
}

type UserInput = {
  email: string
  password: string
}
