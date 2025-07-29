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
    <div className="text-center max-w-5xl flex justify-center flex-col items-center mx-auto px-4">
      <h2 className="font-bold antialiased text-xl mt-4 mb-2">
        Proceso de actualización de datos completado
      </h2>
      <p>
        Visualiza tus documentos de domiciliación actualizados&nbsp;
        <button className="font-medium text-blue-600" onClick={openPdfs}>
          click aquí
        </button>
      </p>

      <img
        src="./cobranza_nintendo.png"
        alt="Promoción Nintendo Switch"
        className="w-full h-auto mt-8"
      />

      <p className="mt-6">
        🔒 Tu información ha sido actualizada de manera segura y protegida por
        Intermercado.
      </p>
    </div>
  )
}
