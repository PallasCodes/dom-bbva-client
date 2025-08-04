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

  const openPdf = (url: string) => {
    window.open(url)
  }

  return (
    <div className="text-center max-w-5xl flex justify-center flex-col items-center mx-auto px-4">
      <h2 className="font-bold antialiased text-xl mt-4 mb-2">
        Proceso de actualización de datos completado
      </h2>
      <p>Visualiza tus documentos de domiciliación actualizados&nbsp;</p>

      <div className="flex flex-col justify-center">
        {solDom.publicUrls.map((url, i) => (
          <button
            className="font-medium text-blue-600"
            onClick={() => openPdf(url)}
            key={url}
          >
            Página {i + 1}
          </button>
        ))}
      </div>

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
