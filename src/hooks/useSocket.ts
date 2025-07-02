import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface ServerToClientEvents {
  clabe_verification_result: (data: { valid: boolean; message: string }) => void
}

type MySocket = Socket<ServerToClientEvents>

export const useSocket = (url: string) => {
  const socketRef = useRef<MySocket | null>(null)

  useEffect(() => {
    const socket: MySocket = io(url, {
      transports: ['websocket']
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [url])

  return socketRef
}
