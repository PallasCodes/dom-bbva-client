import { FacebookIcon, Mail, PhoneIcon, Twitter } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { Loader } from './components/Loader'
import { useLoading } from './context/LoadingContext'

export const Layout = () => {
  const { isLoading, title, description } = useLoading()

  return (
    <>
      <div className="flex flex-col p-4 pb-2 items-center">
        <div className="w-40">
          <img src="/logo-intermercado.png" alt="Logo de Intermercado" />
        </div>
        <div className="flex mt-2 gap-3 items-center">
          <a
            href=""
            className="bg-slate-100 text-blue-950 size-7 flex items-center justify-center rounded-full"
          >
            <FacebookIcon size={18} />
          </a>
          <a
            href=""
            className="bg-slate-100 text-blue-950 size-7 flex items-center justify-center rounded-full"
          >
            <Twitter size={18} />
          </a>
          <a
            href=""
            className="bg-slate-100 text-blue-950 size-7 flex items-center justify-center rounded-full"
          >
            <Mail size={18} />
          </a>
          <a href="" className="flex gap-2 items-center">
            <span className="bg-slate-100 text-blue-950 size-7 flex items-center justify-center rounded-full">
              <PhoneIcon size={18} />
            </span>
            <span className="text-sm font-medium text-gray-600">800 500 9195</span>
          </a>
        </div>
      </div>
      <main>
        <Outlet />
      </main>
      <Loader loading={isLoading} title={title} description={description} />
    </>
  )
}
