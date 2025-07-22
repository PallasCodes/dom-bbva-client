import { useEffect, useState } from 'react'

import { useLoading } from '@/context/LoadingContext'
import type { Catalog } from '@/types/catalog.interface'
import { ValidateClabeError } from '@/types/errors/validate-clabe-error.enum'
import type { ValidateClabeRequest } from '@/types/requests/validate-clabe.interface'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { api } from '.'

const PREFIX = '/direct-debits'

export const useGetDirectDebit = (idPersonaFisica: number) => {
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getDirectDebit = async (idPersonaFisica: number) => {
      setIsLoading(true)
      try {
        const response = await api.get(`${PREFIX}/${idPersonaFisica}`)
        setData(response.data)
      } catch (err) {
        throw err
      } finally {
        setIsLoading(false)
      }
    }

    getDirectDebit(idPersonaFisica)
  }, [])

  return { data, isLoading }
}

export const useGetCatalog = (catalogCode: number, sysCatalog: boolean = false) => {
  const [data, setData] = useState<Catalog[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getCatalog = async (catalogCode: number, sysCatalog: boolean) => {
      const url = `https://auth.intermercado.com.mx/api/catalogos/${
        sysCatalog ? 'get-elementos-por-tipo' : 'get-elementos-varios-por-codigo'
      }?codigo=${catalogCode}`

      setIsLoading(true)
      try {
        const response = await api.get<{ elementos: Catalog[] }>(url)
        setData(response.data?.elementos ?? [])
      } catch (err) {
        throw err
      } finally {
        setIsLoading(false)
      }
    }

    getCatalog(catalogCode, sysCatalog)
  }, [])

  return { data, isLoading }
}

export const useValidateClabe = () => {
  const validateClabe = async (payload: ValidateClabeRequest) => {
    try {
      const response = await api.post(`${PREFIX}/validate-clabe`, payload)
      return response.data
    } catch (err) {
      const errCode = isAxiosError(err) ? err?.response?.data.code : null
      if (!Object.keys(ValidateClabeError).includes(errCode)) {
        toast.error('Ocurrió un error al validar la CLABE')
      }

      throw err
    }
  }

  return {
    validateClabe
  }
}

export interface SaveDirectDebitRequest {
  nombre1: string
  nombre2?: string
  apellidoPaterno: string
  apellidoMaterno?: string
  rfc: string
  curp: string
  idSolicitudDomiciliacion: number
}

export const useSaveDirectDebit = () => {
  const { showLoader, hideLoader } = useLoading()

  const saveDirectDebit = async (payload: SaveDirectDebitRequest) => {
    showLoader()
    try {
      const response = await api.post(PREFIX, payload)
      return response.data
    } catch (err) {
      hideLoader()
      throw err
    }
  }

  return {
    saveDirectDebit
  }
}

export const useUploadSignature = () => {
  const uploadSignature = async (payload: FormData) => {
    try {
      const response = await api.post(`${PREFIX}/upload-signature`, payload)
      return response.data
    } catch (err) {
      throw err
    }
  }

  return {
    uploadSignature
  }
}

export const useSignDirectDebit = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const signDirectDebit = async (idPersonaFisica: number) => {
    setLoading(true)
    try {
      const response = await api.post(`${PREFIX}/sign/${idPersonaFisica}`)
      return response.data
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    signDirectDebit,
    loading
  }
}

export const useValidateLoan = () => {
  const [loading, setLoading] = useState<boolean | undefined>()

  const validateLoans = async (idPersonaFisica: number) => {
    setLoading(true)
    try {
      const response = await api.post(`${PREFIX}/validate-loan/${idPersonaFisica}`)
      return response.data
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    validateLoans,
    loading
  }
}
