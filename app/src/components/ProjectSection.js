import { Grid, Typography, Pagination, Box } from '@mui/material'

import { Pop, Loading } from '@@/components'

function ProjectSection(props) {
  const title = props.title
  const projects = props.projects || []
  const count = props.count
  const page = props.page
  const onChangePage = props.onChangePage || (() => {})
  const loading = props.loading ?? true
  const message = props.message || ''

  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h6" sx={{ mb: 4 }}>
        { title }
      </Typography>
      
      <Grid container spacing={2}>
        {
          projects.length
          ? (
            <>
              {
                projects.map(project => {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={ project.id }>
                      <Pop 
                        id={ project.id } 
                        title={ project.title } 
                        description={ project.description }
                        image={ project.image }
                        distance={ project.distance }
                        loaded
                      />
                    </Grid>
                  )
                })
              }
              {
                (count && page) && (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Pagination 
                      count={ count }
                      page={ page } 
                      shape="rounded"
                      onChange={ onChangePage }
                    />
                  </Grid>
                )
              }
            </>
          )
          : (
            <Loading
              loading={ loading }
              message={
                Message => (
                  <Grid item xs={12}>
                    {
                      typeof message == 'string'
                      ? (
                        <Message>
                          { message }
                        </Message>
                      )
                      : (
                        message(Message)
                      )
                    }
                  </Grid>
                )
              }
            >
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Pop />
              </Grid>
            </Loading>
          )
        }
      </Grid>
    </Box>
  )
}

export default ProjectSection