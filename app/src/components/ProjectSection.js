import { Grid, Typography, Pagination, Box } from '@mui/material'

import { Pop, Loading as MUILoading } from '@@/components'

function ProjectSection(props) {
  const title = props.title
  const count = props.count
  const page = props.page
  const onChangePage = props.onChangePage || (() => {})
  const loading = props.loading ?? true
  const message = props.message || ''

  function GridItem(props) { 
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} { ...props }>
        { props.children }
      </Grid>
    )
  } 

  function Loading(props) {
    const { loading, message } = props

    return (
      <MUILoading
        loading={ loading }
        message={
          Message => (
            <Grid item xs={12}>
              <Message>{ message }</Message>
            </Grid>
          )
        }
      >
        <GridItem>
          <Pop />
        </GridItem>
      </MUILoading>
    )
  }

  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h6" sx={{ mb: 4 }}>
        { title }
      </Typography>
      
      <Grid container sx={{ gap: 2 }}>
        { 
          props.children(GridItem, Loading)
        }
      </Grid>
    </Box>
  )
}

export default ProjectSection