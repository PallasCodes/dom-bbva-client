import { Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useValidateLoan } from '@/api/direct-debits.api'
import { getLoanInfo } from '@/api/individuals.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { LoanCard } from '@/components/LoanCard'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/store/auth.store'

export default function LoanPage() {
  const { solDom } = useAuth()

  if (!solDom || !solDom.idPersonaFisica) {
    return (
      <ErrorMessage
        title="Error al obtener la información de tu folio"
        description="Por favor ponte en contacto con nosotros"
      />
    )
  }
  const { idPersonaFisica } = solDom

  const navigate = useNavigate()
  const { data: loans, error, isLoading } = getLoanInfo(idPersonaFisica)
  const { loading, validateLoans } = useValidateLoan()

  const handleValidateData = async () => {
    try {
      await validateLoans(idPersonaFisica)
      navigate('/validar-datos')
    } catch (e) {}
  }

  if (error === 404) {
    return (
      <ErrorMessage
        title="No se encontró la información de tu folio"
        description="Por favor ponte en contacto con nosotros"
      />
    )
  }

  if (isLoading)
    return (
      <Card className="max-w-md md:mx-auto m-4 ">
        <CardHeader>
          <CardTitle className="text-center font-bold text-xl w-full">
            Datos de tu crédito
          </CardTitle>
          <CardDescription className="text-center">
            Valida que la información sea correcta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="font-bold">💳 Folio</p>
            <Skeleton className="h-6 w-10/12" />
          </div>
          <div className="mb-4">
            <p className="font-bold">Fecha de firma</p>
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="mb-4">
            <p className="font-bold">Monto que solicitaste</p>
            <Skeleton className="h-6 w-8/12" />
          </div>
          <div className="mb-4">
            <p className="font-bold">Total a pagar</p>
            <Skeleton className="h-6 w-full" />
          </div>
          <div>
            <p className="font-bold">Saldo por pagar</p>
            <Skeleton className="h-6 w-9/12" />
          </div>
        </CardContent>
      </Card>
    )

  return (
    <>
      <div className="my-4 px-4">
        <h1 className="text-center font-bold antialiased text-lg">
          Revisa y confirma tus créditos activos
        </h1>
        <h3 className="text-center">
          Es importante validar esta información antes de continuar con la actulización de
          datos
        </h3>
      </div>

      <div className="mb-4">
        {loans && loans.map((loan) => <LoanCard loan={loan} key={loan.idOrden} />)}
      </div>

      <div className="flex gap-4 justify-center max-w-sm mx-auto mt-4 mb-6">
        <Button
          className="grow text-red-600 bg-red-50 shadow-sm hover:bg-red-100 transition-colors"
          onClick={() => navigate('/informacion-incorrecta')}
          disabled={loading}
        >
          <X />
          Incorrecta
        </Button>
        <Button
          className="grow text-green-600 bg-green-50 shadow-sm hover:bg-green-100 transition-colors"
          onClick={handleValidateData}
          disabled={loading}
        >
          <Check />
          Correcta
        </Button>
      </div>
    </>
  )
}
