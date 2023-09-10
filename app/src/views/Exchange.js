import { useState, useEffect } from 'react'

import {
  Grid, 
  Paper,
  Typography
} from '@mui/material'

import UserTemplate from "@@/templates/UserTemplate"
import useAlerts from '@@/hooks/useAlerts'
import { Loading, Package } from '@@/components'
import { getPackages, exchange as _exchange, getUser } from '@@/store'

function Exchange() {
  const [user, setUser] = useState({})
  const [packages, setPackages] = useState([])
  const [exchanging, setExchanging] = useState(false)
  const [loading, setLoading] = useState(true)

  const [alerts, { setCreateAlert }] = useAlerts()

  async function fetch() {
    try {
      setLoading(true)
      const packages = await getPackages()
      const user = await getUser()
      setPackages(packages)
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

  async function exchange(package_id) {
    if (exchanging) return

    try {
      setExchanging(true)
      await _exchange(package_id)
      setCreateAlert('Successfully exchanged', 'success')
    } catch (e) {
      setCreateAlert('Exchange failed')
    } finally {
      setExchanging(false)
    }

    await fetch()
  }

  return (
    <UserTemplate alerts={ alerts }>
      <Grid container>
        <Grid item xs={12}>          
          <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
            Your Ticket: { user.ticket || '-' }
          </Typography>

          {
            packages.length
            ? (
              packages.map(_package => (
                <Paper sx={{ p: 4, mb: 2 }} key={ _package.id }>
                  <Package 
                    name={ _package.name }
                    description={ _package.description }
                    max={ _package.supply.max }
                    value={ _package.supply.total }
                    onExchange={ () => exchange(_package.id) }
                    loading={ exchanging }
                    loaded
                  />
                </Paper>
              ))
            )
            : (
              <Loading 
                loading={ loading } 
                message="No publicly available packages available for exchange" 
              >
                <Paper sx={{ p: 4 }}>
                  <Package />
                </Paper>
              </Loading>
            )
          }
        </Grid>
      </Grid>
    </UserTemplate>
  )
}

export default Exchange