import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  Container,
  Grid, 
  AppBar, 
  Toolbar, 
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Box,
  List,
  ListSubheader,
  Drawer
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

import Template from './Template'
import useAlerts from '@@/hooks/useAlerts'
import { ListLinkItem } from '@@/components'
import { signOut } from '@@/store'


function UserTemplate(props) {
  const { alerts } = props

  const [anchorEl, setAnchorEl] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNav, setIsNav] = useState(false)

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
      await signOut()
      navigate('/signin')
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  function switchNav() {
    setIsNav(!isNav)
  }

  const drawer = (
    <>
      <List subheader={ <ListSubheader>Navigations</ListSubheader> }>
        <ListLinkItem to="/">HOME</ListLinkItem>
        <ListLinkItem to="/factory">FACTORY</ListLinkItem>
        <ListLinkItem to="/shop">SHOP</ListLinkItem>
        <ListLinkItem to="/exchange">EXCHANGE</ListLinkItem>
        <ListLinkItem to="/nfts">NFTS</ListLinkItem>
      </List>
    </>
  )

  return (
    <Template manual alerts={ alerts }>
      <Grid container>
        <Drawer
          variant="temporary"
          open={ isNav }
          onClose={ switchNav }
          ModalProps={{ keepMounted: true }}
          sx={{ 
            display: { xs: 'block', lg: 'none' },
            width: '55vw',
            '& .MuiDrawer-paper': { position: 'static', width: '100%', height: '100vh' }
          }}
        >
          { drawer }
        </Drawer>

        <Grid item xs={2} sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Drawer
            variant="permanent"
            open
            sx={{
              position: 'sticky', 
              top: 0, 
              '& .MuiDrawer-paper': { position: 'static', width: '100%', height: '100vh' }
            }}
          >
            { drawer }
          </Drawer>
        </Grid>
        
        <Grid item xs={12} lg={10} sx={{ px: 2, py: 1 }}>
          <AppBar 
            position="sticky" 
            color="transparent" 
            elevation={0}
            sx={{ mb: 4 }}
          >
            <Toolbar sx={{ p: '0!important', display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <IconButton 
                  sx={{ display: { xs: 'block', lg: 'none' } }} 
                  onClick={ switchNav }
                >
                  <MenuIcon />
                </IconButton>
              </Box>

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

          
          <Container sx={{
            py: 2,
            '.MuiGrid-root': {
              height: 'auto'
            } 
          }}>
            { props.children }
          </Container>
        </Grid>
      </Grid>    
    </Template>
  )
}

UserTemplate.propTypes = {
  alerts: PropTypes.array
}

UserTemplate.defaultProps = {
  alerts: []
}

export default UserTemplate