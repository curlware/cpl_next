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
