import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  CardActionArea,
  Button,
  Skeleton,
  Box
} from '@mui/material'

function NFT(props) {
  const { loaded, name, metadata, onReveal, revealing, onClick } = props

  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea disabled={ !loaded } onClick={ onClick }>
        <Box sx={{ p: 1, pb: 0 }}>
          {
            loaded && metadata
            ? (
              <CardMedia 
                image={ metadata.image } 
                sx={{ aspectRatio: '1/1' }} 
              />
            )
            : (
              <Skeleton variant="rectangular" sx={{ width: '100%', height: 'auto', aspectRatio: '1/1' }} />
            )
          }
        </Box>
      
        <CardContent sx={{ pb: 1 }}>
          {
            loaded
            ? <Typography variant="subtitle2">{ metadata?.name || name }</Typography>
            : <Skeleton sx={{ fontSize: theme => theme.typography.body2.fontSize }} />
          }
          
        </CardContent>
      </CardActionArea>

      <CardActions>
        {
          loaded && metadata
          ? (
            metadata.revealed
            ? (
              <Button variant="outlined" sx={{ width: '100%' }} disabled>Revealed</Button>
            )
            : (
              <Button variant="outlined" sx={{ width: '100%' }} onClick={ onReveal } disabled={ revealing }>Reveal</Button>
            )
          )
          : (
            <Skeleton variant="rounded" sx={{ width: '100%', height: 'auto', aspectRatio: '4/1' }} />
          )
        }
      </CardActions>
    </Card>
  )
}

export default NFT