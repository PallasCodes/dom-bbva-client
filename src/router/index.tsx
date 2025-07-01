import CUTValidationPage from '@/pages/CUTValidationPage'
import LoanPage from '@/pages/LoanPage'
import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: CUTValidationPage
  },
  {
    path: '/info-credito',
    Component: LoanPage
  },
  {
    path: '/cambiar-domicialiacion',
    Component: HomePage
  },
  {
    path: '*',
    element: (
      <div>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
      </div>
    )
  }
])
