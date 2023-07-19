import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { 
  Grid, 
  Paper, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  Skeleton
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Layout from "@@/Layout"
import { Map, Stamp, setCreateAlert as _setCreateAlert } from '@@/components'
import { getProject, getMarkers, createStamp } from '@@/store'

let mounted = false
function Pilgrimage() {
  const { id: project_id } = useParams() 

  const [alerts, setAlerts] = useState([])
  const [project, setProject] = useState({})
  const [markers, setMarkers] = useState([])
  const [position, setPosition] = useState(null)
  const [dialog, setDialog] = useState({})

  const theme = useTheme()

  const setCreateAlert = _setCreateAlert.bind(this, [alerts, setAlerts])
  
  function onAlerted(id) {
    setAlerts(alerts.filter(alert => alert.id != id))
  }
  
  async function fetch() {
    try {
      const project = await getProject(project_id)
      const markers = await getMarkers(project_id)
      setProject(project)
      setMarkers(markers)
    } catch (e) {
      setCreateAlert('Failed to load data.')
    }
  }

  async function onMounted() {
    mounted = true

    await fetch()

    setTimeout(function run() {
      navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords
        setPosition([latitude, longitude])
      }, err => {
        setCreateAlert(err.message)
        setTimeout(run, 2500)
      })
    }, 0)
  }

  useEffect(() => {
    if (!mounted) onMounted()
  }, [])

  function onDialogClose() {
    setDialog({})
  }

  function calculateDistance(marker_position, current_position) {
    const [lat1, lng1] = marker_position
    const [lat2, lng2] = current_position

    const R = 6371e3; // 地球の半径（メートル）
    const φ1 = (lat1 * Math.PI) / 180 // 緯度1をラジアンに変換
    const φ2 = (lat2 * Math.PI) / 180 // 緯度2をラジアンに変換
    const Δφ = ((lat2 - lat1) * Math.PI) / 180 // 緯度の差をラジアンに変換
    const Δλ = ((lng2 - lng1) * Math.PI) / 180 // 経度の差をラジアンに変換
  
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
    const distance = R * c // メートルでの距離を計算
    return distance
  }

  async function onStampPushHandler(id) {
    if (!position) return
    
    const marker = markers.find(marker => marker.id == id)
    if (marker.Stamps.length) return

    const isSuccess = calculateDistance(marker.position, position) <= (marker.radius || project.radius)
    if (isSuccess) {
      try {
        await createStamp(marker.id, 1)
        marker.Stamps = [{}]; setMarkers(markers)
        setDialog(marker)
      } catch (e) {
        setCreateAlert('Failed to save the acquired stamp.')
      }
    } else {
      setCreateAlert('Failed to acquire stamp.', 'warning')
    }
  }

  return (
    <Layout alerts={ alerts } onAlerted={ onAlerted }>
      <Grid container sx={{ height: '100vh' }}>
        <Paper sx={{ width: '100%', minHeight: '100%', p: 4 }}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid item sm={12} md={6} sx={{ width: '100%', minHeight: '50vh' }}>
              <Map loaded={ markers.length } location={ position } markers={ markers } radius={ project.radius } />              
            </Grid>
            <Grid item sm={12} md={6} sx={{ width: '100%' }}>
              <Grid container>
                <Grid item xs={12} sx={{ width: '100%', mb: 2 }}>
                  {
                    markers.length
                    ? <Typography variant="h5" component="div" align="center">Stamps: {markers.filter(marker => marker.Stamps.length).length}/{markers.length}</Typography>
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
                            icon={ marker.stamp_icon } 
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
          <DialogContentText sx={{ textAlign: 'center' }}>{ dialog.title }</DialogContentText>
        </DialogContent> 
        <DialogActions>
          <Button onClick={ onDialogClose }>OK</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default Pilgrimage