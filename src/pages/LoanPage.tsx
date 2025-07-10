import { useLocation, useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'

import { getLoanInfo } from '@/api/individuals.api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { formatDate, numberToCurrency } from '@/utils'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoanPage() {
  const location = useLocation()
  const { folioOrden } = location.state

  if (!folioOrden) {
    return (
      <ErrorMessage
        title="Error al obtener la información de tu folio"
        description="Por favor ponte en contacto con nosotros"
      />
    )
  }

  const navigate = useNavigate()
  const { data: credit, error, isLoading } = getLoanInfo(folioOrden)

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
      <Card className="max-w-2xl md:mx-auto m-4 ">
        <CardHeader>
          <CardTitle className="text-center font-bold text-xl w-full">
            Datos de tu crédito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="font-bold">Folio</p>
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="mb-4">
            <p className="font-bold">Fecha de firma</p>
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="mb-4">
            <p className="font-bold">Monto que solicitaste</p>
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="mb-4">
            <p className="font-bold">Total a pagar</p>
            <Skeleton className="h-6 w-full" />
          </div>
          <div>
            <p className="font-bold">Saldo por pagar</p>
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>
    )

  return (
    <Card className="max-w-2xl md:mx-auto m-4 ">
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
          <p>
            <b>Folio</b>
          </p>
          <p>{credit?.folioInterno}</p>
        </div>
        <div className="mb-4">
          <p>
            <b>Fecha de firma</b>
          </p>
          <p>{formatDate(credit?.fechaFirma as string | Date)}</p>
        </div>
        <div className="mb-4">
          <p>
            <b>Monto que solicitaste</b>
          </p>
          <p>{numberToCurrency(credit?.prestamo as number)}</p>
        </div>
        <div className="mb-4">
          <p>
            <b>Total a pagar</b>
          </p>
          <p>{numberToCurrency(credit?.totalPagar as number)}</p>
        </div>
        <div>
          <p>
            <b>Saldo por pagar</b>
          </p>
          <p>{numberToCurrency(credit?.porPagar as number)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 mt-0">
        <Button
          className="grow text-red-600 bg-red-50 shadow-sm"
          onClick={() => navigate('/informacion-incorrecta')}
        >
          <X />
          Incorrecta
        </Button>
        <Button
          className="grow  text-green-600 bg-green-50 shadow-sm"
          onClick={() =>
            navigate('/cambiar-domicialiacion', {
              state: { folioOrden, idOrden: credit?.idOrden }
            })
          }
        >
          <Check />
          Correcta
        </Button>
      </CardFooter>
    </Card>
  )
}
