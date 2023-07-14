import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Container, Grid } from '@mui/material';

import { Alerts } from './components/Alerts';


const theme = createTheme({
  palette: {
    background: {
      default: '#f3f6f9'
    }
  }
})


function Layout(props) {
  const alerts = props.alerts || []
  const onAlerted = props.onAlerted || (() => {})

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <Container sx={{ height: '100vh', py: 2 }}>
        {props.children}

        <Grid container>
          <Grid item sm={ 12 } md={ 6 } sx={{ width: '100%', p: 1, position: 'fixed', bottom: 0, right: 0 }}>
            <Alerts alerts={ alerts } onAlerted={ onAlerted } />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default Layout