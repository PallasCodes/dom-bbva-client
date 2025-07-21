import { useGetCatalog } from '@/api/direct-debits.api'
import { useValidateCut, type ValidateCutPayload } from '@/api/individuals.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CUTValidationForm, type CUTValidationFormData } from '@/forms/CUTValidationForm'
import { useValidateDirectDebit } from '@/hooks/useValidateDirectDebit'

import { useSearchParams } from 'react-router-dom'

export default function CUTValidationPage() {
  const [params] = useSearchParams()
  const folioOrden = params.get('folio')

  if (!folioOrden) {
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

  const handleForm = async (payload: CUTValidationFormData) => {
    const { codigo, anioNacimiento, mesNacimiento, diaNacimiento, idEstadoNacimiento } =
      payload

    const apiPayload: ValidateCutPayload = {
      codigo,
      folioOrden,
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

  return (
    <Card className="max-w-md md:mx-auto m-4">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          Autentícate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CUTValidationForm
          isLoading={catalogIsLoading || cutIsLoading}
          onSave={handleForm}
          stateCatalog={stateCatalog}
        />
      </CardContent>
    </Card>
  )
}
