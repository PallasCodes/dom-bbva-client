import { ErrorMessage } from '@/components/ErrorMessage'
import { useAuth } from '@/store/auth.store'

export default function ProcessFinishedPage() {
  const { solDom } = useAuth()

  if (!solDom || !solDom.publicUrl) {
    return (
      <ErrorMessage
        title="Error al obtener el documento"
        description="Vuelve a abrir el enlace que se envío a tu celular."
      />
    )
  }

  return (
    <div className="text-center">
      <h2 className="font-bold antialiased text-xl mt-4 mb-2">Proceso finalizado</h2>
      <p>
        Visualiza tu documento de domiciliación dando&nbsp;
        <a href={solDom.publicUrl} target="_blank" className="font-medium text-blue-600">
          click aquí
        </a>
      </p>
    </div>
  )
}
