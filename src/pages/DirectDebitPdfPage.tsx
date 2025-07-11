import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocation } from 'react-router-dom'

export default function DirectDebitPdfPage() {
  const { state } = useLocation()

  return (
    <Card className="max-w-2xl md:mx-auto m-4 gap-2">
      <CardHeader className="">
        <CardTitle className="text-center font-bold text-xl w-full">
          Firma de documento
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div style={{ width: '100%', aspectRatio: '7.9 / 11' }} className="max-w-4xl">
          <iframe
            src={`https://docs.google.com/gview?embedded=true&url=${state.pdfUrl}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
