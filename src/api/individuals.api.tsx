import axios, { type CancelTokenSource, AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'

import type { IndividualFormData } from '@/forms/IndividualInfoForm'
import { api } from '.'

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
          setError(axiosError.message || 'Ocurrió un error al obtener los datos.')
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

export interface ValidateCutPayload {
  folioOrden: string
  codigo: string
  fechaNacimiento: string
  idEstadoNacimiento: number
}

export const useValidateCut = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateCut = async (payload: ValidateCutPayload) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post(`${PREFIX}/validate`, payload)
      setData(response.data)
      return response.data
    } catch (err) {
      if (axios.isCancel(err)) {
        console.warn('POST cancelado:', err.message)
      } else {
        const axiosError = err as AxiosError
        setError(axiosError.message || 'Error al enviar el formulario.')
        throw axiosError // opcional, para manejo externo
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    validateCut,
    data,
    loading,
    error
  }
}
