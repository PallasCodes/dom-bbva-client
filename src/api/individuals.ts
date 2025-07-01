import axios, { type CancelTokenSource, AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { api } from '.'
import type { IndividualFormData } from '@/forms/IndividualInfoForm'

const PREFIX = '/individuals'

export const getIndividualInfo = (folioOrden: string) => {
  const [data, setData] = useState<IndividualFormData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const cancelTokenRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    const fetchIndividuals = async (folioOrden: string) => {
      setLoading(true)
      setError(null)

      // Cancelar peticiones anteriores si las hay
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Petición cancelada por una nueva solicitud.')
      }

      cancelTokenRef.current = axios.CancelToken.source()

      try {
        const response = await api.get<IndividualFormData>(`${PREFIX}/${folioOrden}`, {
          cancelToken: cancelTokenRef.current.token
        })
        setData(response.data)
      } catch (err) {
        if (axios.isCancel(err)) {
          console.warn('Petición cancelada:', err.message)
        } else {
          const axiosError = err as AxiosError
          setError(
            // axiosError.response?.data?.message ||
            axiosError.message || 'Ocurrió un error al obtener los datos.'
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchIndividuals(folioOrden)

    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Componente desmontado.')
      }
    }
  }, [])

  return { data, loading, error }
}
