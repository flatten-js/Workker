import React from 'react'

import { Grid, TextField, Typography } from '@mui/material'
import OtpInput from 'react-otp-input'

import { StandardForm } from '@@/components'

function OTPForm(props) {
  const otp = props.otp || ''
  const onSubmit = props.onSubmit || (() => {})
  const onChange = props.onChange || (() => {})

  const numInputs = 6

  return (
    <StandardForm
      header={
        <Grid item xs={10}>
          <Typography variant="body2" color="gray">
            Please check your email and enter the verification code provided
          </Typography>
        </Grid>
      }
      submitText="Verify"
      onSubmit={ onSubmit }
      disabled={ otp.length != numInputs }
    >
      <Grid item xs={10} sx={{ mb: 2 }}>
        <OtpInput
          value={ otp }
          inputType="number"
          numInputs={ numInputs }
          renderInput={
            props => <TextField 
              sx={{ 
                'input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0
                }
              }}
              inputProps={props} 
            /> 
          }
          onChange={ onChange }
          inputStyle={{ 
            padding: '.75rem',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none'
          }}
          containerStyle={{ 
            width: '100%',
            justifyContent: 'space-evenly'
          }}
        />
      </Grid>
    </StandardForm>
  )
}

export default OTPForm