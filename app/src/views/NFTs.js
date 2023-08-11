import { useState, useEffect } from 'react'

import { Grid } from '@mui/material'

import UserTemplate from '@@/templates/UserTemplate'
import useAlerts from '@@/hooks/useAlerts'
import { NFT } from '@@/components'
import { getOwnNFTs, reveal } from '@@/store'

function Collections() {
  const [nfts, setNFTs] = useState([])
  const [revealing, setRevealing] = useState(false)

  const [alerts, { setCreateAlert }] = useAlerts()

  async function updateNFTs() {
    try {
      const nfts = await getOwnNFTs()
      setNFTs(nfts) 
    } catch (e) {
      setCreateAlert('Failed to load data.')
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
                  loaded
                />
              </Grid>
            ))
          )
          : (
            <Grid item xs={6} sm={4} md={2}>
              <NFT />
            </Grid>
          )
        }
      </Grid>
    </UserTemplate>
  )
}

export default Collections