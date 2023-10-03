import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { Typography, Stepper, Step, StepLabel } from '@mui/material'

import HeroTemplate from "@@/templates/HeroTemplate"
import useAlerts from '@@/hooks/useAlerts'
import { SignCard, SignForm, OTPForm } from '@@/components'
import { signUp, userVerify } from '@@/store'

function SignUp() {
  const [step, setStep] = useState(0)
  const [otp, setOTP] = useState('')

  const [alerts, { setCreateAlert, setCreateErrorAlert }] = useAlerts()
  const { control, handleSubmit } = useForm({})
  const navigate = useNavigate()

  async function signup(data) {
    try {
      await signUp(data)
      setStep(1)
      setCreateAlert('User creation request succeeded', 'success')
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

  const STEPS = [
    <SignForm 
      control={ control }
      submitText="Sign Up"
      onSubmit={ handleSubmit(signup) }
    />,
    <OTPForm 
      otp={ otp }
      onChange={ onChangeHandler }
      onSubmit={ verify }
    />
  ]

  return (
    <HeroTemplate alerts={ alerts }>
      <SignCard
        title="Welcome!" 
        description="Create an account"
        footer={
          <Typography sx={{ textAlign: 'center' }}>
            Already have an account? <a href="/signin">Sign In</a>
          </Typography>
        }
      >
        <Stepper 
          activeStep={ step } 
          alternativeLabel
          sx={{ mb: 4 }}
        >
          {
            STEPS.map((_, i) => (
              <Step key={ i }>
                <StepLabel />
              </Step>
            ))
          }
        </Stepper>

        { STEPS[step] }
      </SignCard>
    </HeroTemplate>
  )
}

export default SignUp