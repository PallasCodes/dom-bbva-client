import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { LoadingProvider } from './context/LoadingContext'
import './index.css'
import { router } from './router'
import { z } from 'zod'
import { errorMapEs } from './zod/zod-es'

z.setErrorMap(errorMapEs)

createRoot(document.getElementById('root')!).render(
  <LoadingProvider>
    <RouterProvider router={router} />
    <Toaster visibleToasts={3} position="top-right" richColors duration={3500} />
  </LoadingProvider>
)
