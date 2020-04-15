import React from 'react'
import { Alert } from '@material-ui/lab'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  if (type=='error') {
    return (
      <Alert severity="error">
        {message}
      </Alert>
    )
  }
  if (type=='success'){
  return (
    <Alert severity="success">
      {message}
    </Alert>
  )}
}

export default Notification