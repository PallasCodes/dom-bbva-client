import CUTValidationPage from '@/pages/CUTValidationPage'
import LoanPage from '@/pages/LoanPage'
import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/InidividualInfoPage'
import { Layout } from '@/Layout'
import { ErrorMessage } from '@/components/ErrorMessage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CUTValidationPage />
      },
      {
        path: '/info-credito',
        element: <LoanPage />
      },
      {
        path: '/cambiar-domicialiacion',
        element: <HomePage />
      },
      {
        path: '/informacion-incorrecta',
        element: (
          <ErrorMessage
            title="Información incorrecta"
            description="Ponte en contacto con nosotros para actualizar tu información"
          />
        )
      }
    ]
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
