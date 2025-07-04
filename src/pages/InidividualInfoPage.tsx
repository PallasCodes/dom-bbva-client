import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useGetCatalog, useValidateClabe } from '@/api/direct-debits.api'
import { getIndividualInfo } from '@/api/individuals.api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useLoading } from '@/context/LoadingContext'
import { BankAccountForm } from '@/forms/BankAccountForm'
import { IndividualInfoForm } from '@/forms/IndividualInfoForm'
import { useSocket } from '@/hooks/useSocket'
import { dataURLtoBlob } from '@/utils'
import { toast } from 'sonner'

export default function HomePage() {
  const location = useLocation()
  const { folioOrden } = location.state ?? null

  if (!folioOrden) {
    return <h1>Error</h1>
  }

  // Hooks
  const socketRef = useSocket('http://localhost:3000')
  const { validateClabe } = useValidateClabe()
  const { hideLoader, isLoading } = useLoading()

  // State
  const [step, setStep] = useState(1)
  const [idSocketIo, setIdSocketIo] = useState('')

  // Api calls
  const { data } = getIndividualInfo(folioOrden)
  const { data: nationalityCatalog, isLoading: nationalityCatIsLoading } =
    useGetCatalog(1032)
  const { data: maritalStatusCatalog, isLoading: maritalStatusCatIsLoading } =
    useGetCatalog(11, true)

  // Methods
  const saveStep1 = async () => {
    setStep(2)
  }

  const saveStep2 = async (args: { signature: string; clabe: string }) => {
    try {
      const blob = dataURLtoBlob(args.signature)
      await validateClabe({ clabe: args.clabe, rfc: 'TOMB971024UW4', idSocketIo })
    } catch (e) {
      console.error(e)
    }
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
      console.log('Recibido:', data)
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
            nationalityCatalog={nationalityCatalog}
            maritalStatusCatalog={maritalStatusCatalog}
          />
        )}

        {step === 2 && <BankAccountForm isLoading={isLoading} onSave={saveStep2} />}
      </CardContent>
    </Card>
  )
}
