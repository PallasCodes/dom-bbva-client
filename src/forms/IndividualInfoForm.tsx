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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { Catalog } from '@/types/catalog.interface'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  nombre1: z.string().min(1).max(100),
  nombre2: z.string().min(1).max(100).optional(),
  apellidoPaterno: z.string().min(1).max(100),
  apellidoMaterno: z.string().min(1).max(100).optional(),
  rfc: z
    .string()
    .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, 'El RFC no es válido')
    .min(12)
    .max(13)
    .toUpperCase(),
  curp: z
    .string()
    .regex(/^[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/, 'El CURP no es válido')
    .length(18)
    .toUpperCase(),
  idNacionalidad: z.number(),
  idEstadoCivil: z.number(),
  dependientes: z.number().min(0),
  sexo: z.string().min(1)
})

export type IndividualFormData = z.infer<typeof formSchema>

type Props = {
  onSave: (data: IndividualFormData) => Promise<any>
  isLoading: boolean
  formData: IndividualFormData
  nationalityCatalog: Catalog[]
  maritalStatusCatalog: Catalog[]
}

export const IndividualInfoForm = ({
  onSave,
  isLoading,
  formData,
  nationalityCatalog,
  maritalStatusCatalog
}: Props) => {
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
      idNacionalidad: 0,
      idEstadoCivil: 0,
      dependientes: 0,
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
        sexo: formData.sexo ?? '',
        idNacionalidad: Number(formData.idNacionalidad ?? 0),
        idEstadoCivil: Number(formData.idEstadoCivil ?? 0),
        dependientes: formData.dependientes ?? 0
      }
      form.reset(safeData)
    }
  }, [formData, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          disabled={disabledForm}
          control={form.control}
          name="nombre1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={disabledForm}
          control={form.control}
          name="nombre2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Segundo nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={disabledForm}
          control={form.control}
          name="apellidoPaterno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido Paterno*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={disabledForm}
          control={form.control}
          name="apellidoMaterno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido Materno</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={disabledForm}
          control={form.control}
          name="rfc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RFC*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={disabledForm}
          control={form.control}
          name="curp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CURP*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={disabledForm}
          control={form.control}
          name="idNacionalidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nacionalidad*</FormLabel>
              <Select
                disabled={disabledForm}
                onValueChange={(value) => field.onChange(Number(value))}
                value={String(field.value)}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una nacionalidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {nationalityCatalog.map((item) => (
                    <SelectItem value={item.id.toString()} key={item.id}>
                      {item.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={disabledForm}
          control={form.control}
          name="idEstadoCivil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Civil*</FormLabel>
              <Select
                disabled={disabledForm}
                onValueChange={(value) => field.onChange(Number(value))}
                value={String(field.value)}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu estado civil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {maritalStatusCatalog.map((item) => (
                    <SelectItem value={item.id.toString()} key={item.id}>
                      {item.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={disabledForm}
          control={form.control}
          name="dependientes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dependientes*</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sexo"
          disabled={disabledForm}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Sexo*</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormItem className="flex items-center gap-3 mr-4">
                    <FormControl>
                      <RadioGroupItem value="M" disabled={disabledForm} />
                    </FormControl>
                    <FormLabel className="font-normal">Masculino</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="F" disabled={disabledForm} />
                    </FormControl>
                    <FormLabel className="font-normal">Femenino</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="space-y-3">
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
