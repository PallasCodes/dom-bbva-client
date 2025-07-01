import { useGetCatalog } from '@/api/direct-debits.api'
import { useValidateCut, type ValidateCutPayload } from '@/api/individuals.api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CUTValidationForm, type CUTValidationFormData } from '@/forms/CUTValidationForm'

import { useNavigate, useSearchParams } from 'react-router-dom'

export default function CUTValidationPage() {
  const [params] = useSearchParams()
  const folioOrden = params.get('folio')

  if (!folioOrden) {
    return <h1>Error</h1>
  }

  const navigate = useNavigate()

  const { data: stateCatalog } = useGetCatalog(1003)
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
      navigate(`/loan-credito?folio=${folioOrden}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card className="max-w-2xl md:mx-auto m-4 max-h-[95vh] overflow-y-auto">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          Autenticate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CUTValidationForm
          isLoading={false}
          onSave={handleForm}
          stateCatalog={stateCatalog}
        />
      </CardContent>
    </Card>
  )
}
