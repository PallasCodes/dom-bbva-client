import { useEffect, useState } from 'react'

import { useLoading } from '@/context/LoadingContext'
import type { IndividualFormData } from '@/forms/IndividualInfoForm'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { api } from '.'

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
  idPersonaFisica: number
  codigo: string
  fechaNacimiento: string
  idEstadoNacimiento: number
}

export const useValidateCut = () => {
  const [isLoading, setIsLoading] = useState(false)

  const validateCut = async (payload: ValidateCutPayload) => {
    setIsLoading(true)
    try {
      const response = await api.post(`${PREFIX}/validate`, payload)
      return response.data
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        toast.error('Los datos son erroneos, verifica que el código CUT sea correcto')
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    validateCut,
    isLoading
  }
}

export interface LoanInfo {
  folioInterno: string
  fechaFirma: Date
  prestamo: number
  totalPagar: number
  idOrden: number
  porPagar: number
  idSolicitudDom: number
}

export const getLoanInfo = (idPersonaFisica: number) => {
  const [data, setData] = useState<LoanInfo[] | null>(null)
  const [error, setError] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchLoanInfo = async (idPersonaFisica: number) => {
      setIsLoading(true)
      try {
        const response = await api.get<{ loans: LoanInfo[] }>(
          `${PREFIX}/loan/${idPersonaFisica}`
        )
        setData(response.data.loans)
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.status)
        }
        throw err
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoanInfo(idPersonaFisica)
  }, [])

  return { data, error, isLoading }
}
