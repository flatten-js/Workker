import { Grid } from '@mui/material'

import Template from './Template'

function HeroTemplate(props) {
  const { alerts } = props

  return (
    <Template alerts={ alerts }>
      <Grid container sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Grid item xs={12} md={6}>
          { props.children }
        </Grid>
      </Grid>
    </Template>
  )
}

export default HeroTemplate