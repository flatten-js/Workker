import { ListItem, Stack, Typography } from '@mui/material'

function ListItemDetail(props) {
  const name = props.name
  const href = props.href
  let value = props.value || ''

  function formatText(text) {
    return text.length > 13 ? `${text.slice(0, 6)}...${text.slice(-4)}` : text
  }

  value = formatText(value)

  return (
    <ListItem>
      <Stack 
        direction="row" 
        justifyContent="space-between"
        sx={{ width: '100%' }}
      >
        <Typography variant="subtitle2">{ name }</Typography> 
        <Typography variant="body2">
          {
            href
            ? (
              <a href={ href } target="_blank">{ value }</a>
            )
            : (
              value
            )
          }
        </Typography>
      </Stack>
    </ListItem>
  )
}

export default ListItemDetail