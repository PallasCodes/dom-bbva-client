import { Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useValidateLoan } from '@/api/direct-debits.api'
import { getLoanInfo } from '@/api/individuals.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/store/auth.store'
import { formatDate, numberToCurrency } from '@/utils'

export default function LoanPage() {
  const { solDom } = useAuth()

  if (!solDom || !solDom.folioOrden) {
    return (
      <ErrorMessage
        title="Error al obtener la información de tu folio"
        description="Por favor ponte en contacto con nosotros"
      />
    )
  }
  const { folioOrden } = solDom

  const navigate = useNavigate()
  const { data: loan, error, isLoading } = getLoanInfo(folioOrden)
  const { loading, validateLoan } = useValidateLoan()

  const handleValidateData = async () => {
    try {
      await validateLoan(loan!.idSolicitudDom)
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
            <p className="font-bold">Folio</p>
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
          <p className="font-bold">Folio</p>
          <p>{loan?.folioInterno}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Fecha de firma</p>
          <p>{formatDate(loan?.fechaFirma as string | Date)}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Monto que solicitaste</p>
          <p>{numberToCurrency(loan?.prestamo as number)}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Total a pagar</p>
          <p>{numberToCurrency(loan?.totalPagar as number)}</p>
        </div>
        <div>
          <p className="font-bold">Saldo por pagar</p>
          <p>{numberToCurrency(loan?.porPagar as number)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 mt-0">
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
      </CardFooter>
    </Card>
  )
}
