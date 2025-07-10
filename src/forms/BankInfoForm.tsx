import { AxiosError } from 'axios'
import { ChevronRight, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useValidateClabe } from '@/api/direct-debits.api'
import { SignaturePad } from '@/components/SignaturePad'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSocket } from '@/hooks/useSocket'
import { zodEs } from '@/zod/zod-es'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  clabe: z.string().regex(/^012\d{15}$/, zodEs.regex.clabe),
  signature: z.string().min(1, zodEs.string.nonempty)
})

export type BankAccountFormData = z.infer<typeof formSchema>

type Props = {
  onSave: (data: BankAccountFormData) => Promise<any>
  isLoading: boolean
  rfc: string
  idOrden: number
}

export const BankInfoForm = ({ onSave, isLoading, rfc, idOrden }: Props) => {
  // state
  const sigRef = useRef<any>(null)
  const [numClabeValidations, setNumClabeValidations] = useState(0)
  const [isClabeValid, setIsClabeValid] = useState<boolean | undefined>()
  const [verifyingClabe, setVerifyingClabe] = useState(false)
  const [idSocketIo, setIdSocketIo] = useState('')

  // API calls
  const { validateClabe } = useValidateClabe()

  // Hooks
  const socketRef = useSocket(import.meta.env.VITE_WS_URL)

  const form = useForm<BankAccountFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clabe: '',
      signature: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  const verifyClabeReq = async (clabe: string) => {
    try {
      setVerifyingClabe(true)
      const res = await validateClabe({
        clabe,
        rfc,
        idSocketIo,
        idOrden
      })
      return res
    } catch (error) {
      setVerifyingClabe(false)
      if (error instanceof AxiosError && error.response?.status === 400) {
        setIsClabeValid(false)
        return error.response.data
      }
    }
  }

  const handleSubmit = async (data: BankAccountFormData) => {
    if (sigRef.current?.isEmpty()) {
      form.setError('signature', { message: 'La firma es obligatoria' })
      return
    }

    await onSave(data)
  }

  const onValidateClabe = async () => {
    const value = form.getValues('clabe')

    if (value.length === 18 && !isClabeValid && numClabeValidations < 3) {
      const isValid = await form.trigger('clabe')
      if (isValid) {
        const { numTries } = await verifyClabeReq(value)
        setNumClabeValidations(numTries ?? numClabeValidations)
      }
    }
  }

  useEffect(() => {
    if (isClabeValid === false) {
      form.setError('clabe', {
        message: `La CLABE no es valida. Intento ${numClabeValidations} de 3`
      })
    } else if (isClabeValid === true) {
      form.clearErrors('clabe')
    }
  }, [isClabeValid])

  useEffect(() => {
    if (numClabeValidations >= 3 && !isClabeValid) {
      form.setError('clabe', { message: 'Haz excedido el límite de intentos' })
    }
  }, [numClabeValidations])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    socket.on('connect', () => {
      setIdSocketIo(socket.id as string)
    })

    socket.on('clabe_verification_result', (data) => {
      const msg = data.message as string

      if (data.valid) {
        toast.success(msg)
        setIsClabeValid(true)
      } else {
        toast.error(msg)
        setIsClabeValid(false)
      }

      setVerifyingClabe(false)
    })

    return () => {
      socket.off('clabe_verification_result')
    }
  }, [socketRef])

  return (
    <Form {...form}>
      <form
        onSubmit={
          isClabeValid && !verifyingClabe
            ? form.handleSubmit(handleSubmit)
            : (e) => e.preventDefault()
        }
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="clabe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CLABE Bancaria*</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    readOnly={verifyingClabe || isClabeValid}
                    className={verifyingClabe || isClabeValid ? 'pr-10' : ''}
                  />
                  {verifyingClabe && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </FormControl>
              {verifyingClabe && (
                <FormDescription>
                  {`La validación podría tardar 1 o 2 minutos. Intento ${numClabeValidations} de 3`}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {!verifyingClabe && (
          <Button
            size="sm"
            variant="outline"
            disabled={numClabeValidations >= 3 || verifyingClabe || isClabeValid}
            onClick={onValidateClabe}
          >
            Validar CLABE
          </Button>
        )}

        <FormField
          control={form.control}
          name="signature"
          render={() => (
            <FormItem>
              <FormLabel>Firma*</FormLabel>
              <FormControl>
                <div>
                  <SignaturePad
                    ref={sigRef}
                    onDrawEnd={() => {
                      if (!sigRef.current?.isEmpty()) {
                        const signature = sigRef.current.getSignature()
                        form.setValue('signature', signature, { shouldValidate: true })
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      sigRef.current?.clear()
                      form.setValue('signature', '', { shouldValidate: true })
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    Borrar firma
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(verifyingClabe && numClabeValidations < 3) ||
          (isLoading && (
            <Button type="submit" className="w-full uppercase mt-2" disabled>
              Cargando
              <Loader2 className="animate-spin" />
            </Button>
          ))}
        {!verifyingClabe && numClabeValidations < 3 && (
          <Button type="submit" className="w-full uppercase mt-2">
            Siguiente
            <ChevronRight />
          </Button>
        )}
        {numClabeValidations >= 3 && (
          <Button type="submit" className="w-full uppercase mt-2" disabled>
            Bloqueado
          </Button>
        )}
      </form>
    </Form>
  )
}
