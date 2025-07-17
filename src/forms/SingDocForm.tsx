// components/CheckboxForm.tsx
'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Loader2 } from 'lucide-react'

interface Props {
  onSave: () => Promise<void>
  loading: boolean
}

const FormSchema = z.object({
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Este campo es obligatorio' })
  }),
  privacy: z.literal(true, {
    errorMap: () => ({ message: 'Este campo es obligatorio' })
  }),
  newsletter: z.boolean().optional() // No requerido
})

type FormData = z.infer<typeof FormSchema>

export const SignDocForm = ({ onSave, loading }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      terms: undefined,
      privacy: undefined,
      newsletter: false
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="grid gap-1 leading-none">
                <FormLabel>
                  Reconozco que, mi firma digital y la aceptación electrónica de las
                  condiciones en esta solicitud y en los documentos tienen el mismo valor
                  que mi firma autógrafa, al amparo de lo establecido en los artículos
                  1803 y 1811 del Código Civil Federal, así como del artículo 80 del
                  Código de Comercio que refieren a la contratación, aceptación y
                  obligaciones generados por medios electrónicos.
                </FormLabel>
                <FormDescription>
                  Para continuar reconoce tu firma digital.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacy"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="grid gap-1 leading-none">
                <FormLabel>
                  Manifiesto que, durante y hasta finalizar el proceso de domiciliación
                  automática web Intermercado fue realizado en su totalidad por mí mismo y
                  por mi voluntad, y se ha constituido en forma libre sin que existiera
                  presión ni obligación alguna.
                </FormLabel>
                <FormDescription>
                  Para continuar acepta el consentimiento.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {!loading && (
          <Button type="submit" className="w-full">
            Firmar Electrónicamente
          </Button>
        )}
        {loading && (
          <Button type="submit" className="w-full" disabled>
            Cargando
            <Loader2 className="animate-spin" />
          </Button>
        )}
      </form>
    </Form>
  )
}
