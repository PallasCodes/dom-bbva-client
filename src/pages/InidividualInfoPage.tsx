import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  useGetCatalog,
  useGetDirectDebit,
  useSaveDirectDebit,
  useUploadSignature,
  useValidateClabe,
  type SaveDirectDebitRequest
} from '@/api/direct-debits.api'
import { getIndividualInfo } from '@/api/individuals.api'
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
import { ErrorMessage } from '@/components/ErrorMessage'

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

  // State
  const [step, setStep] = useState(1)
  const [idSocketIo, setIdSocketIo] = useState('')
  const [apiPayload, setApiPayload] = useState<SaveDirectDebitRequest>()
  let idSolicitudDomiciliacion: number

  // Api calls
  const { data } = getIndividualInfo(folioOrden)
  const { data: nationalityCatalog, isLoading: nationalityCatIsLoading } =
    useGetCatalog(1032)
  const { data: maritalStatusCatalog, isLoading: maritalStatusCatIsLoading } =
    useGetCatalog(11, true)
  const { data: directDebit } = useGetDirectDebit(idOrden)
  // TODO: fix typing

  useEffect(() => {
    if (directDebit) {
      // @ts-ignore
      idSolicitudDomiciliacion = directDebit.idSolicitudDom
    }
  }, [directDebit])

  // Methods
  const saveStep1 = async (formData: IndividualFormData) => {
    setApiPayload({
      ...formData,
      sexo: formData.sexo as 'M' | 'F',
      idSolicitudDomiciliacion,
      clabe: '',
      urlFirma: ''
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
      clabe,
      urlFirma: signature.substring(0, 200)
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
      hideLoader()
      const msg = data.message as string
      data.valid ? toast.success(msg) : toast.error(msg)

      if (data.pdfUrl) {
        window.open(data.pdfUrl)
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
            isLoading={isLoading || maritalStatusCatIsLoading || nationalityCatIsLoading}
            onSave={saveStep1}
            nationalityCatalog={nationalityCatalog}
            maritalStatusCatalog={maritalStatusCatalog}
          />
        )}

        {step === 2 && <BankInfoForm isLoading={isLoading} onSave={saveStep2} />}
      </CardContent>
    </Card>
  )
}
