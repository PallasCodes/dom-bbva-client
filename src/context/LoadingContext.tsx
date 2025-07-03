import { createContext, useContext, useState, type ReactNode } from 'react'

type LoadingContextType = {
  isLoading: boolean
  title: string | undefined
  description: string | undefined
  showLoader: (title?: string, description?: string) => void
  hideLoader: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const showLoader = (title?: string, description?: string) => {
    setIsLoading(true)
    setTitle(title)
    setDescription(description)
  }

  const hideLoader = () => {
    setIsLoading(false)
    setTitle(undefined)
    setDescription(undefined)
  }

  return (
    <LoadingContext.Provider
      value={{ isLoading, showLoader, hideLoader, title, description }}
    >
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
