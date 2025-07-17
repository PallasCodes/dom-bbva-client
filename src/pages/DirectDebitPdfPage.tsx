import { useSignDirectDebit } from '@/api/direct-debits.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SignDocForm } from '@/forms/SingDocForm'
import { useLocation, useNavigate } from 'react-router-dom'

export default function DirectDebitPdfPage() {
  const { state } = useLocation()
  const { signDirectDebit, loading } = useSignDirectDebit()
  const navigate = useNavigate()

  if (!state || !state.pdfUrl || !state.idOrden || !state.idSolicitudDom) {
    return (
      <ErrorMessage
        title="Error al generar el documento"
        description="Ponte en contacto con nosotros."
      />
    )
  }

  const onSubmit = async () => {
    try {
      await signDirectDebit(state.idOrden, state.idSolicitudDom)
      navigate('/proceso-finalizado')
    } catch (error) {}
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
        <SignDocForm onSave={onSubmit} loading={loading} />
      </CardContent>
    </Card>
  )
}
