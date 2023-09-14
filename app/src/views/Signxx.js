import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { 
  Grid, 
  Typography,
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
  Button 
} from '@mui/material'

import Template from '@@/templates/Template'
import useAlerts from '@@/hooks/useAlerts'
import { Sign } from '@@/components'
import { signIn, signUp } from '@@/store'


function Signxx(props) {
  const type = props.type || ''

  const [open, setOpen] = useState(false)

  const [alerts, { setCreateAlert, setCreateErrorAlert }] = useAlerts()

  const { control, handleSubmit } = useForm({})
  const navigate = useNavigate()

  async function signin(data) {
    try {
      const { verified } = await signIn(data)
      if (verified) navigate('/')
      else setOpen(true)
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  async function signup(data) {
    try {
      await signUp(data)
      setCreateAlert('Your account has been registered.', 'success')
      setOpen(true)
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  function onDialogClose() {
    setOpen(false)
  }

  return (
    <Template alerts={ alerts }>
      <Grid container sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Grid item xs={12} md={6}>
          {
            type == 'in' && (
              <Sign control={ control } title="Hello!" description="sign into your account" submitText="Sign In" onSubmit={ handleSubmit(signin) }>
                <Typography sx={{ textAlign: 'center' }}>Dont't have an account? <a href="/signup">Sign Up</a></Typography>
              </Sign>
            )
          }
          {
            type == 'up' && (
              <Sign control={ control } title="Welcome!" description="Create an account" submitText="Sign Up" onSubmit={ handleSubmit(signup) }>
                <Typography sx={{ textAlign: 'center' }}>Already have an account? <a href="/signin">Sign In</a></Typography>
              </Sign>
            )
          }
        </Grid>
      </Grid>

      <Dialog open={ open }>
        <DialogTitle>Activate your account</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            An account confirmation email has been sent.
            Please click the confirmation URL in the confirmation email to activate your account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={ onDialogClose }>Close</Button>
        </DialogActions>
      </Dialog>
    </Template>
  )
}

export default Signxx