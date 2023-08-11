import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Skeleton,
  Box
} from '@mui/material'

function NFT(props) {
  const { loaded, name, metadata, onReveal, revealing } = props

  return (
    <Card sx={{ width: '100%' }}>
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
     
      <CardContent>
        {
          loaded
          ? <Typography variant="subtitle2">{ metadata?.name || name }</Typography>
          : <Skeleton  sx={{ fontSize: theme => theme.typography.body2.fontSize }} />
        }
        
      </CardContent>

      <CardActions sx={{ pt: 0 }}>
        {
          loaded
          ? (
            metadata?.revealed
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