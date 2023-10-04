import {
  Accordion as _Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Skeleton,
  Paper
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'

function Accordion(props) {
  const defaultExpanded = props.defaultExpanded || false
  const title = props.title
  const loaded = props.loaded || false

  return (
    loaded
      ? (
        <_Accordion defaultExpanded={ defaultExpanded }>
          <AccordionSummary expandIcon={ <ExpandMore /> }>
            <Typography variant="subtitle2">{ title }</Typography>
          </AccordionSummary>
          <AccordionDetails>
            { props.children }
          </AccordionDetails>
        </_Accordion>
      )
      : (
        <Paper>
          <Skeleton 
            variant="rectangular" 
            sx={{ 
              width: '100%', 
              height: 'auto', 
              aspectRatio: '16/9'
            }} 
          />
        </Paper>
      )
  )
}

export default Accordion