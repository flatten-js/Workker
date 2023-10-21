import { Box, Stack, Typography, Button, Skeleton, CardMedia } from '@mui/material'

import { Progress } from '@@/components'

function Package(props) {
  const name = props.name
  const description = props.description || 'There is no description in this package'
  const image = props.image
  const ticket = props.ticket
  const max = parseInt(props.max) || 0
  const value = max - (parseInt(props.value) || 0)
  const disabled = props.disabled || false
  const onExchange = props.onExchange || (() => {})
  const loading = props.loading || false
  const loaded = props.loaded || false

  function lower_limit() {
    return value <= 0
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
          {
            loaded
            ? (
              <>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2">Limit</Typography>
                  <Typography variant="subtitle2">
                    <Typography 
                      variant="subtitle2" 
                      color={ lower_limit(value) ? 'error' : 'default' }
                      component="span"
                    >
                      {value}
                    </Typography> / {max}
                  </Typography>
                </Stack>
                <Progress max={ max } value={ value } />
              </>
            )
            : (
              <Skeleton variant="rectangular" sx={{ width: '100%' }} />
            )
          }
      </Box>
      
      <Box sx={{ mb: 4 }}>
        {
          loaded
          ? (
            <>
              <CardMedia 
                image={ image }
                sx={{ mb: 2, aspectRatio: '1/1' }}
              />
              <Typography variant="h6" component="div">{ name }</Typography>
              <Typography variant="body2" color="gray">{ description }</Typography>
            </>
          )
          : (
            <>
              <Skeleton variant="rectangular" sx={{  mb: 2, width: '100%', height: 'auto', aspectRatio: '1/1' }} />
              <Skeleton sx={{ width: '60%', fontSize: theme => theme.typography.h6.fontSize}} />
              <Skeleton sx={{ width: '80%', fontSize: theme => theme.typography.body2.fontSize }} />
            </>
          )
        }
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {
          loaded
          ? (
            <>
              <Typography variant="h6">
                { ticket } <Typography variant="subtitle2" component="span">Ticket</Typography>
              </Typography>
              <Button 
                variant="contained"
                disabled={ disabled || loading || lower_limit(value) }
                onClick={ onExchange }
              >
                Exchange
              </Button>
            </>
          )
          : (
            <>
              <Skeleton sx={{ width: '40%', fontSize: theme => theme.typography.h6.fontSize}} />
              <Skeleton variant="rounded" sx={{ width: '60px', height: 'auto', aspectRatio: '16/9' }} />
            </>
          )
        }
      </Stack>

    </Box>
  )
}

export default Package