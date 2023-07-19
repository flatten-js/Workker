import axios from 'axios'

import { useState, useEffect, useRef } from 'react'
import { 
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Stack
} from '@mui/material'
import { ScienceSharp } from '@mui/icons-material'

import Layout from '@@/Layout'
import { setCreateAlert as _setCreateAlert, Pop } from '@@/components'
import { getProjectAll } from '@@/store'

let mounted = false
function Home() {
  const inputRef = useRef(null)

  const [projects, setProjects] = useState([])
  const [alerts, setAlerts] = useState([])
  const [isGenerate, setIsGenerate] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [inputError, setInputError] = useState(true)
  const [project, setProject] = useState({})

  const setCreateAlert = _setCreateAlert.bind(this, [alerts, setAlerts])

  function onAlerted(id) {
    setAlerts(alerts.filter(alert => alert.id != id))
  }

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

  async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        return resolve([latitude, longitude])
      }, reject)
    })
  }

  async function generate() {
    if (generating) return
    
    try {
      setGenerating(true)

      const location = await getCurrentPosition()
      await axios.post('/api/project/generate', { ...project, location: location.join(',') })
      await fetch()

      setProject({})
      setIsGenerate(false)
      setCreateAlert('Generating has been completed.', 'success')
    } catch (e) {
      if (e.name == 'AxiosError') {
        setCreateAlert(e.response?.data || e.message)
      } else {
        setCreateAlert(e.message)
      }
    } finally {
      setGenerating(false)
    }
  }

  function inputChange(e) {
    setInputError(!inputRef.current.validity.valid)
    setProject({ ...project, title: e.target.value })
  }

  return (
    <Layout alerts={ alerts } onAlerted={ onAlerted }>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'right' }}>
          <Button variant="outlined" onClick={ () => setIsGenerate(true) }>Generate</Button>
        </Grid>

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

      <Dialog open={ isGenerate } maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" alignItems="center">
            Generate 
            <ScienceSharp />
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>(Rate limits are set for this API)</DialogContentText>
          <DialogContentText>Automatically assigns spots around the specified location and creates a new project.</DialogContentText>
          <Grid container sx={{ p: 2 }}>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <TextField 
                error={ inputError }
                inputProps={{ required: true }}
                inputRef={ inputRef }
                variant="standard" 
                label="Title"
                value={ project.title }
                required
                helperText={ inputRef?.current?.validationMessage }
                fullWidth
                onChange={ inputChange }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                variant="standard" 
                label="Description"
                value={ project.description }
                multiline
                rows={4}
                fullWidth
                onChange={ e => setProject({ ...project, description: e.target.value }) }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={ generating } onClick={ () => setIsGenerate(false) }>Cancel</Button>
          <Button disabled={ inputError || generating } onClick={ generate }>Generate</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default Home