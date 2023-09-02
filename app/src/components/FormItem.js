import React from 'react'
import { Controller } from 'react-hook-form'

function FormItem(props) {
  const name = props.name
  const control = props.control
  const rules = props.rules || {}
  const sx = props.sx || {}

  return (
    <Controller
      name={ name }
      control={ control }
      rules={ rules }
      defaultValue=""
      render={
        ({ field, formState: { errors } }) => {
          const _props = { ...field, sx, error: !!errors[name] }
          const error_message = errors[name]?.message
          if (error_message) _props['helperText'] = errors[name].message
          else delete _props['helperText']
          return React.cloneElement(props.children, _props)
        }
      }
    />
  )
}

export default FormItem