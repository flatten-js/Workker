import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { 
  Grid, 
  Paper, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Skeleton
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import UserTemplate from "@@/templates/UserTemplate"
import { Map, Stamp } from '@@/components'
import { getProject, getMarkers, createStamp, reportProject, getReported } from '@@/store'
import useAlerts from '@@/hooks/useAlerts'

function Project() {
  const { id: project_id } = useParams() 

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState({})
  const [markers, setMarkers] = useState([])
  const [reported, setReported] = useState(false)
  const [position, setPosition] = useState(null)
  const [reporting, setReporting] = useState(false)
  const [dialog, setDialog] = useState({})

  const [alerts, { setCreateAlert, setCreateErrorAlert }] = useAlerts()

  const theme = useTheme()
  
  async function fetch() {
    try {
      setLoading(true)
      const project = await getProject(project_id)
      if (project) {
        const markers = await getMarkers(project_id)
        const reported = await getReported(project_id)
        setProject(project)
        setMarkers(markers)
        setReported(reported)
      } else {
        setCreateAlert('This project does not exist')
      }
    } catch (e) {
      setCreateAlert('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  async function onMounted() {
    await fetch()
  }

  useEffect(() => {
    onMounted()
    const id = navigator.geolocation.watchPosition(position => {
      const { latitude: lat, longitude: lon } = position.coords
      setPosition({ lat, lon })
    }, err => {
      setCreateAlert(err.message)
    })
    return () => navigator.geolocation.clearWatch(id)
  }, [])

  function onDialogClose() {
    setDialog({})
  }

  async function onStampPushHandler(id) {
    if (!position) return
    
    const marker = markers.find(marker => marker.id == id)
    if (marker.Stamps.length) return

    try {
      const acquired = await createStamp(marker.id, position)
      if (acquired) {
        marker.Stamps = [{}]; setMarkers(markers)
        setDialog(marker)
      } else {
        setCreateAlert('Failed to acquire stamp.', 'warning')
      }
    } catch (e) {
      setCreateAlert('Failed to save the acquired stamp.')
    }
  }

  async function report() {
    try {
      setReporting(true)
      await reportProject(project_id)
      setReported(true)
      setCreateAlert('Report successfully reported', 'success')
    } catch (e) {
      setCreateErrorAlert(e)
    } finally {
      setReporting(false)
    }
  }

  return (
    <UserTemplate alerts={ alerts }>
      <Grid container sx={{ height: '100vh' }}>
        <Paper sx={{ width: '100%', minHeight: '100%', p: 4 }}>
          {
            reported
            ? (
              <Button 
                variant="outlined" 
                sx={{ display: 'block', mb: 2, ml: 'auto' }}
                disabled
              >
                Reported
              </Button>
            )
            : (
              <Button 
                variant="outlined" 
                sx={{ display: 'block', mb: 2, ml: 'auto' }}
                disabled={ loading || reporting || !markers.every(marker => marker.Stamps.length) }
                onClick={ report }
              >
                Report
              </Button>
            )
          }
          
          <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid item sm={12} md={6} sx={{ width: '100%', minHeight: '50vh' }}>
              <Map loaded={ markers.length } position={ position } markers={ markers } radius={ project.radius } />              
            </Grid>
            <Grid item sm={12} md={6} sx={{ width: '100%' }}>
              <Grid container>
                <Grid item xs={12} sx={{ width: '100%', mb: 2 }}>
                  {
                    markers.length
                    ? (
                      <Typography variant="h5" component="div" align="center">
                        {markers.filter(marker => marker.Stamps.length).length} <Typography variant="h6" component="span">/ {markers.length}</Typography>
                      </Typography>
                    )
                    : <Skeleton sx={{ fontSize: theme.typography.h5.fontSize }} />
                  }
                  
                </Grid>

                {
                  markers.length
                  ? (
                    markers.map(marker => {
                      return (
                        <Grid item xs={4} sm={3} key={ marker.id }>
                          <Stamp 
                            title={ marker.title } 
                            icon={ marker.image } 
                            success={ !!marker.Stamps.length }
                            onStampPush={ () => onStampPushHandler(marker.id) }
                            loaded
                          />
                        </Grid>
                      )
                    })
                  )
                  : (
                    <Grid item xs={4} sm={3}>
                      <Stamp />
                    </Grid>
                  )
                }
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Dialog open={ !!Object.keys(dialog).length }>
        <DialogTitle>Get a stamp!</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>{ dialog.title }</Typography>
        </DialogContent> 
        <DialogActions>
          <Button onClick={ onDialogClose }>OK</Button>
        </DialogActions>
      </Dialog>
    </UserTemplate>
  )
}

export default Project