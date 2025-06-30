import type { PropsWithChildren } from 'react'

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="container mt-3">
      <h1>Domiciliación BBVA</h1>
      {children}
    </div>
  )
}
