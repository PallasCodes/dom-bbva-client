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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  nombre1: z.string().min(1).max(100),
  nombre2: z.string().min(1).max(100).optional(),
  apellidoPaterno: z.string().min(1).max(100),
  apellidoMaterno: z.string().min(1).max(100).optional(),
  // TODO: ADD regex for curp and rfc
  rfc: z.string().min(1).max(100),
  curp: z.string().min(1).max(100),
  idNacionalidad: z.string(),
  idEstadoCivil: z.number().positive(),
  dependientes: z.number().min(0),
  sexo: z.string().min(1)
})

export type IndividualFormData = z.infer<typeof formSchema>

type Props = {
  onSave: (data: any) => Promise<any>
  isLoading: boolean
  formData: IndividualFormData
}

export const IndividualInfoForm = ({ onSave, isLoading, formData }: Props) => {
  const form = useForm<IndividualFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre1: '',
      nombre2: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      rfc: '',
      curp: '',
      idNacionalidad: '',
      idEstadoCivil: 0,
      dependientes: 0,
      sexo: ''
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  useEffect(() => {
    if (formData) {
      console.log('🚀 ~ useEffect ~ formData:', formData)
      const safeData: IndividualFormData = {
        ...formData,
        nombre1: formData.nombre1 ?? '',
        nombre2: formData.nombre2 ?? '',
        apellidoPaterno: formData.apellidoPaterno ?? '',
        apellidoMaterno: formData.apellidoMaterno ?? '',
        rfc: formData.rfc ?? '',
        curp: formData.curp ?? '',
        sexo: formData.sexo ?? '',
        idNacionalidad: formData.idNacionalidad.toString() ?? 0,
        idEstadoCivil: formData.idEstadoCivil ?? 0,
        dependientes: formData.dependientes ?? 0
      }
      form.reset(safeData)
    }
  }, [formData, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          disabled
          control={form.control}
          name="nombre1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled
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
          disabled
          control={form.control}
          name="apellidoPaterno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido Paterno</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled
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
          disabled
          control={form.control}
          name="rfc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RFC</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled
          control={form.control}
          name="curp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CURP</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled
          control={form.control}
          name="idNacionalidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nacionalidad</FormLabel>
              <Select
                disabled
                onValueChange={(value) => field.onChange(Number(value))} // 👈 convierte a number
                // defaultValue={String(field.value)} // 👈 asegura string
                value={String(field.value)}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una nacionalidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Mexicana</SelectItem>
                  <SelectItem value="2">Estadounidense</SelectItem>
                  <SelectItem value="700">Otra</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled
          control={form.control}
          name="idEstadoCivil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Cívil</FormLabel>
              <Select
                disabled
                onValueChange={(value) => field.onChange(Number(value))} // 👈 convierte a number
                // defaultValue={String(field.value)} // 👈 asegura string
                value={String(field.value)}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu estado cívil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Mexicana</SelectItem>
                  <SelectItem value="2">Estadounidense</SelectItem>
                  <SelectItem value="700">Otra</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled
          control={form.control}
          name="dependientes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dependientes</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full uppercase" disabled={isLoading}>
          {isLoading}
          Siguiente
        </Button>
      </form>
    </Form>
  )
}
