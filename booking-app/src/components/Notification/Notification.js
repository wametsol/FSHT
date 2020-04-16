import React, { useImperativeHandle, useState } from 'react'
import { Alert, Autocomplete } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import { Zoom } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
  centered: {
    position: 'fixed',
    marginTop: 10,
    marginLeft: '35%',
    marginRight: '35%',
    width: '30%',
    zIndex: 100,
    transitionDelay: '1000ms',
  },

  zoomStyles: {

  }
}))
const Notification = React.forwardRef((props, ref) => {
  const classes = useStyles()
  const message = props.message
  const type = props.type

  /*
  ------
  Tried to fix <Zoom> transition, which causes 'React strickmode warning'. Issue is with material ui. 
  
  Should be fixed in next Material-UI v5 in future.
  Maybe some other solution to go.
  ------
  const [isZoom, setIsZoom] = useState(true)

  const toggleZoom = () => {
    console.log('TOGGLE')
    setIsZoom(!isZoom)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleZoom
    }
  })
*/

  if (message === null) {
    return null
  }
  if (type == 'error') {
    return (
      <div className={classes.centered}>
        <Zoom in={true}>
          <Alert severity="error">
            {message}
          </Alert>
        </Zoom>
      </div>
    )
  }
  if (type == 'success') {
    return (

      <div className={classes.centered} >
        <Zoom in={true}>
          <Alert severity="success">
            {message}
          </Alert>
        </Zoom>
      </div>
    )
  }
})

export default Notification