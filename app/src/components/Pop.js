import { 
  Card, 
  CardActions, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button,
  Skeleton
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

function Pop(props) {
  const image = props.image || '/CCCCCC.png'
  const title = props.title || ''
  const description = props.description || 'There is no description for this project.'
  const try_path = `/${props.id}`
  const loaded = props.loaded || false

  const theme = useTheme()

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
              <Typography variant="h6" component="div">{ title }</Typography>
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
              <Skeleton sx={{ fontSize: theme.typography.h6.fontSize }} />
              <Skeleton sx={{ fontSize: theme.typography.body2.fontSize }} />
            </>
          )
        }
        
      </CardContent>
      <CardActions>
        {
          loaded
          ? (
            <Button href={ try_path }>Try</Button>
          )
          : <Skeleton variant="rounded" sx={{ width: '60px', height: 'auto', aspectRatio: '16/9' }} />
        }
        
      </CardActions>
    </Card>
  )
}

export default Pop