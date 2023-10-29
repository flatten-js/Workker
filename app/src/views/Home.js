import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Grid, Pagination, Button } from '@mui/material'
import { ArrowRightAlt } from '@mui/icons-material'

import UserTemplate from '@@/templates/UserTemplate'
import { ProjectSection, Pop, GridRow } from '@@/components'
import { getProjectAll, getProjectAllCount, getProjectTrying } from '@@/store'
import useAlerts from '@@/hooks/useAlerts'


function Home() {
  const [projects, setProjects] = useState([])
  const [tryingProjects, setTryingProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(1)
  const [page, setPage] = useState(1)

  const [alerts, { setCreateAlert }] = useAlerts()

  async function fetch() {
    try {
      setLoading(true)
      const projects = await getProjectAll(page)
      const count = await getProjectAllCount()
      const tryingProjects = await getProjectTrying('home')
      setProjects(projects) 
      setCount(count)
      setTryingProjects(tryingProjects)
    } catch (e) {
      setCreateAlert('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    fetch()
  }, [page])

  return (
    <>
      <UserTemplate alerts={ alerts }>
        <ProjectSection title="Trying">
          {
            (GridItem, Loading) => (
              tryingProjects.length
                ? (
                  <>
                    <GridRow item container>
                      {
                        tryingProjects.map(project => {
                          return (
                            <GridItem
                              xs={11} 
                              sx={{ flexShrink: 0 }}
                              key={ project.id } 
                            >
                              <Pop 
                                id={ project.id } 
                                title={ project.title } 
                                description={ project.description }
                                image={ project.image }
                                distance={ project.distance }
                                loaded
                              />
                            </GridItem>
                          )
                        })
                      }
                    </GridRow>
                    <Button 
                      component={ Link }
                      to="/account"
                      endIcon={ <ArrowRightAlt /> }
                      sx={{ ml: 'auto' }}
                    >
                      More
                    </Button>
                  </>
                )
                : (
                  <Loading 
                    loading={ loading }
                    message="There are no projects currently trying" 
                  />
                )
            )
          }
        </ProjectSection>

        <ProjectSection title="New arrival">
          {
            (GridItem, Loading) => (
              projects.length
                ? (
                  <>
                    {
                      projects.map(project => (
                        <GridItem key={ project.id }>
                          <Pop 
                            id={ project.id } 
                            title={ project.title } 
                            description={ project.description }
                            image={ project.image }
                            distance={ project.distance }
                            loaded
                          />
                        </GridItem>
                      ))
                    }
                    {
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Pagination 
                          count={ count }
                          page={ page } 
                          shape="rounded"
                          onChange={ (_, value) => setPage(value) }
                        />
                      </Grid>
                    }
                  </>
                )
                : (
                  <Loading 
                    loading={ loading }
                    message="There are currently no publicly available projects"
                  />
                )
            )
          }
        </ProjectSection>
      </UserTemplate>
    </>
  )
}

export default Home