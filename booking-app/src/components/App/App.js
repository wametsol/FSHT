import React, {useEffect, useState} from 'react';
import './App.css';

import Login from '../Login/Login'
import Register from '../Register/Register'
import HomePage from '../Home/HomePage';
import Navigation from '../Navigation/Navigation'
import Notification from '../Notification/Notification'

import {Switch,Route} from 'react-router-dom'

import {MuiThemeProvider,createMuiTheme} from '@material-ui/core/styles';
import {CssBaseline, CircularProgress} from '@material-ui/core';
import { auth } from '../../firebase'
import Alert from '@material-ui/lab/Alert'

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
 
  console.log(auth.currentUser)
  return fbInitialized!==false?(
    <div className="App">
      <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <Notification message={errorMessage} type='error' />
      <Notification message={successMessage} type='success' />
      <Navigation/>
      <div>
        <Switch>
          <Route exact path ='/login'>
          <Login setSuccessMessage={setSuccessMessage}/>
          </Route>
          <Route exact path ='/register'>
            <Register/>
          </Route>
          <Route exact path ='/' >
            <HomePage/>
          </Route>
        </Switch>
        </div>
        </MuiThemeProvider>
    </div>
    ):<div id="loader" style={centeredDiv} ><CircularProgress/></div>
}

export default App;
