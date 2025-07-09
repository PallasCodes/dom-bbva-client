import { ChevronRight, Loader2 } from 'lucide-react'
import { useRef } from 'react'
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
  isClabeValid: boolean
}

export const BankInfoForm = ({
  onSave,
  isLoading,
  verifyClabe,
  verifyingClabe,
  isClabeValid
}: Props) => {
  const sigRef = useRef<any>(null)

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

  const validateClabe = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const value = target.value

    if (value.length === 18 && !isClabeValid) {
      const isValid = await form.trigger('clabe')
      if (isValid) {
        await verifyClabe(value)
      }
    }
  }

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
                    onBlur={validateClabe}
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

        {verifyingClabe ? (
          <Button type="submit" className="w-full uppercase mt-2" disabled>
            Cargando
            <Loader2 className="animate-spin" />
          </Button>
        ) : (
          <Button type="submit" className="w-full uppercase mt-2">
            Siguiente
            <ChevronRight />
          </Button>
        )}
      </form>
    </Form>
  )
}
