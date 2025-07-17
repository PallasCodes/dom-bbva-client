import { type SolicitudDom } from '@/types/solicitud-dom.interface'
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction
} from 'react'

interface AuthState {
  loggedIn: boolean
  setLoggedIn: Dispatch<SetStateAction<boolean>>
  solDom: SolicitudDom | undefined
  setSolDom: Dispatch<SetStateAction<SolicitudDom | undefined>>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [solDom, setSolDom] = useState<SolicitudDom | undefined>(undefined)

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, solDom, setSolDom }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw Error('useAuth must be used inside AuthProvider')
  return context
}
