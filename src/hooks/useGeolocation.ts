import { useEffect, useState } from 'react'

interface GeolocationData {
  latitude: number | null
  longitude: number | null
  error: string | null
  permissionDenied: boolean
  loading: boolean
}

export function useGeolocation(): GeolocationData {
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es compatible con este navegador.')
      setLoading(false)
      return
    }

    const success = (position: GeolocationPosition) => {
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
      setLoading(false)
    }

    const failure = (err: GeolocationPositionError) => {
      if (err.code === err.PERMISSION_DENIED) {
        setPermissionDenied(true)
        setError('Permisos de geolocalización denegados por el usuario.')
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        setError('Ubicación no disponible.')
      } else if (err.code === err.TIMEOUT) {
        setError('Tiempo de espera agotado al intentar obtener la ubicación.')
      } else {
        setError('Error desconocido al obtener la ubicación.')
      }

      setLoading(false)
    }

    navigator.geolocation.getCurrentPosition(success, failure, {
      enableHighAccuracy: true,
      timeout: 10000
    })
  }, [])

  return { latitude, longitude, error, permissionDenied, loading }
}
