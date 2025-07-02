import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { getIndividualInfo } from '@/api/individuals.api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BankAccountForm } from '@/forms/BankAccountForm'
import { IndividualInfoForm } from '@/forms/IndividualInfoForm'
import { dataURLtoBlob } from '@/utils'

export default function HomePage() {
  const location = useLocation()
  const { folioOrden } = location.state ?? null

  if (!folioOrden) {
    return <h1>Error</h1>
  }

  const [step, setStep] = useState(1)

  const { data, error, loading } = getIndividualInfo(folioOrden)

  const saveStep1 = async () => {
    setStep(2)
  }

  const saveStep2 = async (args: any) => {
    const blob = dataURLtoBlob(args.signature)
    console.log('🚀 ~ saveStep2 ~ blob:', blob)
  }

  return (
    <Card className="max-w-2xl md:mx-auto m-4 max-h-[95vh] overflow-y-auto">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          {step === 1 && 'Información personal'}
          {step === 2 && 'Nueva cuenta bancaria'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <IndividualInfoForm
            formData={data as any}
            isLoading={loading}
            onSave={saveStep1}
          />
        )}

        {step === 2 && <BankAccountForm isLoading={loading} onSave={saveStep2} />}
      </CardContent>
    </Card>
  )
}
