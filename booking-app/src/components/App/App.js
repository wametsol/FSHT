import React, {useEffect, useState} from 'react';
import './App.css';

import Login from '../Login/Login'
import Register from '../Register/Register'
import HomePage from '../Home/HomePage';
import Navigation from '../Navigation/Navigation'
import Notification from '../Notification/Notification'
import BookingAdminPage from '../BookingAdminPage/BookinAdminPage';
import NewBooker from '../NewBooker/NewBooker';
import BookingPage from '../BookingPage/BookingPage'

import {Switch,Route} from 'react-router-dom'

import {MuiThemeProvider,createMuiTheme} from '@material-ui/core/styles';
import {CssBaseline, CircularProgress} from '@material-ui/core';
import { auth } from '../../firebase'

const theme=createMuiTheme()

const isFBInitialized = () => {
  return new Promise(resolve => {
    auth.onAuthStateChanged(resolve)
  })
}
const centeredDiv = {
  textAlign: 'center'
}


const App = () => {
  const [fbInitialized, setfbInitialized] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  
  useEffect(() => {
    isFBInitialized().then(result => {
      setfbInitialized(result)
    })
  })

  const successMessageSetter = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000);
  }
  const errorMessageSetter = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000);
  }
  /*
  const notificationRef = React.createRef()
  ------
  Tried to fix <Zoom> transition, which causes 'React strickmode warning'. Issue is with material ui. 
  
  Should be fixed in next Material-UI v5 in future.
  Maybe some other solution to go.
  ------

  useEffect(() => {
    if(successMessage){
      notificationRef.current.toggleZoom()
    }
  })
  */

  const notification = () =>  (
    <div>
    <Notification message={errorMessage} type='error' />
    <Notification message={successMessage} type='success' />
    </div>
  )
  return fbInitialized!==false?(
    <div className="App">
      <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      {notification()}
      
      <div>
        <Switch>
          <Route exact path ='/login'>
          <Navigation/>
          <Login setErrorMessage={errorMessageSetter} setSuccessMessage={successMessageSetter}/>
          </Route>
          <Route exact path ='/register'>
          <Navigation/>
            <Register/>
          </Route>
          <Route exact path='/*/admin'>
          <Navigation/>
            <BookingAdminPage setErrorMessage={errorMessageSetter} setSuccessMessage={successMessageSetter} />
          </Route>
          <Route exact path='/newbooker'>
          <Navigation/>
            <NewBooker/>
          </Route>
          <Route exact path ='/' >
          <Navigation/>
            <HomePage/>
          </Route>
          <Route exact path ='/*' component={BookingPage} >
            
          </Route>
          
        </Switch>
        </div>
        </MuiThemeProvider>
    </div>
    ):<div id="loader" style={centeredDiv} ><CircularProgress/></div>
}

export default App;
