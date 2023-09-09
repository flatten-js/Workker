import { useState, useEffect } from 'react'

import {
  Grid, 
  Paper,
  List,
  ListSubheader,
  ListItem,
  Button,
  Typography,
  Divider,
  Box
} from '@mui/material'

import UserTemplate from "@@/templates/UserTemplate"
import useAlerts from '@@/hooks/useAlerts'
import { Loading, Package } from '@@/components'
import { getPackages, exchange as _exchange, getUser } from '@@/store'

function Exchange() {
  const [user, setUser] = useState({})
  const [packages, setPackages] = useState([])
  const [exchanging, setExchanging] = useState(false)

  const [alerts, { setCreateAlert }] = useAlerts()

  async function updateUser() {
    try {
      const user = await getUser()
      setUser(user)
    } catch (e) {
      setCreateAlert('Failed to load data.')
    }
  }

  async function fetch() {
    try {
      const packages = await getPackages()
      const user = await getUser()
      setPackages(packages)
      setUser(user)
    } catch (e) {
      setCreateAlert('Failed to load data.')
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

    await updateUser()
  }

  return (
    <UserTemplate alerts={ alerts }>
      <Grid container>
        <Grid item xs={12}>          
          <Paper>
            <Box sx={{ p: 4  }}>

              <Typography variant="h6">
                Your Ticket: { user.ticket }
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 4  }}>
              <List subheader={ <ListSubheader>Packages</ListSubheader> }>
                {
                  packages.length
                  ? (
                    packages.map(_package => (
                      <ListItem key={ _package.id }>
                        <Package 
                          name={ _package.name }
                          description={ _package.description }
                          max={ _package.supply.max }
                          value={ _package.supply.total }
                          onExchange={ () => exchange(_package.id) }
                        />
                        <Divider />
                      </ListItem>
                    ))
                  )
                  : (
                    <ListItem>
                      <Loading 
                        loading={ !!packages.length } 
                        message="No publicly available packages available for exchange" 
                      />
                    </ListItem>
                  )
                }
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </UserTemplate>
  )
}

export default Exchange