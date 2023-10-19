import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Grid } from '@mui/material'

import UserTemplate from '@@/templates/UserTemplate'
import useAlerts from '@@/hooks/useAlerts'
import { NFT, Loading } from '@@/components'
import { getOwnNFTs, reveal } from '@@/store'

function NFTs() {
  const [nfts, setNFTs] = useState([])
  const [revealing, setRevealing] = useState(false)
  const [loading, setLoading] = useState(true)

  const [alerts, { setCreateAlert }] = useAlerts()
  const navigate = useNavigate()

  async function updateNFTs() {
    try {
      setLoading(true)
      const nfts = await getOwnNFTs()
      setNFTs(nfts)
    } catch (e) {
      setCreateAlert('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  async function fetch() {
    await updateNFTs()
  }

  useEffect(() => {
    fetch()
  }, [])

  async function onRevealHandler(nft) {
    if (revealing) return

    const { package_id, token_id } = nft
 
    try {
      setRevealing(true)
      await reveal(package_id, token_id)
      setCreateAlert('Successfully Reveal', 'success')
    } catch (e) {
      setCreateAlert('Reveal failed')
    } finally {
      setRevealing(false)
    }

    await updateNFTs()
  }

  function toNFT(package_id, token_id) {
    navigate(`/nfts/${package_id}/${token_id}`)
  }
  
  return (
    <UserTemplate alerts={ alerts }>
      <Grid container spacing={2}>
        {
          nfts.length
          ? (
            nfts.map((nft, i) => (
              <Grid item xs={6} sm={4} md={2} key={ i }>
                <NFT
                  name={ nft.name }
                  metadata={ nft.metadata }
                  onReveal={ () => onRevealHandler(nft) }
                  revealing={ revealing }
                  onClick={ () => toNFT(nft.package_id, nft.token_id) }
                  loaded
                />
              </Grid>
            ))
          )
          : (
            <Loading 
              loading={ loading }
              message={
                Message => (
                  <Grid item xs={12}>
                    <Message center>
                      No packages (NFT) currently owned
                    </Message>
                  </Grid>
                )
              }
            >
              <Grid item xs={6} sm={4} md={2}>
                <NFT />
              </Grid> 
            </Loading>
          )
        }
      </Grid>
    </UserTemplate>
  )
}

export default NFTs