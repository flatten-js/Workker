import { useState, useEffect } from 'react'

import { Grid } from '@mui/material'

import UserTemplate from '@@/templates/UserTemplate'
import { Pop, Loading } from '@@/components'
import { getProjectAll } from '@@/store'
import useAlerts from '@@/hooks/useAlerts'


function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const [alerts, { setCreateAlert }] = useAlerts()

  async function fetch() {
    try {
      setLoading(true)
      const projects = await getProjectAll()
      setProjects(projects) 
    } catch (e) {
      setCreateAlert('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <>
      <UserTemplate alerts={ alerts }>
        <Grid container spacing={2}>
          {
            projects.length
            ? (
              projects.map(project => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={ project.id }>
                    <Pop 
                      id={ project.id } 
                      title={ project.title } 
                      description={ project.description }
                      image={ project.image }
                      loaded
                    />
                  </Grid>
                )
              })
            )
            : (
              <Loading
                loading={ loading }
                message={
                  Message => (
                    <Grid item xs={12}>
                      <Message center>
                        There are currently no publicly available projects
                      </Message>
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
      </UserTemplate>
    </>
  )
}

export default Home