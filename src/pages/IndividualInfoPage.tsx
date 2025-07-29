import { useSaveDirectDebit } from '@/api/direct-debits.api'
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
import { useAuth } from '@/store/auth.store'
import { useNavigate } from 'react-router-dom'

export default function IndividualInfoPage() {
  const { solDom } = useAuth()

  if (!solDom || !solDom.idPersonaFisica) {
    return (
      <ErrorMessage
        title="Error al obtener la información de tu folio"
        description="Por favor ponte en contacto con nosotros"
      />
    )
  }
  const { idPersonaFisica } = solDom
  // const { data: directDebit } = useGetDirectDebit(idPersonaFisica)
  const { data } = getIndividualInfo(idPersonaFisica)
  const { saveDirectDebit } = useSaveDirectDebit()
  const navigate = useNavigate()

  const saveStep1 = async (formData: IndividualFormData) => {
    try {
      await saveDirectDebit({
        ...formData,
        // @ts-ignore
        idSolicitudDomiciliacion: solDom.idSolicitudDom
      })
      navigate('/validar-clabe')
    } catch (err) {}
  }

  return (
    <Card className="max-w-md md:mx-auto m-4 ">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          👤 Información personal
        </CardTitle>
        <CardDescription>
          Verifica tus datos. Queremos asegurarnos de que tu información esté correcta y
          actualizada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <IndividualInfoForm formData={data as any} isLoading={false} onSave={saveStep1} />
        <p className="mt-4 text-sm text-gray-600">
          🔒 Tus datos están protegidos conforme a la Ley Federal de Protección de Datos
          Personales.&nbsp;
          <a
            href="https://intermercado.mx/aviso-de-privacidad/"
            target="_blank"
            className="text-blue-500 font-medium"
          >
            Link de aviso de privacidad
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
