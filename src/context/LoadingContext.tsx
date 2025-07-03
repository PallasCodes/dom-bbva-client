import { createContext, useContext, useState, type ReactNode } from 'react'

type LoadingContextType = {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading debe usarse dentro de un <LoadingProvider>')
  }
  return context
}
