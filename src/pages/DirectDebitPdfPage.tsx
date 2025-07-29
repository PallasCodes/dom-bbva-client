import { useSignDirectDebit } from '@/api/direct-debits.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { SignDocForm } from '@/forms/SingDocForm'
import { useAuth } from '@/store/auth.store'
import { useNavigate } from 'react-router-dom'

export default function DirectDebitPdfPage() {
  const { solDom, setSolDom } = useAuth()
  const { signDirectDebit, loading } = useSignDirectDebit()
  const navigate = useNavigate()

  if (!solDom || !solDom.publicUrls || !solDom.idSolicitudDom) {
    return (
      <ErrorMessage
        title="Error al generar el documento"
        description="Ponte en contacto con nosotros."
      />
    )
  }

  const onSubmit = async () => {
    try {
      const { pdfUrls } = await signDirectDebit(solDom.idPersonaFisica)
      setSolDom({ ...solDom, publicUrls: pdfUrls })
      navigate('/proceso-finalizado')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card className="max-w-md md:mx-auto m-4 gap-2">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          Confirma tu autorización
        </CardTitle>
        <CardDescription className="mb-2 text-center">
          Firma electrónicamente para concluir tu actualización.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        {solDom.publicUrls.map((publicUrl) => (
          <div
            style={{ width: '100%', aspectRatio: '7.9 / 11' }}
            className="max-w-4xl mb-6"
            key={publicUrl}
          >
            <iframe
              src={`https://docs.google.com/gview?embedded=true&url=${publicUrl}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        ))}
        <p className="mb-4 text-sm text-gray-600">
          Con esta firma confirmas tu actualización de cuenta BBVA para que tus pagos
          continúen sin contratiempos.
        </p>
        <SignDocForm onSave={onSubmit} loading={loading} />
      </CardContent>
    </Card>
  )
}
