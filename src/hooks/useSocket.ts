import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface ServerToClientEvents {
  clabe_verification_result: (data: {
    valid: boolean
    message: string
    pdfUrl?: string
  }) => void
}

const MODE = import.meta.env.VITE_MODE

type MySocket = Socket<ServerToClientEvents>

export const useSocket = (url: string) => {
  const socketRef = useRef<MySocket | null>(null)
  const fullUrl = MODE === 'prod' ? `${url}/dom-bbva` : url
  const path = MODE === 'prod' ? '/dom-bbva/socket.io' : ''

  useEffect(() => {
    const socket: MySocket = io(fullUrl, {
      path,
      transports: ['websocket']
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [url])

  return socketRef
}
