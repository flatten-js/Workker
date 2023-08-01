import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import { ListItem, ListItemText } from '@mui/material'

function ListLinkItem(props) {
  const { to } = props

  return (
    <ListItem>
      <ListItem 
        button 
        component={ Link } 
        to={ to } 
        selected={ to == window.location.pathname } 
        sx={{ borderRadius: '5px' }}
      >
        <ListItemText>{ props.children }</ListItemText>
      </ListItem>
    </ListItem>
  )
}

ListLinkItem.propTypes = {
  to: PropTypes.string.isRequired
}

export default ListLinkItem