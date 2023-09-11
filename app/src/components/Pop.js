import { Link } from "react-router-dom"

import { 
  Card, 
  CardActions, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button,
  Skeleton,
  Stack,
  Box
} from '@mui/material'
import { DirectionsWalk } from '@mui/icons-material'

function Pop(props) {
  const id = props.id
  const image = props.image || '/CCCCCC.png'
  const title = props.title || ''
  const description = props.description || ''
  const loaded = props.loaded || false
  const distance = props.distance || 0

  function meterToKiloMeter(m) {
    return Math.floor((m / 1000) * 10) / 10
  }

  function meterToEstimatedTime(m, speed = 4) {
    const speedMetersPerMinute = speed / 60  * 1000
    return (m / speedMetersPerMinute).toFixed(0)
  }

  return (
    <Card sx={{ winth: '100%' }}>
      {
        loaded
        ? (
          <CardMedia 
            image={ image } 
            sx={{ aspectRatio: '16/9' }} 
          />
        )
        : <Skeleton variant="rectangular" sx={{ width: '100%', height: 'auto', aspectRatio: '16/9' }} />
      }
      
      <CardContent>
        {
          loaded
          ? (
            <>
              <Typography 
                variant="h6" 
                component="div"
                sx={{ mb: 1 }}
              >
                { title }
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  height: ({ typography: { body2 } }) => `calc(${body2.lineHeight} * ${body2.fontSize} * 2)`,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden"
                }}
              >
                { description }
              </Typography>
            </>
          )
          : (
            <>
              <Skeleton sx={{ fontSize: theme => theme.typography.h6.fontSize }} />
              <Skeleton sx={{ fontSize: theme => theme.typography.body2.fontSize }} />
            </>
          )
        }
        
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Stack 
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: '100%' }}
        >
          {
            loaded
            ? (
              <>
                <Stack 
                  direction="row"
                  alignItems="center"
                >
                  <DirectionsWalk 
                    fontSize="small" 
                    sx={{ mr: 1, verticalAlign: 'middle' }}
                  /> 
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                    >
                      { meterToKiloMeter(distance) } km ({ meterToEstimatedTime(distance) } minutes)
                    </Typography>
                  </Box>
                </Stack>
                
                <Button variant="contained" component={ Link } to={ `/${id}` }>Try</Button>
              </>
            )
            : (
              <>
                <Skeleton sx={{ width: '75%', fontSize: theme => theme.typography.body2.fontSize }} />
                <Skeleton variant="rounded" sx={{ width: '60px', height: 'auto', aspectRatio: '16/9' }} />
              </>
            )
          }
        </Stack>

      </CardActions>
    </Card>
  )
}

export default Pop