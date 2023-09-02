import { useState, useEffect } from 'react'

import { 
  Grid,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import { MoreVert } from '@mui/icons-material'

import UserTemplate from "@@/templates/UserTemplate"
import { Pop, Loading } from '@@/components'
import { getProjectUserId } from '@@/store'
import useAlerts from '@@/hooks/useAlerts'
import { deleteProject as storeDeleteProject } from '@@/store'

function Account() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [projects, setProjects] = useState([])

  const [alerts, { setCreateAlert, setCreateErrorAlert }] = useAlerts()

  async function fetch() {
    try {
      setLoading(true)
      const projects = await getProjectUserId()
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

  function menuOpen(e, project) {
    setAnchorEl(e.currentTarget)
    setProject(project)
  }

  async function deleteProject() {
    try {
      await storeDeleteProject(project.id)
      setProject(null)

      await fetch()
      setCreateAlert(`Project (${project.title}) deleted`, 'success')
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  function menuClose() {
    setProject(null)
  }

  return (
    <>
      <UserTemplate alerts={ alerts }>
        <Grid container spacing={2}>

          {
            projects.length
            ? (
              projects.map(project => {
                return (
                  <Grid 
                    item 
                    key={ project.id }
                    xs={12} 
                    sm={6} 
                    md={4} 
                    lg={3}
                    sx={{ position: 'relative' }}
                  >
                    <Pop 
                      id={ project.id } 
                      title={ project.title } 
                      description={ project.description }
                      image={ project.image }
                      loaded
                    />
                    <IconButton 
                      sx={{ position: 'absolute', top: '1rem', right: 0 }}
                      onClick={ e => menuOpen(e, project) }
                    >
                      <MoreVert />
                    </IconButton>
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
                        There are currently no projects created
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

      <Menu 
        anchorEl={ anchorEl }
        open={ !!project }
        onClose={ menuClose }
      >
        <MenuItem onClick={ deleteProject }>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

export default Account