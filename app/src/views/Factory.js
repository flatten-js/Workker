import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { 
  Paper,
  Grid,
  List,
  ListItem,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  FormControlLabel,
  Checkbox,

} from '@mui/material'
import { EditLocationAlt, Delete } from '@mui/icons-material'

import UserTemplate from "@@/templates/UserTemplate"
import useAlerts from '@@/hooks/useAlerts'
import { Map, FormItem, Loading } from '@@/components'
import { createProject } from '@@/store'

let i = 0
function Factory() {
  const MAX_SIZE = 10

  const [allocate, setAllocate] = useState(false) 
  const [_default, setDefault] = useState({ radius: 20 })
  const [markers, setMarkers] = useState([])
  const [editMarker, setEditMarker] = useState({})
  const [loading, setLoading] = useState(false)

  const [alerts, { setCreateAlert }] = useAlerts()

  const { control: projectControl, handleSubmit: projectHandleSubmit } = useForm({})
  const { control: defaultControl, handleSubmit: defaultHandleSubmit } = useForm({ defaultValues: _default })
  const { control, handleSubmit, reset, setValue } = useForm({})

  async function currentPosition() {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude: lat, longitude: lon } = position.coords
        res({ lat, lon })
      }, rej, { timeout: 1000 * 2 })
    })
  }

  async function create(data) {
    try {
      setLoading(true)
      const position = await currentPosition()
      const _markers = markers.map(marker => {
        const [lat, lon] = marker.position.split(',')
        return { ...marker, position: { lat, lon } }
      })
      await createProject({ ...data, ..._default, position, markers: _markers, allocate })
      setCreateAlert('Successfully created project', 'success')
    } catch (e) {
      setCreateAlert('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  async function apply(data) {
    setDefault(data)
  }

  async function add(data) {
    data = { ...data, id: i++ }
    setMarkers([...markers, data])
    reset()
  }

  function setEdit(marker) {
    if (marker.id == editMarker?.id) {
      setEditMarker({})
      reset()
    } else {
      setEditMarker(marker)
      Object.entries(marker).forEach(([k,v]) => setValue(k, v))
    }
  }

  function edit(data) {
    const _markers = markers.map(marker => marker.id == editMarker.id ? data : marker)
    setMarkers(_markers)
    setEditMarker({})
    reset()
  }

  function deleteMarker(deleteMarker) {
    if (deleteMarker.id == editMarker.id) {
      setEditMarker({})
      reset()
    }
    const _markers = markers.filter(marker => marker.id != deleteMarker.id)
    setMarkers(_markers)
  }

  function CreateButton() {
    return (
      <Button 
        onClick={ projectHandleSubmit(create) }
        disabled={ loading || (!allocate && !markers.length) }
        sx={{ display: 'block', ml: 'auto' }}
      >
        Create
      </Button>
    )
  }

  return (
    <UserTemplate alerts={ alerts }>
      <Paper sx={{ width: '100%', minHeight: '100%', p: 4 }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          <Grid item sm={12} md={6} sx={{ width: '100%' }}>
            <Box sx={{ mb: 2, p: 2 }}>
              <Box sx={{ mb: 4 }}>
                <Typography>Allocates automatically the missing up to the maximum number of markers ({MAX_SIZE} markers)</Typography>
                <FormControlLabel 
                  control={ <Checkbox onChange={ e => setAllocate(e.target.checked) } /> } 
                  label="yes"
                />
              </Box>
  
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Project</Typography>
                <FormItem
                  name="title" 
                  control={ projectControl } 
                  rules={{
                    required: 'Please enter a title for your project'
                  }}
                  sx={{ mb: 2 }}
                >
                  <TextField
                    variant="standard" 
                    label="Title"
                    defaultValue=""
                    fullWidth
                    required
                  />
                </FormItem>
                <FormItem
                  name="description" 
                  control={ projectControl } 
                  sx={{ mb: 2 }}
                >
                  <TextField
                    variant="standard" 
                    label="Description"
                    defaultValue=""
                    fullWidth
                  />
                </FormItem>
                <CreateButton />
              </Box>
            
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Default</Typography>
                <FormItem
                  name="radius" 
                  control={ defaultControl } 
                  rules={{
                    required: 'Please enter a radius for your marker',
                    validate: v => !v || (v > 0 && v <= 50) || 'Only 1 to 50 can be entered'
                  }}
                  sx={{ mb: 2 }}
                >
                  <TextField
                    variant="standard" 
                    type="number"
                    label="Radius"
                    defaultValue=""
                    fullWidth
                    required
                  />
                </FormItem>
                <Button 
                  sx={{ display: 'block', ml: 'auto' }}
                  onClick={ defaultHandleSubmit(apply) }
                >
                  Apply
                </Button>
              </Box>

              <Box sx={{ mb: 4 }}>
                <FormItem
                  name="title" 
                  control={ control } 
                  rules={{
                    required: 'Please enter a title for your marker'
                  }}
                  sx={{ mb: 2 }}
                >
                  <TextField
                    variant="standard" 
                    label="Title"
                    defaultValue=""
                    fullWidth
                    required
                  />
                </FormItem>
                <FormItem
                  name="description" 
                  control={ control } 
                  sx={{ mb: 2 }}
                >
                  <TextField
                    variant="standard" 
                    label="Description"
                    defaultValue=""
                    fullWidth
                  />
                </FormItem>
                <FormItem
                  name="position" 
                  control={ control } 
                  rules={{
                    required: 'Please enter a potision for your marker',
                    validate: v => /-?[\d.]+,-?[\d.]+/.test(v) || 'Only lat,lng format'
                  }}
                  sx={{ mb: 2 }}
                >
                  <TextField
                    variant="standard" 
                    label="Position"
                    helperText="Format: lat,lng"
                    defaultValue=""
                    fullWidth
                    required
                  />
                </FormItem>
                <FormItem
                  name="radius" 
                  control={ control } 
                  rules={{
                    validate: async v => {
                      return !v || (v > 0 && v <= 50) || 'Only 1 to 50 can be entered'
                    }
                  }}
                >
                  <TextField
                    variant="standard"
                    type="number" 
                    label="Radius"
                    defaultValue=""
                    fullWidth
                  />
                </FormItem>
              </Box>
              
              {
                Object.keys(editMarker).length
                ? (
                  <Button 
                    color="success"
                    sx={{ display: 'block', ml: 'auto' }}
                    onClick={ handleSubmit(edit) }
                  >
                    Edit
                  </Button>
                )
                : (
                  <Button 
                    sx={{ display: 'block', ml: 'auto' }}
                    onClick={ handleSubmit(add) }
                    disabled={ markers.length >= MAX_SIZE }
                  >
                    Add
                  </Button>
                )
              }
              
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Markers</Typography>
            <Typography variant="h6" component="div" sx={{ textAlign: 'center', mb: 1 }}>
              { markers.length } <Typography variant="body2" component="span">/ { MAX_SIZE }</Typography>
            </Typography>
            <Loading 
              loading={ !!markers.length }
              message="No markers are currently added"
            >
              <List>
                {
                  markers.map(marker => (
                    <ListItem 
                      key={ marker.id }
                      color="success"
                      secondaryAction={
                        <>
                          <IconButton 
                            color={ editMarker?.id == marker.id ? 'success' : 'default' }
                            onClick={ () => setEdit(marker) }
                          >
                            <EditLocationAlt />
                          </IconButton>
                          <IconButton
                            onClick={ () => deleteMarker(marker) }
                          >
                            <Delete />
                          </IconButton>
                        </>
                      }
                    >
                      { marker.title }
                    </ListItem>
                  ))
                }
              </List>
            </Loading>
          </Grid>

          <Grid item sm={12} md={6} sx={{ width: '100%', minHeight: '50vh', mb: 2 }}>
            <Map _markers={ markers } radius={ _default.radius } loaded={ markers.length } />
          </Grid>
        </Grid>

        <CreateButton />
      </Paper>
    </UserTemplate>
  )
}

export default Factory