import { isAxiosError } from 'axios'
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
import { ValidateClabeError } from '@/types/errors/validate-clabe-error.enum'
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

  const validateClabeReq = async (clabe: string) => {
    setVerifyingClabe(true)
    form.clearErrors('clabe')

    try {
      const { numTries } = await validateClabe({
        clabe,
        rfc,
        idSocketIo,
        idOrden
      })
      setNumClabeValidations(numTries ?? numClabeValidations)
    } catch (error) {
      setVerifyingClabe(false)

      if (isAxiosError(error) && error.response?.status === 400) {
        switch (error.response.data.code) {
          case ValidateClabeError.INVALID_CLABE:
            form.setError('clabe', {
              message: error.response.data.message ?? 'La CLABE no es valida'
            })
            setNumClabeValidations((prev) => prev + 1)
            break

          case ValidateClabeError.INVALID_CLABE_OR_RFC:
            form.setError('clabe', {
              message: error.response.data.message ?? 'La CLABE o RFC no son validos'
            })
            setNumClabeValidations((prev) => prev + 1)
            break

          case ValidateClabeError.VALIDATION_TRIES_LIMIT_REACHED:
            form.setError('clabe', {
              message: error.response.data.message ?? 'Haz execido el límite de intentos'
            })
            setNumClabeValidations(3)
            break
        }
        setIsClabeValid(false)
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
        await validateClabeReq(value)
      }
    }
  }

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
      socket.disconnect()
    }
  }, [socketRef])

  const shouldAllowSubmit = isClabeValid && !verifyingClabe

  return (
    <Form {...form}>
      <form
        onSubmit={shouldAllowSubmit ? form.handleSubmit(handleSubmit) : undefined}
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
                    readOnly={verifyingClabe || isClabeValid || numClabeValidations >= 3}
                    className={`${verifyingClabe ? 'pr-10' : ''} ${
                      isClabeValid ? 'pr-10 border-green-500 border-2' : ''
                    }`}
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

        {!verifyingClabe && numClabeValidations < 3 && isClabeValid !== true && (
          <Button size="sm" variant="outline" onClick={onValidateClabe}>
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

        {isClabeValid && !isLoading && (
          <Button type="submit" className="w-full uppercase mt-2">
            Siguiente
            <ChevronRight />
          </Button>
        )}

        {isClabeValid && isLoading && (
          <Button type="submit" className="w-full uppercase mt-2" disabled>
            Cargando
            <Loader2 className="animate-spin" />
          </Button>
        )}
      </form>
    </Form>
  )
}
