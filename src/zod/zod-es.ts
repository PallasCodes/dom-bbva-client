import { ZodIssueCode, type ZodErrorMap } from 'zod'

export const zodEs = {
  string: {
    min: (min: number) => `Debe tener al menos ${min} caracteres`,
    max: (max: number) => `Debe tener como máximo ${max} caracteres`,
    length: (len: number) => `Debe tener exactamente ${len} caracteres`,
    nonempty: 'Este campo es obligatorio'
  },
  number: {
    min: (min: number) => `Debe ser como mínimo ${min}`
  },
  regex: {
    clabe: 'La CLABE debe iniciar con 012 y contener solo números',
    rfc: 'El RFC no es válido',
    curp: 'El CURP no es válido'
  }
}

export const errorMapEs: ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === 'undefined') {
        return { message: 'Este campo es obligatorio' }
      }
      return { message: 'Tipo de dato no válido' }

    case ZodIssueCode.invalid_string:
      if (issue.validation === 'regex') {
        return { message: 'Formato inválido' }
      }
      if (issue.validation === 'email') {
        return { message: 'Correo electrónico no válido' }
      }
      if (issue.validation === 'url') {
        return { message: 'URL no válida' }
      }
      if (issue.validation === 'uuid') {
        return { message: 'UUID no válido' }
      }
      return { message: 'Cadena inválida' }

    case ZodIssueCode.too_small:
      if (issue.type === 'string') {
        return { message: `Debe tener al menos ${issue.minimum} caracteres` }
      }
      if (issue.type === 'number') {
        return { message: `Debe ser como mínimo ${issue.minimum}` }
      }
      if (issue.type === 'array') {
        return { message: `Debe contener al menos ${issue.minimum} elementos` }
      }
      return { message: 'Valor demasiado pequeño' }

    case ZodIssueCode.too_big:
      if (issue.type === 'string') {
        return { message: `Debe tener como máximo ${issue.maximum} caracteres` }
      }
      if (issue.type === 'number') {
        return { message: `Debe ser como máximo ${issue.maximum}` }
      }
      if (issue.type === 'array') {
        return { message: `Debe contener como máximo ${issue.maximum} elementos` }
      }
      return { message: 'Valor demasiado grande' }

    case ZodIssueCode.invalid_enum_value:
      return { message: 'Valor no permitido' }

    case ZodIssueCode.invalid_literal:
      return { message: `Se esperaba el valor: ${JSON.stringify(issue.expected)}` }

    case ZodIssueCode.unrecognized_keys:
      return { message: `Llaves no reconocidas: ${issue.keys.join(', ')}` }

    case ZodIssueCode.invalid_union:
    case ZodIssueCode.invalid_union_discriminator:
      return { message: 'No coincide con ninguna de las opciones permitidas' }

    case ZodIssueCode.invalid_arguments:
    case ZodIssueCode.invalid_return_type:
      return { message: 'Tipo de función inválido' }

    case ZodIssueCode.not_multiple_of:
      return { message: `Debe ser múltiplo de ${issue.multipleOf}` }

    case ZodIssueCode.custom:
      return { message: issue.message || 'Valor inválido' }

    default:
      return { message: ctx.defaultError }
  }
}
