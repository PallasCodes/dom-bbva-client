import { ChevronRight, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
  verifyClabe: (clabe: string) => Promise<void>
  verifyingClabe: boolean
  isClabeValid: boolean | undefined
}

export const BankInfoForm = ({
  onSave,
  isLoading,
  verifyClabe,
  verifyingClabe,
  isClabeValid
}: Props) => {
  const sigRef = useRef<any>(null)
  const [numClabeValidations, setNumClabeValidations] = useState(0)

  const form = useForm<BankAccountFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clabe: '',
      signature: ''
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const handleSubmit = async (data: BankAccountFormData) => {
    if (sigRef.current?.isEmpty()) {
      form.setError('signature', { message: 'La firma es obligatoria' })
      return
    }

    await onSave(data)
  }

  const validateClabe = async () => {
    const value = form.getValues('clabe')

    if (value.length === 18 && !isClabeValid && numClabeValidations < 3) {
      const isValid = await form.trigger('clabe')
      if (isValid) {
        setNumClabeValidations((prev) => prev + 1)
        await verifyClabe(value)
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
    if (numClabeValidations >= 3) {
      form.setError('clabe', { message: 'Haz excedido el límite de intentos' })
    }
  }, [numClabeValidations])

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
                  Estamos validando tu cuenta, podría tardar 1 o 2 minutos.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          size="sm"
          variant="outline"
          disabled={numClabeValidations >= 3 || verifyingClabe}
          onClick={validateClabe}
        >
          Validar CLABE
        </Button>

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

        {verifyingClabe && numClabeValidations < 3 && (
          <Button type="submit" className="w-full uppercase mt-2" disabled>
            Cargando
            <Loader2 className="animate-spin" />
          </Button>
        )}
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
