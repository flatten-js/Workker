import { Grid, Button } from '@mui/material'

function StandardForm(props) {
  const header = props.header || <></>
  const submitText = props.submitText
  const onSubmit = props.onSubmit || (() => {})
  const disabled = props.disabled || false

  return (
    <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
      { header }

      { props.children }

      <Grid item xs={12} sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          sx={{ display: 'block', margin: 'auto' }} 
          onClick={ onSubmit }
          disabled={ disabled }
        >
          { submitText }
        </Button>
      </Grid>
    </Grid>
  )
}

export default StandardForm