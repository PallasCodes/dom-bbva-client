import { useEffect, useState } from 'react'

import { useLoading } from '@/context/LoadingContext'
import type { Catalog } from '@/types/catalog.interface'
import type { ValidateClabeRequest } from '@/types/requests/validate-clabe.interface'
import { api } from '.'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

const PREFIX = '/direct-debits'

export const useGetDirectDebit = (idOrden: number) => {
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getDirectDebit = async (idOrden: number) => {
      setIsLoading(true)
      try {
        const response = await api.get(`${PREFIX}/${idOrden}`)
        setData(response.data)
      } catch (err) {
        throw err
      } finally {
        setIsLoading(false)
      }
    }

    getDirectDebit(idOrden)
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
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message ?? 'Ocurrió un error al validar la CLABE')
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
  sexo: 'M' | 'F'
  clabe: string
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
  const { showLoader, hideLoader } = useLoading()

  const uploadSignature = async (payload: FormData) => {
    showLoader()
    try {
      const response = await api.post(`${PREFIX}/upload-signature`, payload)
      return response.data
    } catch (err) {
      hideLoader()
      throw err
    }
  }

  return {
    uploadSignature
  }
}
