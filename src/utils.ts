export const dataURLtoBlob = (dataURL: string): Blob => {
  if (typeof dataURL !== 'string') {
    throw new Error('Not a string')
  }

  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}

const mxnFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
})

export const numberToCurrency = (amount: number): string => {
  if (typeof amount !== 'number') return ''

  return mxnFormatter.format(amount)
}

export const formatDate = (date: Date | string) => {
  try {
    const auxDate = typeof date === 'string' ? new Date(date) : date

    return auxDate.toLocaleDateString('es-MX')
  } catch (e) {
    return ''
  }
}
