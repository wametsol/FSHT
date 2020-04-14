import React from 'react';
import logo from './logo.svg';
import './App.css';

import Login from '../Login/Login'
import Register from '../Register/Register'
import HomePage from '../Home/HomePage';
import Navigation from '../Navigation/Navigation'

import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'



const App = () => {
  return (
    <div className="App">
      <Navigation/>
      <Router>
        <Switch>
          <Route exact path ='/login' component={Login}/>
          <Route exact path ='/register' component={Register}/>
          <Route exact path ='/' component={HomePage}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
