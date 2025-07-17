import { useAuth } from '@/store/auth.store'
import type { SolicitudDom } from '@/types/solicitud-dom.interface'
import { useNavigate } from 'react-router-dom'

export const useValidateDirectDebit = () => {
  const navigate = useNavigate()
  const { setLoggedIn, setSolDom } = useAuth()

  const validateDirectDebit = (solDom: SolicitudDom) => {
    const path = {
      1: '/info-credito',
      2: '/validar-datos',
      3: '/validar-clabe',
      4: '/firmar-documento',
      5: '/proceso-finalizado'
    }
    setLoggedIn(true)
    setSolDom(solDom)
    navigate(path[solDom.paso as keyof typeof path] ?? '/info-credito')
  }

  return { validateDirectDebit }
}
