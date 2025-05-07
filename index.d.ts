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

// Shared data type
type SharedDataType = {
  favicon?: MediaFile
  title?: string
  description?: string
  keywords?: string
  ctatext?: string
  ctalink?: string
  nav?: Navigation
  createdAt?: Date
  updatedAt?: Date
}

// Navigation specific type
type NavigationType = {
  logo?: MediaFile
  items?: NavItem[]
}
