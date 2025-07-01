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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  clabe: z.string().min(10)
})

export type IndividualFormData = z.infer<typeof formSchema>

type Props = {
  onSave: (data: any) => Promise<any>
  isLoading: boolean
}

export const BankAccountForm = ({ onSave, isLoading }: Props) => {
  const form = useForm<IndividualFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clabe: ''
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="clabe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CLABE Bancaria</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full uppercase mt-2" disabled={isLoading}>
          {isLoading}
          Siguiente
        </Button>
      </form>
    </Form>
  )
}
