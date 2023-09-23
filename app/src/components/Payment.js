import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripe = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

function Payment(props) {
  const clientSecret = props.clientSecret

  const options = { clientSecret, loader: 'always' }

  return (
    <Elements stripe={ stripe } options={ options }>
      { props.children }
    </Elements>
  )
}

export default Payment