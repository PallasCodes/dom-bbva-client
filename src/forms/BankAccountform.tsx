import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ChevronRight } from 'lucide-react'

import { SignaturePad } from '@/components/SignaturePad'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodEs } from '@/zod/zod-es'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  clabe: z
    .string()
    .min(18, zodEs.string.min(18))
    .regex(/^012[0-9]{7,}$/, zodEs.regex.clabe),
  signature: z.string().min(1, zodEs.string.nonempty)
})

export type BankAccountFormData = z.infer<typeof formSchema>

type Props = {
  onSave: (data: BankAccountFormData) => Promise<any>
  isLoading: boolean
}

export const BankAccountForm = ({ onSave, isLoading }: Props) => {
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

    const signature = sigRef.current.getSignature()
    await onSave({ ...data, signature })
  }

  const clearSignature = () => {
    sigRef.current?.clear()
    form.setValue('signature', '')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clabe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CLABE Bancaria*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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

        <Button type="submit" className="w-full uppercase mt-2" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Siguiente'}
          <ChevronRight />
        </Button>
      </form>
    </Form>
  )
}
