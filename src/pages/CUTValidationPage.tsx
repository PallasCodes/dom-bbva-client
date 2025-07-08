import { useGetCatalog } from '@/api/direct-debits.api'
import { useValidateCut, type ValidateCutPayload } from '@/api/individuals.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CUTValidationForm, type CUTValidationFormData } from '@/forms/CUTValidationForm'

import { useNavigate, useSearchParams } from 'react-router-dom'

export default function CUTValidationPage() {
  const [params] = useSearchParams()
  const folioOrden = params.get('folio')

  if (!folioOrden) {
    return (
      <ErrorMessage
        title="Error al obtener la información de tu folio"
        description="Por favor ponte en contacto con nosotros"
      />
    )
  }

  const navigate = useNavigate()

  const { data: stateCatalog, isLoading: catalogIsLoading } = useGetCatalog(1003)
  const { validateCut } = useValidateCut()

  const handleForm = async (payload: CUTValidationFormData) => {
    const apiPayload: ValidateCutPayload = {
      codigo: payload.codigo,
      fechaNacimiento: `${payload.anioNacimiento}-${payload.mesNacimiento}-${payload.diaNacimiento}`,
      folioOrden,
      idEstadoNacimiento: payload.idEstadoNacimiento
    }
    try {
      await validateCut(apiPayload)
      navigate('/info-credito', { state: { folioOrden } })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card className="max-w-2xl md:mx-auto m-4">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          Autentícate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CUTValidationForm
          catalogIsLoading={catalogIsLoading}
          onSave={handleForm}
          stateCatalog={stateCatalog}
        />
      </CardContent>
    </Card>
  )
}
