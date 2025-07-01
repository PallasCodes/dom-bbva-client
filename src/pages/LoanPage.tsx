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
import { useSearchParams } from 'react-router-dom'

export default function LoanPage() {
  const [params] = useSearchParams()
  const folioOrden = params.get('folio')

  if (!folioOrden) {
    return <h1>Error</h1>
  }

  const { data: credit } = getLoanInfo(folioOrden)

  return (
    <Card className="max-w-2xl md:mx-auto m-4 max-h-[95vh] overflow-y-auto">
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
          <p>{credit?.fechaFirma.toLocaleString()}</p>
        </div>
        <div className="mb-4">
          <p>
            <b>Prestamo</b>
          </p>
          <p>{credit?.prestamo}</p>
        </div>
        <div className="mb-4">
          <p>
            <b>Total a pagar</b>
          </p>
          <p>{credit?.totalPagar}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 mt-0">
        <Button className="grow bg-red-700">Incorrecta</Button>
        <Button className="grow bg-green-700">Correcta</Button>
      </CardFooter>
    </Card>
  )
}
