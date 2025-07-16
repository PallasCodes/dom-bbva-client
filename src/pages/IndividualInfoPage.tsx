import { useGetDirectDebit, useSaveDirectDebit } from '@/api/direct-debits.api'
import { getIndividualInfo } from '@/api/individuals.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { IndividualInfoForm, type IndividualFormData } from '@/forms/IndividualInfoForm'
import { useLocation, useNavigate } from 'react-router-dom'

export default function IndividualInfoPage() {
  const location = useLocation()

  if (!location.state || !location.state?.folioOrden || !location.state?.idOrden) {
    return (
      <ErrorMessage
        title="Error al obtener la información de tu folio"
        description="Por favor ponte en contacto con nosotros"
      />
    )
  }
  const { folioOrden, idOrden } = location.state ?? null
  const { data: directDebit } = useGetDirectDebit(idOrden)
  const { data } = getIndividualInfo(folioOrden)
  const { saveDirectDebit } = useSaveDirectDebit()
  const navigate = useNavigate()

  const saveStep1 = async (formData: IndividualFormData) => {
    try {
      await saveDirectDebit({
        ...formData,
        // @ts-ignore
        idSolicitudDomiciliacion: directDebit.idSolicitudDom as unknown as number
      })
      navigate('/validar-clabe', {
        state: {
          idOrden,
          rfc: formData.rfc,
          // @ts-ignore
          idSolicitudDom: directDebit!.idSolicitudDom
        }
      })
    } catch (err) {}
  }

  return (
    <Card className="max-w-md md:mx-auto m-4 ">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          Información personal
        </CardTitle>
        <CardDescription>Verifica que tus datos sean correctos</CardDescription>
      </CardHeader>
      <CardContent>
        <IndividualInfoForm formData={data as any} isLoading={false} onSave={saveStep1} />
      </CardContent>
    </Card>
  )
}
