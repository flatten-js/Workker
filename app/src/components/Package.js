import { Box, Stack, Typography, Button } from '@mui/material'

import { Progress } from '@@/components'

function Package(props) {
  const name = props.name
  const description = props.description || ''
  const max = parseInt(props.max) || 0
  const value = max - (parseInt(props.value) || 0)
  const onExchange = props.onExchange || (() => {})
  const loading = props.loading || false

  function lower_limit() {
    return value <= 0
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2">Limit</Typography>
          <Typography variant="subtitle2">
            {
              
            }
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
      </Box>
      
      <Typography variant="h6" component="div">{ name }</Typography>
      <Typography variant="body2" sx={{ mb: 4 }}>{ description }</Typography>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">
          1 <Typography variant="subtitle2" component="span">Ticket</Typography>
        </Typography>
        <Button 
          variant="outlined" 
          size="small"
          disabled={ loading || lower_limit(value) }
          onClick={ onExchange }
        >
          Exchange
        </Button>
      </Stack>

    </Box>
  )
}

export default Package