import { Grid, Card, Box, CardContent, Button, Typography, TextField } from '@mui/material'

import { FormItem } from '@@/components'

function Sign(props) {
  const control = props.control
  const title = props.title || ''
  const description = props.description || ''
  const submitText = props.submitText || ''
  const onSubmit = props.onSubmit || (() => {})

  return (
    <Card>
      <CardContent sx={{ py: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{ title }</Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'normal', textAlign: 'center' }}>{ description }</Typography>
        </Box>

        <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
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
                label="email" 
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
                label="password" 
                type="password" 
                fullWidth 
                required
              />
            </FormItem>
          </Grid>

          <Grid item xs={12} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="outlined" sx={{ display: 'block', margin: 'auto', mb: 2 }} onClick={ onSubmit }>{ submitText }</Button>
            { props.children }
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Sign