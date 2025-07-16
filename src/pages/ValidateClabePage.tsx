import { useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useUploadSignature } from '@/api/direct-debits.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { BankInfoForm } from '@/forms/BankInfoForm'
import { useGeolocation } from '@/hooks/useGeolocation'
import { dataURLtoBlob } from '@/utils'

export default function ValidateClabePage() {
  const location = useLocation()

  if (
    !location.state ||
    !location.state?.idOrden ||
    !location.state?.rfc ||
    !location.state?.idSolicitudDom
  ) {
    return (
      <ErrorMessage
        title="Error al obtener la información de tu folio"
        description="Por favor ponte en contacto con nosotros"
      />
    )
  }
  const { idOrden, rfc, idSolicitudDom } = location.state ?? null

  const { uploadSignature } = useUploadSignature()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {
    latitude,
    longitude,
    permissionDenied: geolocationDenied,
    error: geolocationError
  } = useGeolocation()

  // TODO: fix types

  useLayoutEffect(() => {
    alert(
      'Es necesario que permitas acceder a tu ubicación para firmar electrónicamente el documento'
    )
  }, [])

  const saveStep2 = async ({ signature }: { signature: string; clabe: string }) => {
    const file = dataURLtoBlob(signature)

    const formData = new FormData()
    formData.set('file', file)
    formData.set('idOrden', idOrden)
    formData.set('latitude', String(latitude))
    formData.set('longitude', String(longitude))
    formData.set('idSolicitudDom', String(idSolicitudDom))

    setIsLoading(true)
    try {
      const { pdfUrl } = await uploadSignature(formData)
      navigate('/firmar-documento', { state: { pdfUrl, idOrden, idSolicitudDom } })
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
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
          Nueva cuenta bancaria
        </CardTitle>
        <CardDescription>
          Registra la CLABE bancaria de BBVA a la que se domiciliará tu pago
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BankInfoForm
          isLoading={isLoading}
          onSave={saveStep2}
          idOrden={idOrden}
          rfc={rfc}
        />
      </CardContent>
    </Card>
  )
}
