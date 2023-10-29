import { Grid } from '@mui/material'

function GridRow(props) {
  const sx = props.sx || {}

  return (
    <Grid 
      { ...props }
      container
      sx={{
        gap: 2,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        overflowX: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '::-webkit-scrollbar': {
          display: 'none'
        },
        ...sx
      }}
    >
      { props.children }
    </Grid>
  )
}

export default GridRow