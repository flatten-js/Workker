import { Card, CardContent, Box, Typography, Grid } from '@mui/material'

function SignCard(props) {
  const title = props.title || ''
  const description = props.description || ''
  const footer = props.footer

  return (
    <Card>
      <CardContent sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{ title }</Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'normal', textAlign: 'center' }}>{ description }</Typography>
        </Box>

        { props.children }

        {
          footer && (
            <Grid container item xs={12} sx={{ alignItems: 'center', justifyContent: 'center', mt: 4 }}>
              { footer }
            </Grid>
          )
        }
      </CardContent>
    </Card>
  )
}

export default SignCard