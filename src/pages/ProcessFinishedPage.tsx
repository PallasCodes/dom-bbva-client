import { ErrorMessage } from '@/components/ErrorMessage'
import { useAuth } from '@/store/auth.store'

export default function ProcessFinishedPage() {
  const { solDom } = useAuth()

  if (!solDom || !solDom.publicUrls) {
    return (
      <ErrorMessage
        title="Error al obtener el documento"
        description="Vuelve a abrir el enlace que se envío a tu celular."
      />
    )
  }

  const openPdfs = () => {
    solDom.publicUrls.forEach((url) => {
      window.open(url)
    })
  }

  return (
    <div className="text-center">
      <h2 className="font-bold antialiased text-xl mt-4 mb-2">Proceso finalizado</h2>
      <p>
        Visualiza tus documentos de domiciliación dando&nbsp;
        <button className="font-medium text-blue-600" onClick={openPdfs}>
          click aquí
        </button>
      </p>
    </div>
  )
}
