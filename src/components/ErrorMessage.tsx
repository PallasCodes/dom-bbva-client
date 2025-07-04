import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface Props {
  title: string
  description?: string
}

export const ErrorMessage = ({ title, description }: Props) => {
  return (
    <Card className="max-w-2xl md:mx-auto m-4 gap-0">
      <CardHeader>
        <CardTitle className="font-bold text-xl w-full">{title}</CardTitle>
      </CardHeader>
      {description && (
        <CardContent>
          <p>{description}</p>
        </CardContent>
      )}
    </Card>
  )
}
