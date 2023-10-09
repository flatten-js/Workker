import { Paper, Typography, Button, Box, Stack } from '@mui/material'

import { Progress } from '@@/components'

function Charge(props) {
  const value = props.value || 0
  const max = 1
  const onClick = props.onClick || (() => {})

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Ticket</Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="end">
        <Typography variant="subtitle2">Charge</Typography>
        <Typography variant="subtitle2">
          <Typography 
            variant="h6"
            component="span"
            color={ value < max ? 'error' : 'default' }
          >
            {value}
          </Typography> / { Math.max(Math.ceil(value), max) }
        </Typography>
      </Stack>
      <Box sx={{ mb: 2 }}>
        <Progress 
          max={ max }
          value={ value % max }
        />
      </Box>
      <Stack direction="row" justifyContent="flex-end">
        <Button 
          variant="contained" 
          onClick={ onClick }
          disabled={ value < max }
        >
          Get
        </Button>
      </Stack>
    </Paper>
  )
}

export default Charge