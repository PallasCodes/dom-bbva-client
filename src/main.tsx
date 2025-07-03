import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { LoadingProvider } from './context/LoadingContext'
import './index.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <LoadingProvider>
    <RouterProvider router={router} />
  </LoadingProvider>
)
