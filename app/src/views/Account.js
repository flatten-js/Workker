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
  DialogActions, 
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Chip,
  Stack,
  Divider
} from '@mui/material'
import { MoreVert } from '@mui/icons-material'

import UserTemplate from "@@/templates/UserTemplate"
import { Pop, Loading } from '@@/components'
import useAlerts from '@@/hooks/useAlerts'
import {
  getProjectMy,
  getProjectTrying,
  getProjectReported,
  deleteProject, 
  dropProject,
  updateProjectPublic 
} from '@@/store'

function Account() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState({})
  const [projects, setProjects] = useState([])
  const [deleteProjectTitle, setDeleteProjectTitle] = useState('')
  const [dialog, setDialog] = useState(false)
  const [tab, setTab] = useState(0)

  const [alerts, { setCreateAlert, setCreateErrorAlert }] = useAlerts()

  const MENU_DELETE = 'delete'
  const MENU_DROP = 'drop'
  const MENU_PUBLIC = 'public'

  const DIALOGS = {
    [MENU_DELETE]: (
      <>
        <DialogTitle>Delete a project?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>Enter project title ({project?.title}) and tell me the delete button</Typography>
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
            onClick={ onDeleteProject }
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </>
    ),
    [MENU_DROP]: (
      <>
        <DialogTitle>Drop a project?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Dropping will result in loss of progress on this project. Do you really want to drop the project?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={ onDropProject }
            color="error"
          >
            Drop
          </Button>
        </DialogActions>
      </>
    )
  }

  const MENUS = [
    {
      label: MENU_PUBLIC,
      Item: props => (
        <MenuItem>
          <FormControlLabel 
            label="Publish"
            control={
              <Switch 
                checked={ project.public }
                onChange={ onSwitchProjectPublic }
              />
            }
          />
        </MenuItem>
      )
    },
    { 
      label: MENU_DELETE,
      Item: props => (
        <MenuItem onClick={ () => setDialog(MENU_DELETE) }>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      )
    },
    {
      label: MENU_DROP,
      Item: props => (
        <MenuItem onClick={ () => setDialog(MENU_DROP) }>
          <Typography color="error">Drop</Typography>
        </MenuItem>
      )
    }
  ]

  const TABS = [
    { 
      menus: [MENU_PUBLIC, MENU_DELETE], 
      label: 'All', 
      get: getProjectMy 
    },
    { 
      menus: [MENU_PUBLIC, MENU_DELETE], 
      label: 'Public', 
      get: async () => getProjectMy({ public: true }) 
    },
    {
      menus: [MENU_PUBLIC, MENU_DELETE],
      label: 'Private', 
      get: async () => getProjectMy({ public: false }) 
    },
    '-',
    { 
      menus: [MENU_DROP],
      label: 'Trying', 
      get: getProjectTrying 
    },
    { 
      label: 'Reported', 
      get: getProjectReported 
    }
  ]

  function changeTab(i) {
    setTab(i)
  }

  async function getProjects(tab) {
    try {
      setLoading(true)
      const projects = await TABS[tab].get()
      setProjects(projects)
    } catch (e) {
      setCreateAlert('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProjects(tab)
  }, [tab])

  function menuOpen(e, project) {
    setAnchorEl(e.currentTarget)
    setProject(project)
  }

  function menuClose() {
    setProject({ public: project.public })
  }

  function inputDeleteProjectTitle(e) {
    setDeleteProjectTitle(e.target.value)
  }

  async function onDeleteProject() {
    try {
      await deleteProject(project.id)
      const _projects = projects.filter(_project => _project.id != project.id)
      setProject({})
      setProjects(_projects)
      setDialog(false)


      setCreateAlert(`Project (${project.title}) deleted`, 'success')
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  async function onDropProject() {
    try {
      await dropProject(project.id)
      const _projects = projects.filter(_project => _project.id != project.id)
      setProject({})
      setProjects(_projects)
      setDialog(false)

      setCreateAlert(`Project (${project.title}) dropped`, 'success')
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  async function onSwitchProjectPublic(e) {
    try {
      const is_public = e.target.checked
      await updateProjectPublic(project.id, is_public)
      setProject({ public: is_public })
      const _projects = projects.filter(_project => _project.id != project.id)
      setProjects(_projects)
      setCreateAlert(`Successfully changed the publication status of project (${project.title})`, 'success')
    } catch (e) {
      setCreateErrorAlert(e)
    }
  }

  return (
    <>
      <UserTemplate alerts={ alerts }>
        <Stack  
          direction="row"
          spacing={ 1 }
          sx={{
            mb: 4,
            width: '100%',
            flexWrap: 'nowrap',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {
            TABS.map((TAB, i) => (
              TAB == '-'
                ? (
                  <Divider 
                    key={ i }
                    orientation="vertical" 
                    flexItem 
                  />
                )
                : (
                  <Chip 
                    key={ i }
                    label={ TAB.label } 
                    color={ i == tab ? 'primary' : 'default' }
                    onClick={ () => changeTab(i) }
                    sx={{ px: 1 }}
                  />
                )
            ))
          }
        </Stack>

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
                    {
                      TABS[tab].menus && (
                        <IconButton 
                          sx={{ position: 'absolute', top: '1rem', right: 0 }}
                          onClick={ e => menuOpen(e, project) }
                        >
                          <MoreVert />
                        </IconButton>
                      )
                    }
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

      {
        TABS[tab].menus && (
          <Menu 
            anchorEl={ anchorEl }
            open={ !!project.title }
            onClose={ menuClose }
          >
            {
              MENUS.map(MENU => (
                TABS[tab].menus?.includes(MENU.label) && (
                  <MENU.Item key={ MENU.label } />
                )
              ))
            }
          </Menu>
        )
      }

      <Dialog open={ !!dialog } onClose={ () => setDialog(false) }>
        { DIALOGS[dialog] }
      </Dialog>
    </>
  )
}

export default Account