import { FacebookIcon, Mail, PhoneIcon, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

export const Layout = () => {
  const location = useLocation()

  const [showContent, setShowContent] = useState(true)

  useEffect(() => {
    setShowContent(false)
    const timeout = setTimeout(() => {
      setShowContent(true)
    }, 50)
    return () => clearTimeout(timeout)
  }, [location.pathname])

  return (
    <>
      <div className="flex flex-col p-4 pb-2 items-center">
        <a href="https://intermercado.mx/" target="_blank" className="w-40">
          <img src="/logo-intermercado.png" alt="Logo de Intermercado" />
        </a>
        <div className="flex mt-2 gap-3 items-center">
          <a
            href="https://www.facebook.com/IntermercadoMx/"
            target="_blank"
            className="bg-slate-100 text-blue-950 size-7 flex items-center justify-center rounded-full"
          >
            <FacebookIcon size={18} />
          </a>
          <a
            href="https://x.com/intermercado"
            target="_blank"
            className="bg-slate-100 text-blue-950 size-7 flex items-center justify-center rounded-full"
          >
            <Twitter size={18} />
          </a>
          <a
            href="mailto:micredito@intermercado.com.mx"
            className="bg-slate-100 text-blue-950 size-7 flex items-center justify-center rounded-full"
          >
            <Mail size={18} />
          </a>
          <a href="tel:+528005009195" className="flex gap-2 items-center">
            <span className="bg-slate-100 text-blue-950 size-7 flex items-center justify-center rounded-full">
              <PhoneIcon size={18} />
            </span>
            <span className="text-sm font-medium text-gray-600">800 500 9195</span>
          </a>
        </div>
      </div>

      <main className="relative overflow-hidden min-h-[300px] transition-all duration-300 ease-in-out">
        <div
          key={location.pathname}
          className={`transition-all duration-700 ease-in-out transform ${
            showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <Outlet />
        </div>
      </main>
    </>
  )
}
