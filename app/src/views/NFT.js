import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import { 
  Card, 
  CardMedia,
  Box,
  Typography,
  List,
  Skeleton,
  Grid
} from '@mui/material'

import UserTemplate from '@@/templates/UserTemplate'
import useAlerts from '@@/hooks/useAlerts'
import { ListItemDetail, Accordion } from "@@/components"
import { getOwnNFTs } from '@@/store'

function NFT() {
  const { id } = useParams() 

  const [nft, setNFT] = useState({})
  const [loading, setLoading] = useState(true)
  
  const [alerts, { setCreateAlert }] = useAlerts()

  async function fetch() {
    try {
      setLoading(true)
      const [nft] = await getOwnNFTs(id)
      if (nft.metadata) {
        setNFT(nft)
      } else {
        setCreateAlert('Failed to retrieve metadata')
      }
    } catch (e) {
      setCreateAlert('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <UserTemplate alerts={ alerts }>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            {
              !loading && nft.metadata
              ? (
                <>
                  <Typography variant="subtitle2" color="gray" sx={{ mb: 1 }}>{ nft.name }</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{ nft.metadata?.name ?? nft.name }</Typography>
                </>
              )
              : (
                <>
                  <Skeleton sx={{ 
                    width: '40%', 
                    maxWidth: 'none',
                    transform: 'none',
                    fontSize: theme => theme.typography.h6.fontSize,
                    mb: 1
                  }}>
                    &nbsp;
                  </Skeleton>
                  <Skeleton sx={{ 
                    width: '60%', 
                    maxWidth: 'none',
                    transform: 'none',
                    fontSize: theme => theme.typography.h5.fontSize
                  }}>
                    &nbsp;
                  </Skeleton>
                </>
              )
            }
          </Box>
          
          
          <Card sx={{ mb: 2 }}>
            {
              !loading && nft.metadata
              ? (
                <CardMedia 
                  image={ nft.metadata?.image }
                  sx={{ aspectRatio: '1/1' }}
                />
              )
              : (
                <Skeleton variant="rectangular" sx={{ width: '100%', height: 'auto', aspectRatio: '1/1' }} />
              )
            }
          </Card>
          
          <Box>
            {
              !loading && nft.metadata
              ? (
                <>
                  <Accordion 
                    defaultExpanded={ true } 
                    title="Description"
                    loaded
                  >
                    <Typography variant="body2" color="gray">
                      { nft.metadata?.description ?? nft.description }
                    </Typography>
                  </Accordion>

                  <Accordion 
                    title="Properties"
                    loaded
                  >
                    <Typography variant="body2" color="gray">
                      No properties are set
                    </Typography>
                  </Accordion>

                  <Accordion 
                    defaultExpanded={ true } 
                    title="Details"
                    loaded
                  >
                    <List>
                      <ListItemDetail 
                        name="Contract Address"
                        href={ `https://mumbai.polygonscan.com/token/${nft.contract_address}` }
                        value={ nft.contract_address }
                      />
                      <ListItemDetail 
                        name="Token ID"
                        value={ nft.token_id }
                      />
                      <ListItemDetail 
                        name="Token Standard"
                        value="ERC721"
                      />
                      <ListItemDetail 
                        name="Chain"
                        value="Mumbai"
                      />
                    </List>
                  </Accordion>
                </>
              )
              : (
                <Accordion />
              )
            }
          </Box>
        </Grid>
      </Grid>
    </UserTemplate>
  )
}

export default NFT