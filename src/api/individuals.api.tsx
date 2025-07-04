import { useEffect, useState } from 'react'

import { useLoading } from '@/context/LoadingContext'
import type { IndividualFormData } from '@/forms/IndividualInfoForm'
import { api } from '.'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

const PREFIX = '/individuals'

export const getIndividualInfo = (folioOrden: string) => {
  const { showLoader, hideLoader } = useLoading()
  const [data, setData] = useState<IndividualFormData | null>(null)

  useEffect(() => {
    const fetchIndividuals = async (folioOrden: string) => {
      showLoader()
      try {
        const response = await api.get<IndividualFormData>(`${PREFIX}/${folioOrden}`)
        setData(response.data)
      } catch (err) {
        throw err
      } finally {
        hideLoader()
      }
    }

    fetchIndividuals(folioOrden)
  }, [])

  return { data }
}

export interface ValidateCutPayload {
  folioOrden: string
  codigo: string
  fechaNacimiento: string
  idEstadoNacimiento: number
}

export const useValidateCut = () => {
  const { showLoader, hideLoader } = useLoading()

  const validateCut = async (payload: ValidateCutPayload) => {
    showLoader()
    try {
      const response = await api.post(`${PREFIX}/validate`, payload)
      return response.data
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        toast.error('Los datos son erroneos, verifica que el código CUT sea correcto')
      }
      throw err
    } finally {
      hideLoader()
    }
  }

  return {
    validateCut
  }
}

export interface LoanInfo {
  folioInterno: string
  fechaFirma: Date
  prestamo: number
  totalPagar: number
  idOrden: number
  porPagar: number
}

export const getLoanInfo = (folioOrden: string) => {
  const { showLoader, hideLoader } = useLoading()
  const [data, setData] = useState<LoanInfo | null>(null)
  const [error, setError] = useState<number>()

  useEffect(() => {
    showLoader()
    const fetchLoanInfo = async (folioOrden: string) => {
      try {
        const response = await api.get<LoanInfo>(`${PREFIX}/loan/${folioOrden}`)
        setData(response.data)
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.status)
        }
        throw err
      } finally {
        hideLoader()
      }
    }

    fetchLoanInfo(folioOrden)
  }, [])

  return { data, error }
}
