import axios from 'axios'

import { useState, useEffect } from 'react'
import { Grid, Skeleton } from '@mui/material'

import Layout from '../Layout'
import Pop from '../components/Pop'
import { createAlert } from '../components/Alerts'

import { getProjectAll } from '../store'

let mounted = false
function Home() {
  const [projects, setProjects] = useState([])
  const [alerts, setAlerts] = useState([])

  function onAlerted(id) {
    setAlerts(alerts.filter(alert => alert.id != id))
  }

  async function fetch() {
    try {
      const projects = await getProjectAll()
      setProjects(projects) 
    } catch (e) {
      setAlerts([...alerts, createAlert('Failed to load data.')])
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
    <Layout alerts={ alerts } onAlerted={ onAlerted }>
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
    </Layout>
  )
}

export default Home