import { useLocation } from 'react-router-dom'

export default function DirectDebitPdfPage() {
  const { state } = useLocation()

  return (
    <div className="px-4">
      <h1 className="font-bold antialiased text-lg text center w-full mb-4">
        Proceso finalizado
      </h1>
      <iframe src={state.pdfUrl} className="w-full h-screen" />
    </div>
  )
}
