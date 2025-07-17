import { Layout } from '@/Layout'
import { ErrorMessage } from '@/components/ErrorMessage'
import CUTValidationPage from '@/pages/CUTValidationPage'
import DirectDebitPdfPage from '@/pages/DirectDebitPdfPage'
import LoanPage from '@/pages/LoanPage'
import ProcessFinishedPage from '@/pages/ProcessFinishedPage'
import { createBrowserRouter } from 'react-router-dom'
import IndividualInfoPage from '../pages/IndividualInfoPage'
import ValidateClabePage from '../pages/ValidateClabePage'
import { ProtectedRoute } from './ProtectedRoute'

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
        path: '/validar-datos',
        element: (
          <ProtectedRoute>
            <IndividualInfoPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/validar-clabe',
        element: (
          <ProtectedRoute>
            <ValidateClabePage />
          </ProtectedRoute>
        )
      },
      {
        path: '/firmar-documento',
        element: (
          <ProtectedRoute>
            <DirectDebitPdfPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/proceso-finalizado',
        element: (
          <ProtectedRoute>
            <ProcessFinishedPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/informacion-incorrecta',
        element: (
          <ProtectedRoute>
            <ErrorMessage
              title="Información incorrecta"
              description="Ponte en contacto con nosotros para actualizar tu información"
            />
          </ProtectedRoute>
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
