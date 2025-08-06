import { useSendCutSms } from '@/api/individuals.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2 } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function IntroductionPage() {
  const [params] = useSearchParams()
  const cliente = params.get('cliente')

  if (!cliente || isNaN(+cliente)) {
    return (
      <ErrorMessage
        title="URL mal formada"
        description="No se encontró tu folio en la URL, vuelve a abrir el enlace que se envío a tu celular"
      />
    )
  }

  const navigate = useNavigate()
  const { sendCutSms, isLoading: cutSmsIsLoading } = useSendCutSms()

  const startProcess = async () => {
    try {
      await sendCutSms(+cliente)
      navigate(`/validacion-cut?cliente=${cliente}`)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-center font-bold text-2xl mb-1">
        Actualiza tus datos en 4 pasos sencillos
      </h1>
      <h3 className="text-center text-md mb-8">
        Este proceso es rápido, seguro y solo te tomará unos minutos.
      </h3>

      <div className="flex gap-4 mb-8">
        <span className="text-2xl font-bold bg-orange-500 text-white min-w-9 min-h-9 max-h-9 max-w-9 rounded flex items-center justify-center shrink">
          1
        </span>
        <div>
          <h4 className="font-bold text-lg mb-1">👤 Confirma tu identidad</h4>
          <p>
            Ingresa tus datos personales y un código de seguridad que recibirás por SMS.
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <span className="text-2xl font-bold bg-orange-500 text-white min-w-9 min-h-9 max-h-9 max-w-9 rounded flex items-center justify-center shrink">
          2
        </span>
        <div>
          <h4 className="font-bold text-lg mb-1">📑 Revisa tus créditos</h4>
          <p>Consulta tus créditos activos y confirma que la información sea correcta.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <span className="text-2xl font-bold bg-orange-500 text-white min-w-9 min-h-9 max-h-9 max-w-9 rounded flex items-center justify-center shrink">
          3
        </span>
        <div>
          <h4 className="font-bold text-lg mb-1">📝 Valida tus datos personales</h4>
          <p>Asegúrate de que tu nombre, CURP y RFC estén correctos y actualizados.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <span className="text-2xl font-bold bg-orange-500 text-white min-w-9 min-h-9 max-h-9 max-w-9 rounded flex items-center justify-center shrink">
          4
        </span>
        <div>
          <h4 className="font-bold text-lg mb-1">
            💳 Registra tu nueva cuenta BBVA y firma
          </h4>
          <p>
            Ingresa tu CLABE BBVA y firma electrónicamente para concluir tu actualización.
          </p>
        </div>
      </div>

      <p className="font-medium text-md mt-6">
        Al finalizar, tu actualización quedará registrada y automáticamente participarás
        en el sorteo de dos Nintendo Switch 2
      </p>

      {cutSmsIsLoading ? (
        <Button className="mt-8 w-full" disabled>
          Enviando SMS
          <Loader2 className="animate-spin" />
        </Button>
      ) : (
        <Button className="mt-8 w-full" onClick={startProcess}>
          Iniciar actualización de datos
          <ChevronRight />
        </Button>
      )}
    </div>
  )
}
