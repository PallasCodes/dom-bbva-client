import { useSearchParams } from 'react-router-dom'

import { getIndividualInfo } from '@/api/individuals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IndividualInfoForm } from '@/forms/IndividualInfoForm'

export default function HomePage() {
  const [params] = useSearchParams()

  const { data, error, loading } = getIndividualInfo(params.get('folio') ?? '')

  const onNext = async () => {
    console.log('next')
  }

  return (
    <Card className="max-w-2xl md:mx-auto m-4 max-h-[95vh] overflow-y-auto">
      <CardHeader className="sticky top-0 left-0 right-0 bg-white w-full ">
        <CardTitle className="text-center font-bold text-xl w-full">
          Autentícate
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!loading && (
          <IndividualInfoForm
            formData={data as any}
            isLoading={loading}
            onSave={onNext}
          />
        )}
      </CardContent>
    </Card>
  )
}
