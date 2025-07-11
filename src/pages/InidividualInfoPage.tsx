import { useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  useGetDirectDebit,
  useSaveDirectDebit,
  useUploadSignature,
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
import { useGeolocation } from '@/hooks/useGeolocation'
import { dataURLtoBlob } from '@/utils'

export default function HomePage() {
  const location = useLocation()

  if (!location.state || !location.state?.folioOrden || !location.state?.idOrden) {
    return (
      <ErrorMessage
        title="Error al obtener la información de tu folio"
        description="Por favor ponte en contacto con nosotros"
      />
    )
  }
  const { folioOrden, idOrden } = location.state ?? null

  // Hooks
  const { saveDirectDebit } = useSaveDirectDebit()
  const { uploadSignature } = useUploadSignature()
  const { isLoading } = useLoading()
  const navigate = useNavigate()
  const {
    latitude,
    longitude,
    permissionDenied: geolocationDenied,
    loading: geolocationIsLoading,
    error: geolocationError
  } = useGeolocation()

  // State
  const [step, setStep] = useState(1)
  const [apiPayload, setApiPayload] = useState<SaveDirectDebitRequest>()

  // Api calls
  const { data } = getIndividualInfo(folioOrden)
  const { data: directDebit } = useGetDirectDebit(idOrden)
  // TODO: fix types

  // Methods
  const saveStep1 = async (formData: IndividualFormData) => {
    console.log({ latitude, longitude })
    setApiPayload({
      ...formData,
      sexo: formData.sexo as 'M' | 'F',
      // @ts-ignore
      idSolicitudDomiciliacion: directDebit.idSolicitudDom as unknown as number,
      clabe: ''
    })
    setStep(2)
  }

  useLayoutEffect(() => {
    alert(
      'Es necesario que permitas acceder a tu ubicación para firmar electrónicamente el documento'
    )
  }, [])

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
    formData.set('latitude', String(latitude))
    formData.set('longitude', String(longitude))

    try {
      await saveDirectDebit(updatedPayload)
      const { pdfUrl } = await uploadSignature(formData)
      navigate('/proceso-finalizado', { state: { pdfUrl } })
    } catch (err) {
      console.error(err)
    }
  }

  if (geolocationError || geolocationDenied) {
    return (
      <ErrorMessage
        title="No se pudo obtener tu ubicación"
        description="Es necesario acceder a tu ubicación para firmar el documento. "
      >
        <p className="my-2">
          Ve a 🔧 Ajustes → Privacidad → Ubicación → y permite el acceso para este sitio.
        </p>
        <iframe
          width="100%"
          src="https://www.youtube.com/embed/oasvnEOsx4E?si=OlS5NMhzzBBl0Acr"
          title="YouTube video player"
          frame-border="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrer-policy="strict-origin-when-cross-origin"
          allow-fullscreen
        />
      </ErrorMessage>
    )
  }

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

        {step === 2 && (
          <BankInfoForm
            isLoading={isLoading || geolocationIsLoading}
            onSave={saveStep2}
            idOrden={idOrden}
            rfc={apiPayload?.rfc ?? ''}
          />
        )}
      </CardContent>
    </Card>
  )
}
