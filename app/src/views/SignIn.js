import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

import HeroTemplate from "@@/templates/HeroTemplate"
import useAlerts from '@@/hooks/useAlerts'
import { SignCard, SignForm, OTPForm } from '@@/components'
import { signIn, userVerify } from '@@/store'

function SignIn() {
  const [open, setOpen] = useState(false)
  const [otp, setOTP] = useState('')

  const [alerts, { setCreateAlert, setCreateErrorAlert }] = useAlerts()
  const { control, handleSubmit } = useForm({})
  const navigate = useNavigate()

  async function signin(data) {
    try {
      const { verified } = await signIn(data)
      if (verified) {
        navigate('/')
      } else {
        setOpen(true)
        setCreateAlert('User is not activated', 'warning')
      }
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  async function verify() {
    try {
      await userVerify(otp)
      navigate('/')
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  function onChangeHandler(otp) {
    setOTP(otp)
  }

  return (
    <HeroTemplate alerts={ alerts }>
      <SignCard
        title="Hello!" 
        description="sign into your account" 
        footer={
          <Typography sx={{ textAlign: 'center' }}>
            Dont't have an account? <a href="/signup">Sign Up</a>
          </Typography>
        }
      >
        <SignForm 
          control={ control }
          submitText="Sign In"
          onSubmit={ handleSubmit(signin) }
        />
      </SignCard>

      <Dialog open={ open } onClose={ () => setOpen(false) }>
        <DialogTitle sx={{ textAlign: 'center' }}>Activate</DialogTitle>
        <DialogContent>
          <OTPForm 
            otp={ otp }
            onChange={ onChangeHandler }
            onSubmit={ verify }
          />
        </DialogContent>
      </Dialog>
    </HeroTemplate>
  )
}

export default SignIn