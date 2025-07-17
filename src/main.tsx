import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { z } from 'zod'

import { LoadingProvider } from './context/LoadingContext'
import './index.css'
import { router } from './router'
import { errorMapEs } from './zod/zod-es'
import { AuthProvider } from './store/auth.store'

z.setErrorMap(errorMapEs)

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <LoadingProvider>
      <RouterProvider router={router} />
      <Toaster visibleToasts={3} position="top-right" richColors duration={3500} />
    </LoadingProvider>
  </AuthProvider>
)
