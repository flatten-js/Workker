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
import { Loading } from '@@/components'
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
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="subtitle2">{ _package.name }</Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>{ _package.description }</Typography>
                          <Box sx={{ textAlign: 'right', mb: 2 }}>
                            <Button 
                              sx={{ ml: 'auto' }}
                              variant="outlined"
                              disabled={ _package.require_ticket > user.ticket || exchanging } 
                              onClick={ () => exchange(_package.id) }
                            >
                              Exchange
                            </Button>
                          </Box>
                          <Divider />
                        </Box>
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