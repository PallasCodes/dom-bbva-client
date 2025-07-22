import { formatDate, numberToCurrency } from '@/utils'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface Props {
  loan: {
    folioInterno: string
    fechaFirma: Date
    prestamo: number
    totalPagar: number
    porPagar: number
  }
}

export const LoanCard = ({ loan }: Props) => {
  return (
    <Card className="max-w-md md:mx-auto m-4 gap-1">
      <CardHeader>
        <CardTitle className="font-bold text-lg w-full">
          Folio: {loan?.folioInterno}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
    </Card>
  )
}
