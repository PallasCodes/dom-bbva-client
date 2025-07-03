import { useLocation, useNavigate } from 'react-router-dom'

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
import { Check, X } from 'lucide-react'
import { formatDate, numberToCurrency } from '@/utils'

export default function LoanPage() {
  const location = useLocation()
  const { folioOrden } = location.state

  if (!folioOrden) {
    return <h1>Error</h1>
  }

  const navigate = useNavigate()
  const { data: credit } = getLoanInfo(folioOrden)

  return (
    <Card className="max-w-2xl md:mx-auto m-4 ">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          Datos de tu crédito
        </CardTitle>
        <CardDescription className="text-center">
          Válida que la información sea correcta
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
        <div>
          <p>
            <b>Total a pagar</b>
          </p>
          <p>{numberToCurrency(credit?.totalPagar as number)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 mt-0">
        <Button className="grow text-red-600 bg-red-50 shadow-sm">
          <X />
          Incorrecta
        </Button>
        <Button
          className="grow  text-green-600 bg-green-50 shadow-sm"
          onClick={() => navigate('/cambiar-domicialiacion', { state: { folioOrden } })}
        >
          <Check />
          Correcta
        </Button>
      </CardFooter>
    </Card>
  )
}
