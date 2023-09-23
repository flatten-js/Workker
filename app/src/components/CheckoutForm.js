import { useState } from 'react'

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

import { Stack, Button } from '@mui/material'

function CheckoutForm(props) {
  const onError = props.onError || (() => {})
  const onSuccess = props.onSuccess || (() => {})

  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  async function onSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    let result
    try {
      setLoading(true)
      result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'https://localhost/shop'
        },
        redirect: 'if_required'
      })

      if (result.error) {
        onError(result)
      } else {
        onSuccess(result)
      }
    } catch (e) {
      onError(result, e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={ onSubmit }>
      <PaymentElement
        onReady={ () => setReady(true) }
      />
      <Stack direction="row" justifyContent="flex-end">
        <Button 
          type="submit" 
          variant="contained"
          sx={{ mt: 2 }}
          disabled={ !ready || loading }
        >
          Buy
        </Button>
      </Stack>
    </form>
  )
}

export default CheckoutForm