import React from 'react';
import './App.css';

import Login from '../Login/Login'
import Register from '../Register/Register'
import HomePage from '../Home/HomePage';
import Navigation from '../Navigation/Navigation'

import {Switch,Route} from 'react-router-dom'

import {MuiThemeProvider,createMuiTheme} from '@material-ui/core/styles';
import {CssBaseline} from '@material-ui/core';

const theme=createMuiTheme()


const App = () => {
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <Navigation/>
        <Switch>
          <Route exact path ='/login' component={Login}/>
          <Route exact path ='/register' component={Register}/>
          <Route exact path ='/' component={HomePage}/>
        </Switch>
        </MuiThemeProvider>
    </div>
  );
}

export default App;
