import { Grid, TextField } from '@mui/material'

import { StandardForm, FormItem } from '@@/components'

function SignForm(props) {
  const control = props.control
  const submitText = props.submitText
  const onSubmit = props.onSubmit || (() => {})

  return (
    <StandardForm 
      submitText={ submitText }
      onSubmit={ onSubmit }
    >
      <Grid item xs={10}>
        <FormItem 
          name="email" 
          control={ control } 
          rules={{
            'required': 'Please enter your email address',
            validate: {
              matchPattern: v => /^[\w-+.!#$%&'*/=?^`{|}~]+@[\w-]+(\.[\w-]+)+$/.test(v) || 'Email address must be a valid address'
            }
          }}
        >
          <TextField 
            variant="standard" 
            label="Email"
            fullWidth
            required
          />
        </FormItem>
      </Grid>
      <Grid item xs={10} sx={{ mb: 2 }}>
        <FormItem
          name="password"
          control={ control }
          rules={{
            required: 'Please enter your password'
          }}
        >
          <TextField 
            variant="standard" 
            label="Password" 
            type="password"
            fullWidth 
            required
          />
        </FormItem>
      </Grid>
    </StandardForm>
  )
}

export default SignForm