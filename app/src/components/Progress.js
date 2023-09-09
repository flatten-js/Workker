import { LinearProgress  } from '@mui/material'

function Progress(props) {
  const max = props.max || 100
  const value = (props.value || 0) / max * 100

  return (
    <LinearProgress 
      variant="determinate"
      value={ value }
    />
  )
}

export default Progress