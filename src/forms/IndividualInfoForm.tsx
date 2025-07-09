import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { zodEs } from '@/zod/zod-es'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  nombre1: z.string().min(1, zodEs.string.min(1)).max(100, zodEs.string.max(100)),
  nombre2: z
    .string()
    .min(1, zodEs.string.min(1))
    .max(100, zodEs.string.max(100))
    .optional(),
  apellidoPaterno: z.string().min(1, zodEs.string.min(1)).max(100, zodEs.string.max(100)),
  apellidoMaterno: z
    .string()
    .min(1, zodEs.string.min(1))
    .max(100, zodEs.string.max(100))
    .optional(),
  rfc: z
    .string()
    .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, zodEs.regex.rfc)
    .min(12, zodEs.string.min(12))
    .max(13, zodEs.string.max(13))
    .transform((val) => val.toUpperCase()),
  curp: z
    .string()
    .regex(/^[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/, zodEs.regex.curp)
    .length(18, zodEs.string.length(18))
    .transform((val) => val.toUpperCase()),
  sexo: z.string().min(1, zodEs.string.nonempty)
})

export type IndividualFormData = z.infer<typeof formSchema>

type Props = {
  onSave: (data: IndividualFormData) => Promise<any>
  isLoading: boolean
  formData: IndividualFormData
}

export const IndividualInfoForm = ({ onSave, isLoading, formData }: Props) => {
  const [disabledForm, setDisabledForm] = useState(true)

  const form = useForm<IndividualFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre1: '',
      nombre2: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      rfc: '',
      curp: '',
      sexo: ''
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  useEffect(() => {
    if (formData) {
      const safeData: IndividualFormData = {
        ...formData,
        nombre1: formData.nombre1 ?? '',
        nombre2: formData.nombre2 ?? undefined,
        apellidoPaterno: formData.apellidoPaterno ?? '',
        apellidoMaterno: formData.apellidoMaterno ?? undefined,
        rfc: formData.rfc ?? '',
        curp: formData.curp ?? '',
        sexo: formData.sexo ?? ''
      }
      form.reset(safeData)
    }
  }, [formData, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre1"
          render={({ field }) => (
            <FormItem className={`${disabledForm ? 'opacity-60' : ''}`}>
              <FormLabel>Nombre*</FormLabel>
              <FormControl>
                <Input {...field} readOnly={disabledForm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombre2"
          render={({ field }) => (
            <FormItem className={`${disabledForm ? 'opacity-60' : ''}`}>
              <FormLabel>Segundo nombre</FormLabel>
              <FormControl>
                <Input {...field} readOnly={disabledForm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apellidoPaterno"
          render={({ field }) => (
            <FormItem className={`${disabledForm ? 'opacity-60' : ''}`}>
              <FormLabel>Apellido Paterno*</FormLabel>
              <FormControl>
                <Input {...field} readOnly={disabledForm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apellidoMaterno"
          render={({ field }) => (
            <FormItem className={`${disabledForm ? 'opacity-60' : ''}`}>
              <FormLabel>Apellido Materno</FormLabel>
              <FormControl>
                <Input {...field} readOnly={disabledForm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rfc"
          render={({ field }) => (
            <FormItem className={`${disabledForm ? 'opacity-60' : ''}`}>
              <FormLabel>RFC*</FormLabel>
              <FormControl>
                <Input {...field} readOnly={disabledForm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="curp"
          render={({ field }) => (
            <FormItem className={`${disabledForm ? 'opacity-60' : ''}`}>
              <FormLabel>CURP*</FormLabel>
              <FormControl>
                <Input {...field} readOnly={disabledForm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sexo"
          render={({ field }) => (
            <FormItem className={`${disabledForm ? 'opacity-60' : ''} space-y-1`}>
              <FormLabel>Sexo*</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex"
                  onValueChange={disabledForm ? () => {} : field.onChange}
                  value={field.value}
                >
                  <FormItem className="flex items-center gap-3 mr-4">
                    <FormControl>
                      <RadioGroupItem value="M" />
                    </FormControl>
                    <FormLabel className="font-normal">Masculino</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="F" />
                    </FormControl>
                    <FormLabel className="font-normal">Femenino</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="space-y-1">
          <FormLabel>¿Estos datos coinciden con tu información personal?</FormLabel>
          <FormControl>
            <RadioGroup
              value={disabledForm.toString()}
              onValueChange={(val) => setDisabledForm(val === 'true')}
              className="flex"
            >
              <FormItem className="flex items-center gap-3 mr-4">
                <FormControl>
                  <RadioGroupItem value="true" />
                </FormControl>
                <FormLabel className="font-normal">Sí</FormLabel>
              </FormItem>
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <RadioGroupItem value="false" />
                </FormControl>
                <FormLabel className="font-normal">No</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormDescription>
            Si tus datos son incorrectos márca la opción "No" y corrigelos.
          </FormDescription>
          <FormMessage />
        </FormItem>

        <Button type="submit" className="w-full uppercase mt-2" disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Siguiente'}
          <ChevronRight />
        </Button>
      </form>
    </Form>
  )
}
