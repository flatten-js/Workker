import PropTypes from 'prop-types'

import { Typography } from '@mui/material'

function Message(props) {
  const sx = props.sx || {}
  const textAlign = props.center ? 'center' : 'start'

  return (
    <Typography variant="body2" color="gray" sx={{ ...sx, textAlign }}>
      { props.children }
    </Typography>
  )
}

function Loading(props) {
  const { loading, message } = props
  return (
    loading
      ? (
        props.children
      ) 
      : (
        typeof message == 'string'
          ? (
            <Message>{ message }</Message>
          )
          : (
            message(Message)
          )
      )
  )
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]).isRequired,
  children: PropTypes.any
}

Loading.defaultProps = {
  children: <></>
}

export default Loading