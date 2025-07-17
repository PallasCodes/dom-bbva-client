import { createContext, useState, type PropsWithChildren } from 'react'

interface AuthState {
  loggedIn: boolean
  setLoggedIn: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <AuthContext.Provider value={(loggedIn, setLoggedIn)}>
      {children}
    </AuthContext.Provider>
  )
}
