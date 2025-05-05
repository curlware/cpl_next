'use client'

import { createContext, ReactNode, use, useContext, useEffect, useState } from 'react'

type UserContextType = {
  user: TUser | null
  // eslint-disable-next-line no-unused-vars
  setUser: (user: TUser | null) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function useUser(): UserContextType {
  const context = useContext(UserContext)
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function UserProvider({
  children,
  userPromise
}: {
  children: ReactNode
  userPromise: Promise<TUser | null>
}) {
  const initialUser = use(userPromise)
  const [user, setUser] = useState<TUser | null>(initialUser)

  useEffect(() => {
    setUser(initialUser)
  }, [initialUser])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}
