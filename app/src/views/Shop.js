import { useState, useEffect } from 'react'
import { 
  Grid, 
  Typography, 
  List,
  Drawer,
  Box
} from '@mui/material'

import UserTemplate from "@@/templates/UserTemplate"
import useAlerts from '@@/hooks/useAlerts'
import { 
  Loading, 
  UnitListItem, 
  Payment, 
  CheckoutForm,
  Charge 
} from '@@/components'
import { 
  getUser, 
  getShopItems, 
  paymentIntent,
  exchangeCharge
} from '@@/store'

function Shop() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({})
  const [items, setItems] = useState([])
  const [item, setItem] = useState({})
  const [open, setOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)

  const [alerts, { setCreateAlert }] = useAlerts()

  async function fetch() {
    try {
      setLoading(true)
      const user = await getUser()
      const items = await getShopItems()
      setItems(items)
      setUser(user)
    } catch (e) {
      setCreateAlert('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  async function openPayment(item) {
    try {
      const clientSecret = await paymentIntent(item.id)
      setItem(item)
      setClientSecret(clientSecret)
      setOpen(true)
    } catch (e) {
      setCreateAlert('Failed to initiate payment')
    }
  }

  function closePayment() {
    setOpen(false)
    setItem({})
  }

  function onPaymentError(result) {
    setCreateAlert('Payment was not received')
  }

  function onPaymentSuccess(result) {
    setCreateAlert('Payment has been received', 'success')
    closePayment()
  }

  function amount(amount) {
    return `¥ ${amount}`
  }

  async function charge() {
    try {
      await exchangeCharge()
      setCreateAlert('Successfully exchanged tickets', 'success')
    } catch (e) {
      setCreateAlert('Failed to exchange tickets')
    }

    const user = await getUser()
    setUser(user)
  }
 
  return (
    <UserTemplate alerts={ alerts }>
      <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
        Your Ticket: { user.ticket ?? '-' }
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Charge 
          value={ user.charge }
          onClick={ charge }
        />
      </Box>

      <Typography variant="subtitle2" color="gray">
        Ticket
      </Typography>
      <List>
        {
          items.length
          ? (
            items.map(item => (
              <UnitListItem 
                key={ item.title }
                title={ item.title } 
                value={ amount(item.amount) }
                onClick={ () => openPayment(item) }
                loaded
              />
            ))
          )
          : (
            <Loading 
              loading={ loading }
              message={
                Message => (
                  <Grid item xs={12}>
                    <Message center>
                      No items currently available for purchase
                    </Message>
                  </Grid>
                )
              }
            >
              <Grid item xs={6} sm={4} md={2}>
                <UnitListItem />
              </Grid> 
            </Loading>
          )
        }
      </List>

      <Drawer
        anchor="bottom"
        open={ open }
        onClose={ closePayment }
      >
        <Box sx={{ p: 2, backgroundColor: 'white' }}>
          <Grid container sx={{ mb: 4 }}>
            <Grid item xs={ 9 }>
              <Typography variant="h6">{ item.title }</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1 }}>{ item.description || 'No description for this item' }</Typography>
            </Grid>
            <Grid item xs={ 3 } sx={{ textAlign: 'right' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{ amount(item.amount) }</Typography>
            </Grid>
          </Grid>
          <Payment clientSecret={ clientSecret }>
            <CheckoutForm onError={ onPaymentError } onSuccess={ onPaymentSuccess } />
          </Payment>
        </Box>
      </Drawer>
    </UserTemplate>
  )
}

export default Shop