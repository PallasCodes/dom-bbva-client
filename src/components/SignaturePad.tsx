import { useRef, useImperativeHandle, forwardRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'

type Props = {
  onDrawEnd?: () => void
}

export const SignaturePad = forwardRef(({ onDrawEnd }: Props, ref) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null)

  useImperativeHandle(ref, () => ({
    getSignature: () => sigCanvasRef.current?.getCanvas().toDataURL('image/png'),
    clear: () => sigCanvasRef.current?.clear(),
    isEmpty: () => sigCanvasRef.current?.isEmpty()
  }))

  return (
    <div className="border rounded-xl p-2 w-full h-[200px]">
      <SignatureCanvas
        ref={sigCanvasRef}
        penColor="black"
        onEnd={onDrawEnd}
        canvasProps={{ className: 'w-full h-full' }}
      />
    </div>
  )
})
