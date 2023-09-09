import { useState, useEffect } from 'react'

import { 
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  TextField,
  Button,
  FormControlLabel,
  Switch
} from '@mui/material'
import { MoreVert } from '@mui/icons-material'

import UserTemplate from "@@/templates/UserTemplate"
import { Pop, Loading } from '@@/components'
import { getProjectUserId } from '@@/store'
import useAlerts from '@@/hooks/useAlerts'
import { deleteProject as storeDeleteProject, updateProjectPublic } from '@@/store'

function Account() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState({})
  const [projects, setProjects] = useState([])
  const [deleteProjectTitle, setDeleteProjectTitle] = useState('')
  const [open, setOpen] = useState(false)

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

  async function _delete() {
    setOpen(true)
  }

  function inputDeleteProjectTitle(e) {
    setDeleteProjectTitle(e.target.value)
  }

  async function deleteProject() {
    try {
      await storeDeleteProject(project.id)
      setProject({})
      setOpen(false)

      await fetch()
      setCreateAlert(`Project (${project.title}) deleted`, 'success')
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  async function switchProjectPublic(e) {
    try {
      const is_public = e.target.checked
      await updateProjectPublic(project.id, is_public)
      setProject({ ...project, public: is_public })
      setProjects(projects.map(_project => ({ ..._project, public: _project.id == project.id ? is_public : _project.public })))
      setCreateAlert(`${is_public ? 'Publish' : 'UnPublish'} your project (${project.title})`, 'success')
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  function menuClose() {
    setProject({ public: project.public })
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
                      distance={ project.distance }
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
        open={ project.title }
        onClose={ menuClose }
      >
        <MenuItem>
          <FormControlLabel 
            label="Publish"
            control={
              <Switch 
                checked={ project.public }
                onChange={ switchProjectPublic }
              />
            }
          />
        </MenuItem>
        <MenuItem onClick={ _delete }>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>

      <Dialog open={ open } onClose={ () => setOpen(false) }>
        <DialogTitle>Delete a project?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Enter project title ({project?.title}) and tell me the delete button</DialogContentText>
          <TextField 
            variant="standard" 
            label="Title"
            placeholder={ project?.title }
            fullWidth
            required
            onChange={ inputDeleteProjectTitle }
          />
        </DialogContent>
        <DialogActions>
          <Button 
            disabled={ project?.title != deleteProjectTitle }
            onClick={ deleteProject }
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Account