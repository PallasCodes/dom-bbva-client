import { ChevronRight } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { zodEs } from '@/zod/zod-es'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  idEstadoNacimiento: z.number(),
  diaNacimiento: z.string(),
  mesNacimiento: z.string(),
  anioNacimiento: z.string(),
  codigo: z.string().min(4, zodEs.string.length(4)).max(4, zodEs.string.length(4))
})

export type CUTValidationFormData = z.infer<typeof formSchema>

type Props = {
  onSave: (data: any) => Promise<any>
  catalogIsLoading: boolean
  stateCatalog: { id: number; nombre: string }[] | null
}

const days = Array.from({ length: 31 }, (_, i) => i + 1)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const currentYear = new Date().getFullYear()
const lastValidYear = currentYear - 17
const years = Array.from({ length: lastValidYear - 1920 }, (_, i) => i + 1920).reverse()

export const CUTValidationForm = ({ onSave, catalogIsLoading, stateCatalog }: Props) => {
  const form = useForm<CUTValidationFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange'
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="idEstadoNacimiento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado de nacimiento*</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={String(field.value)}
                disabled={catalogIsLoading} // opcional: bloquear el select
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu estado de nacimiento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {catalogIsLoading ? (
                    <div className="p-4 text-sm text-muted-foreground">Cargando...</div>
                  ) : (
                    stateCatalog?.map((state) => (
                      <SelectItem value={state.id.toString()} key={state.id}>
                        {state.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormLabel>Fecha de nacimiento*</FormLabel>
        <div className="grid grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="diaNacimiento"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={String(field.value)}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Día" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem value={String(day)} key={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mesNacimiento"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={String(field.value)}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem value={String(month)} key={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="anioNacimiento"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={String(field.value)}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem value={String(year)} key={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmación de Código Único de Trámite*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Lo recibirás en tu teléfono celular, puede tardar unos minutos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full uppercase mt-2"
          disabled={catalogIsLoading}
        >
          Siguiente
          <ChevronRight />
        </Button>
      </form>
    </Form>
  )
}
