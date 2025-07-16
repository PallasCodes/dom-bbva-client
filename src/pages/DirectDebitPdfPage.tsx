import { useSignDirectDebit } from '@/api/direct-debits.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { SignDocForm } from '@/forms/SingDocForm'
import { Check, Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function DirectDebitPdfPage() {
  const { state } = useLocation()
  const { signDirectDebit, loading } = useSignDirectDebit()
  const navigate = useNavigate()

  const [acceptTerms, setAcceptTerms] = useState<'false' | 'true'>('false')
  const [formError, setFormError] = useState<string | undefined>(undefined)

  if (!state || !state.pdfUrl || !state.idOrden || !state.idSolicitudDom) {
    return (
      <ErrorMessage
        title="Error al generar el documento"
        description="Ponte en contacto con nosotros."
      />
    )
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (acceptTerms === 'true') {
      setFormError(undefined)
      try {
        await signDirectDebit(state.idOrden, state.idSolicitudDom)
        navigate('/proceso-finalizado')
      } catch (error) {}
    } else {
      setFormError(
        'Para finalizar el proceso de domiciliación debes aceptar firmar electrónicamente'
      )
    }
  }

  const toggleCheckbox = () => {
    setAcceptTerms((prev) => (prev === 'true' ? 'false' : 'true'))

    if (acceptTerms !== 'true') {
      setFormError(undefined)
    } else {
      setFormError(
        'Para finalizar el proceso de domiciliación debes aceptar firmar electrónicamente'
      )
    }
  }

  return (
    <Card className="max-w-md md:mx-auto m-4 gap-2">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          Firma de documento
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div
          style={{ width: '100%', aspectRatio: '7.9 / 11' }}
          className="max-w-4xl mb-6"
        >
          <iframe
            src={`https://docs.google.com/gview?embedded=true&url=${state.pdfUrl}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
        {/* <form onSubmit={onSubmit}>
          <div className="flex gap-2 mt-6">
            <Checkbox
              id="acceptTerms"
              value={acceptTerms ? 'true' : 'false'}
              onCheckedChange={() => toggleCheckbox()}
            />
            <Label htmlFor="acceptTerms">
              Acepto firmar electrónicamente el presente documento de domiciliación
              emitido por Intermercado.
            </Label>
          </div>
          {formError && (
            <p className="text-sm text-red-500 mt-2 font-medium">{formError}</p>
          )}

          {loading ? (
            <Button className="w-full mt-6" disabled>
              Cargando...
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
            <Button className="w-full mt-6" type="submit">
              Firmar electrónicamente
              <Check />
            </Button>
          )}
        </form> */}
        <SignDocForm />
      </CardContent>
    </Card>
  )
}
