import { useGetCatalog } from '@/api/direct-debits.api'
import {
  useSendCutSms,
  useValidateCut,
  type ValidateCutPayload
} from '@/api/individuals.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { CUTValidationForm, type CUTValidationFormData } from '@/forms/CUTValidationForm'
import { useValidateDirectDebit } from '@/hooks/useValidateDirectDebit'
import { Loader2 } from 'lucide-react'

import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

export default function CUTValidationPage() {
  const [params] = useSearchParams()
  const cliente = params.get('cliente')

  if (!cliente || isNaN(+cliente)) {
    return (
      <ErrorMessage
        title="URL mal formada"
        description="No se encontró tu folio en la URL, vuelve a abrir el enlace que se envío a tu celular"
      />
    )
  }

  const { validateDirectDebit } = useValidateDirectDebit()
  const { data: stateCatalog, isLoading: catalogIsLoading } = useGetCatalog(1003)
  const { validateCut, isLoading: cutIsLoading } = useValidateCut()
  const { sendCutSms, isLoading: cutSmsIsLoading } = useSendCutSms()

  const handleForm = async (payload: CUTValidationFormData) => {
    const { codigo, anioNacimiento, mesNacimiento, diaNacimiento, idEstadoNacimiento } =
      payload

    const apiPayload: ValidateCutPayload = {
      codigo,
      idPersonaFisica: +cliente,
      idEstadoNacimiento,
      fechaNacimiento: `${anioNacimiento}-${mesNacimiento}-${diaNacimiento}`
    }
    try {
      const { solDom } = await validateCut(apiPayload)
      validateDirectDebit(solDom)
    } catch (error) {
      console.error(error)
    }
  }

  const resendCutSms = async () => {
    try {
      await sendCutSms(+cliente)
      toast.success('Se ha enviado un SMS con tu código CUT')
    } catch (err) {}
  }

  return (
    <Card className="max-w-md md:mx-auto m-4">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          Autentícate
        </CardTitle>
        <CardDescription>
          Tus datos están protegidos y se usarán únicamente para la actualización de tus
          datos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CUTValidationForm
          isLoading={catalogIsLoading || cutIsLoading}
          onSave={handleForm}
          stateCatalog={stateCatalog}
        />
        <div className="text-center mt-2 text-sm">
          ¿No recibiste el código?&nbsp;
          {cutSmsIsLoading ? (
            <Button type="button" variant="link" size="sm" disabled>
              Enviando SMS
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
            <Button type="button" variant="link" size="sm" onClick={resendCutSms}>
              Reenviar SMS
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
