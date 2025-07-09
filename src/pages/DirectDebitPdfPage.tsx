import { useLocation } from 'react-router-dom'

export default function DirectDebitPdfPage() {
  const { state } = useLocation()

  return (
    <>
      <iframe src={state.pdfUrl} className="w-full h-auto" />
    </>
  )
}
