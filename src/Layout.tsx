import { FacebookIcon, Mail, PhoneIcon, Twitter } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { Loader } from './components/Loader'
import { useLoading } from './context/LoadingContext'

export const Layout = () => {
  const { isLoading } = useLoading()

  return (
    <>
      <div className="flex flex-col p-4 pb-2 items-center">
        <div className="w-40">
          <img src="/logo-intermercado.png" alt="Logo de Intermercado" />
        </div>
        <div className="flex mt-2 gap-3 items-center">
          <FacebookIcon />
          <Twitter />
          <Mail />
          <div className="flex gap-2 items-center">
            <PhoneIcon />
            <span className="text-sm font-semibold antialiased">800 500 9195</span>
          </div>
        </div>
      </div>
      <main>
        <Outlet />
      </main>
      <Loader loading={isLoading} />
    </>
  )
}
