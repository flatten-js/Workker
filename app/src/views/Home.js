import { useState, useEffect } from 'react'

import { Grid } from '@mui/material'

import UserTemplate from '@@/templates/UserTemplate'
import { Pop } from '@@/components'
import { getProjectAll } from '@@/store'
import useAlerts from '@@/hooks/useAlerts'


let mounted = false
function Home() {
  const [projects, setProjects] = useState([])

  const [alerts, { setCreateAlert }] = useAlerts()

  async function fetch() {
    try {
      const projects = await getProjectAll()
      setProjects(projects) 
    } catch (e) {
      setCreateAlert('Failed to load data.')
    }
  }

  async function onMounted() {
    mounted = true
    await fetch()
  }

  useEffect(() => {
    if (!mounted) onMounted()
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
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Pop />
              </Grid>
            )
          }
        </Grid>
      </UserTemplate>
    </>
  )
}

export default Home