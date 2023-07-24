import axios from 'axios'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { 
  Grid, 
  AppBar, 
  Toolbar, 
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Box
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

import useAlerts from '@@/hooks/useAlerts'

import Layout from '@@/Layout'


function UserTemplate(props) {
  const { alerts } = props

  const [anchorEl, setAnchorEl] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [_alerts, { setCreateErrorAlert }] = useAlerts()

  const navigate = useNavigate()

  function menuOpen(e) {
    setAnchorEl(e.currentTarget)
    setIsMenuOpen(true)
  }

  function menuClose() {
    setIsMenuOpen(false)
  }

  function toAccount() {
    navigate('/account')
  }

  async function signout() {
    try {
      await axios.post('/auth/signout')
      navigate('/signin')
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  return (
    <Layout alerts={ alerts }>
      <Grid container spacing={4}>
        {/* Nav */}

        <Grid item xs={12}>
          <AppBar 
            position="sticky" 
            color="transparent" 
            elevation={0}
            sx={{ mb: 4 }}
          >
            <Toolbar sx={{ p: '0!important', display: 'flex', justifyContent: 'space-between' }}>
              <IconButton disabled>
                <MenuIcon />
              </IconButton>

              <Box>
                <Button 
                  variant="outlined"
                  color="black"
                  sx={{ textTransform: 'none', borderRadius: '99px' }}
                  onClick={ menuOpen }
                >
                  Developer
                </Button>
                <Menu
                  anchorEl={ anchorEl }
                  open={ isMenuOpen }
                  onClose={ menuClose }
                  PaperProps={{
                    sx: {
                      overflow: 'visible',
                      mt: 1.5,
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                >
                  <MenuItem onClick={ toAccount }>
                    Account
                  </MenuItem>
                  <Divider  />
                  <MenuItem onClick={ signout }>
                    Sign Out
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </AppBar>

          { props.children }
        </Grid>
      </Grid>    
    </Layout>
  )
}

UserTemplate.propTypes = {
  alerts: PropTypes.array
}

UserTemplate.defaultProps = {
  alerts: []
}

export default UserTemplate