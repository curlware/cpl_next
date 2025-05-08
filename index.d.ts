type TUser = {
  id?: string
  email?: string
  password?: string
}

// Base types
type MediaFile = {
  thumbnail?: string
  file?: string
  fileId?: string
}

// Nav item types
type NavChild = {
  title?: string
  link?: string
}

type NavItem = {
  title?: string
  link?: string
  children?: NavChild[]
}

// Navigation type
type Navigation = {
  logo?: MediaFile
  items?: NavItem[]
}

type SharedDataType = {
  favicon?: {
    thumbnail?: string
    file?: string
    fileId?: string
  }
  title?: string
  description?: string
  keywords?: string
  ctatext?: string
  ctalink?: string
  nav?: {
    logo?: {
      thumbnail?: string
      file?: string
      fileId?: string
    }
    items?: Array<{
      title?: string
      link?: string
      children?: Array<{
        title?: string
        link?: string
      }>
    }>
  }
  footer?: {
    copywrite?: string
    contactoffice?: Array<{ key?: string; value?: string }>
    contactfactory?: Array<{ key?: string; value?: string }>
    sociallinks?: Array<{
      icon?: string
      link?: string
    }>
  }
}

// Navigation specific type
type NavigationType = {
  logo?: MediaFile
  items?: NavItem[]
}

// Product type
type ProductType = {
  _id?: string
  title?: string
  description?: string
  images?: MediaFile[]
  attributes?: Array<{
    key?: string
    value?: string
  }>
  createdAt?: Date
  updatedAt?: Date
}

// HomePage sections types
type SliderType = {
  title?: string
  subtitle?: string
  images?: MediaFile[]
  background?: MediaFile
}

type AboutSectionType = {
  title?: string
  description?: string
}

type ProductsSectionType = {
  title?: string
  description?: string
  products?: string[] | ProductType[] // Can be array of IDs or populated Product objects
}

type StatType = {
  title?: string
  value?: string
}

type StatsType = {
  title?: string
  image?: MediaFile
  stats?: StatType[]
}

type TestimonialType = {
  name?: string
  designation?: string
  comment?: string
}

type VideoType = {
  thumbnail?: MediaFile
  link?: string
}

// Main HomePage type
type HomePageType = {
  _id?: string
  sliders?: SliderType[]
  about?: AboutSectionType
  products?: ProductsSectionType
  stats?: StatsType
  testimonials?: TestimonialType[]
  video?: VideoType
  createdAt?: Date
  updatedAt?: Date
}
