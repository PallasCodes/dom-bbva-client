import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  useGetCatalog,
  useGetDirectDebit,
  useSaveDirectDebit,
  useUploadSignature,
  useValidateClabe,
  type SaveDirectDebitRequest
} from '@/api/direct-debits.api'
import { getIndividualInfo } from '@/api/individuals.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useLoading } from '@/context/LoadingContext'
import { BankInfoForm } from '@/forms/BankInfoForm'
import { IndividualInfoForm, type IndividualFormData } from '@/forms/IndividualInfoForm'
import { useSocket } from '@/hooks/useSocket'
import { dataURLtoBlob } from '@/utils'
import { toast } from 'sonner'

export default function HomePage() {
  const location = useLocation()
  const { folioOrden, idOrden } = location.state ?? null

  if (!folioOrden) {
    return (
      <ErrorMessage
        title="Error al obtener la información de tu folio"
        description="Por favor ponte en contacto con nosotros"
      />
    )
  }

  // Hooks
  const socketRef = useSocket(import.meta.env.VITE_WS_URL)
  const { validateClabe } = useValidateClabe()
  const { hideLoader, isLoading } = useLoading()
  const { saveDirectDebit } = useSaveDirectDebit()
  const { uploadSignature } = useUploadSignature()
  const navigate = useNavigate()

  // State
  const [step, setStep] = useState(1)
  const [idSocketIo, setIdSocketIo] = useState('')
  const [apiPayload, setApiPayload] = useState<SaveDirectDebitRequest>()

  // Api calls
  const { data } = getIndividualInfo(folioOrden)
  const { data: directDebit } = useGetDirectDebit(idOrden)
  // TODO: fix typing

  // Methods
  const saveStep1 = async (formData: IndividualFormData) => {
    setApiPayload({
      ...formData,
      sexo: formData.sexo as 'M' | 'F',
      // @ts-ignore
      idSolicitudDomiciliacion: directDebit.idSolicitudDom as unknown as number,
      clabe: ''
    })
    setStep(2)
  }

  const saveStep2 = async ({
    clabe,
    signature
  }: {
    signature: string
    clabe: string
  }) => {
    const file = dataURLtoBlob(signature)

    const updatedPayload: SaveDirectDebitRequest = {
      ...apiPayload,
      clabe
    } as SaveDirectDebitRequest

    setApiPayload(updatedPayload)

    const formData = new FormData()
    formData.set('file', file)
    formData.set('idOrden', idOrden)

    await Promise.all([
      uploadSignature(formData),
      saveDirectDebit(updatedPayload),
      validateClabe({ clabe, rfc: apiPayload?.rfc as string, idSocketIo, idOrden })
    ])
  }

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    socket.on('connect', () => {
      setIdSocketIo(socket.id as string)
    })

    socket.on('clabe_verification_result', (data) => {
      console.log('🚀 ~ socket.on ~ data:', data)
      hideLoader()
      const msg = data.message as string
      data.valid ? toast.success(msg) : toast.error(msg)

      if (data.pdfUrl) {
        navigate('/proceso-finalizado', { state: { pdfUrl: data.pdfUrl } })
      }
    })

    return () => {
      socket.off('clabe_verification_result')
    }
  }, [socketRef])

  return (
    <Card className="max-w-2xl md:mx-auto m-4 ">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          {step === 1 && 'Información personal'}
          {step === 2 && 'Nueva cuenta bancaria'}
        </CardTitle>
        {step === 2 && (
          <CardDescription>
            Registra la CLABE bancaria de BBVA a la que se domiciliará tu pago
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <IndividualInfoForm
            formData={data as any}
            isLoading={isLoading}
            onSave={saveStep1}
          />
        )}

        {step === 2 && <BankInfoForm isLoading={isLoading} onSave={saveStep2} />}
      </CardContent>
    </Card>
  )
}
