import type { PropsWithChildren } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface Props {
  title: string
  description?: string
}

export const ErrorMessage = ({
  title,
  description,
  children
}: PropsWithChildren<Props>) => {
  return (
    <Card className="max-w-md md:mx-auto m-4 gap-0">
      <CardHeader>
        <CardTitle className="font-bold text-xl w-full">{title}</CardTitle>
      </CardHeader>
      {(description || children) && (
        <CardContent>
          {description && <p>{description}</p>}
          {children}
        </CardContent>
      )}
    </Card>
  )
}
