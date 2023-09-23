import { ListItem, Paper, Stack, Typography, Skeleton } from '@mui/material'

function UnitListItem(props) {
  const title = props.title || ''
  const value = props.value || ''
  const onClick = props.onClick || (() => {})
  const loaded = props.loaded || false

  return (
    loaded
      ? (
        <ListItem 
          sx={{ p: 0, mb: 1 }} 
          button
          onClick={ onClick }
        >
          <Paper sx={{ width: '100%', p: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">{ title }</Typography>
              <Typography variant="subtitle2">{ value }</Typography>
            </Stack>
          </Paper>
        </ListItem>
      )
      : (
        <ListItem sx={{ p: 0, mb: 1 }} button>
          <Skeleton 
            variant="rounded" 
            sx={{ 
              p: 2, 
              width: '100%', 
              maxWidth: 'none'
            }}
          >
            &nbsp;
          </Skeleton>
        </ListItem>
      )
  )
}

export default UnitListItem