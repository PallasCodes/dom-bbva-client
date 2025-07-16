import { Layout } from '@/Layout'
import { ErrorMessage } from '@/components/ErrorMessage'
import CUTValidationPage from '@/pages/CUTValidationPage'
import DirectDebitPdfPage from '@/pages/DirectDebitPdfPage'
import LoanPage from '@/pages/LoanPage'
import ProcessFinishedPage from '@/pages/ProcessFinishedPage'
import { createBrowserRouter } from 'react-router-dom'
import IndividualInfoPage from '../pages/IndividualInfoPage'
import ValidateClabePage from '../pages/ValidateClabePage'

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
        element: <IndividualInfoPage />
      },
      {
        path: '/validar-clabe',
        element: <ValidateClabePage />
      },
      {
        path: '/firmar-documento',
        element: <DirectDebitPdfPage />
      },
      {
        path: '/proceso-finalizado',
        element: <ProcessFinishedPage />
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
