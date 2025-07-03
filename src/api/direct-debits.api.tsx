import { useEffect, useState } from 'react'

import { useLoading } from '@/context/LoadingContext'
import type { Catalog } from '@/types/catalog.interface'
import type { ValidateClabeRequest } from '@/types/requests/validate-clabe.interface'
import { api } from '.'

const PREFIX = '/direct-debits'

export const useGetCatalog = (catalogCode: number) => {
  const [data, setData] = useState<Catalog[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getCatalog = async (catalogCode: number) => {
      setIsLoading(true)
      try {
        const response = await api.get<{ elementos: Catalog[] }>(
          `https://auth.intermercado.com.mx/api/catalogos/get-elementos-varios-por-codigo?codigo=${catalogCode}`
        )
        setData(response.data.elementos)
      } catch (err) {
        throw err
      } finally {
        setIsLoading(false)
      }
    }

    getCatalog(catalogCode)
  }, [])

  return { data, isLoading }
}

export const useValidateClabe = () => {
  const { showLoader, hideLoader } = useLoading()

  const validateClabe = async (payload: ValidateClabeRequest) => {
    showLoader('Estamos validando tu cuenta', 'Podría tardar entre 1 o 2 minutos')
    try {
      const response = await api.post(`${PREFIX}/validate-clabe`, payload)
      return response.data
    } catch (err) {
      hideLoader()
      throw err
    }
  }

  return {
    validateClabe
  }
}
