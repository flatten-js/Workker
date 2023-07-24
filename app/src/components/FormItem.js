import React from 'react'
import { Controller } from 'react-hook-form'

function FormItem(props) {
  const name = props.name
  const control = props.control
  const rules = props.rules || {}

  return (
    <Controller
      name={ name }
      control={ control }
      rules={ rules }
      render={
        ({ field, formState: { errors } }) => (
          React.cloneElement(props.children, { 
            ...field, 
            error: !!errors[name], 
            helperText: errors[name]?.message || '' 
          })
        )
      }
    />
  )
}

export default FormItem