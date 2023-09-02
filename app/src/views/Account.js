import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { 
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import { ScienceSharp, MoreVert } from '@mui/icons-material'

import UserTemplate from "@@/templates/UserTemplate"
import { Pop, FormItem, Loading } from '@@/components'
import { getProjectUserId, generateProject } from '@@/store'
import useAlerts from '@@/hooks/useAlerts'
import { deleteProject as storeDeleteProject } from '@@/store'

function Account() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [isGenerate, setIsGenerate] = useState(false)
  const [generating, setGenerating] = useState(false)

  const { control, handleSubmit, reset } = useForm({})

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

  async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        return resolve([latitude, longitude])
      }, reject)
    })
  }

  async function generate(data) {
    if (generating) return
    
    try {
      setGenerating(true)

      const location = await getCurrentPosition()
      await generateProject({ ...data, location: location.join(',') })
      await fetch()

      setCreateAlert('Generating has been completed.', 'success')
      reset()
    } catch (e) {
      setCreateErrorAlert(e)
    } finally {
      setGenerating(false)
    }
  }

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

      <Dialog open={ isGenerate } maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" alignItems="center">
            Generate 
            <ScienceSharp />
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Automatically assigns spots around the specified location and creates a new project.</DialogContentText>
          <Grid container sx={{ p: 2 }}>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <FormItem
                name="title" 
                control={ control } 
                rules={{
                  'required': 'Please enter a title for your project'
                }}
              >
                <TextField
                  variant="standard" 
                  label="Title"
                  defaultValue=""
                  fullWidth
                  required
                />
              </FormItem>
            </Grid>
            <Grid item xs={12}>
              <FormItem
                name="description" 
                control={ control }
              >
                <TextField 
                  variant="standard" 
                  label="Description"
                  defaultValue=""
                  multiline
                  rows={4}
                  fullWidth
                />
              </FormItem>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={ generating } onClick={ () => setIsGenerate(false) }>Cancel</Button>
          <Button disabled={ generating } onClick={ handleSubmit(generate) }>Generate</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Account