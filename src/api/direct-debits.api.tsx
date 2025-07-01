import axios, { type CancelTokenSource, AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'

import type { IndividualFormData } from '@/forms/IndividualInfoForm'
import { api } from '.'
import type { Catalog } from '@/types/catalog.interface'

const PREFIX = '/direct-debits'

export const useGetCatalog = (catalogCode: number) => {
  const [data, setData] = useState<Catalog[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const cancelTokenRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    const getCatalog = async (catalogCode: number) => {
      setLoading(true)
      setError(null)

      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Petición cancelada por una nueva solicitud.')
      }

      cancelTokenRef.current = axios.CancelToken.source()

      try {
        const response = await api.get<{ elementos: Catalog[] }>(
          `https://auth.intermercado.com.mx/api/catalogos/get-elementos-varios-por-codigo?codigo=${catalogCode}`,
          {
            cancelToken: cancelTokenRef.current.token
          }
        )
        setData(response.data.elementos)
      } catch (err) {
        if (axios.isCancel(err)) {
          console.warn('Petición cancelada:', err.message)
        } else {
          const axiosError = err as AxiosError
          setError(axiosError.message || 'Ocurrió un error al obtener los datos.')
        }
      } finally {
        setLoading(false)
      }
    }

    getCatalog(catalogCode)

    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Componente desmontado.')
      }
    }
  }, [])

  return { data, loading, error }
}
