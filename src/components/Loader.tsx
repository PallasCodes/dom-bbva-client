import { Loader2 } from 'lucide-react'

export const Loader = ({ loading = false }: { loading: boolean }) => {
  return (
    <>
      {loading && (
        <div className="bg-[rgba(0,0,0,0.4)] fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center z-20 ">
          <Loader2 size={125} className="animate-spin z-30 text-orange-500" />
        </div>
      )}
    </>
  )
}
