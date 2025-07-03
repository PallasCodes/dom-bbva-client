import { Loader2 } from 'lucide-react'

interface Props {
  loading: boolean
  title?: string
  description?: string
}

export const Loader = ({ loading = false, title, description }: Props) => {
  return (
    <>
      {loading && (
        <div className="bg-[rgba(0,0,0,0.6)] fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center z-20 ">
          {(title || description) && (
            <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center justify-center">
              <Loader2 size={100} className="animate-spin z-30 text-orange-500" />
              <h2 className="font-bold text-lg antialiased mt-2">{title}</h2>
              <p className="text-sm">{description}</p>
            </div>
          )}
          {!title && !description && (
            <Loader2 size={100} className="animate-spin z-30 text-orange-500" />
          )}
        </div>
      )}
    </>
  )
}
