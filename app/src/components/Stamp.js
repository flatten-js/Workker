import { Box, Typography, Avatar, Skeleton } from '@mui/material'

function Stamp(props) {
  const title = props.title || ''
  const icon = props.icon || '/95CCFF.png'
  const success = props.success || false
  const onStampPush = props.onStampPush || (() => {})
  const loaded = props.loaded || false

  return (
    loaded
    ? (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        border: '.75px solid #E0E3E7'
      }}>
        <Box sx={{
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          p: 1, 
          borderBottom: '.75px solid #E0E3E7' 
        }}>
          <Typography 
            variant="caption" 
            component="div" 
            align="center"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden"
            }}
          >
            { title }
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Avatar 
            className={ success ? 'success' : '' } 
            sx={{ filter: 'grayscale(100%)', width: '100%', height: 'auto' }} 
            src={ icon } 
            onClick={ onStampPush }
          />
        </Box>
      </Box>
    )
    : (
      <Skeleton variant="rectangular" sx={{ width: '100%', height: 'auto', aspectRatio: '3/4' }} />
    )
  )
}

export default Stamp