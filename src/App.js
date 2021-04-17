// Out of house
import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// In house
import SignOut from './components/signOut';
import auth from './services/authService'
import NotFound from "./components/notFound";
import SignInForm from "./components/signInForm";
import RegisterForm from "./components/registerForm";
import ProtectedRoute from './components/common/protectedRoute';
import "./App.css";
import Dashboard from './components/dashboard'

class App extends Component {
  state = {}

  componentDidMount(){
    const user = auth.getCurrentUser()
    this.setState({user})
    console.log(user)
  }

  render() {
    const {user} = this.state
    return (
      <React.Fragment>
        <ToastContainer />
      
        <main className="container">
          <Switch>
            <Route 
              path="/dash" 
              render = {props => <Dashboard {...props} user={user}/>}
            />

            <Route path="/register" component={RegisterForm} />
            <Route path="/Sign In" component={SignInForm} />
            <Route path="/Sign Out" component={SignOut} />

            {/* <ProtectedRoute 
              path="/movies/:id" 
              component={MovieForm}
            />
            <Route 
              path="/movies"  
              render={props => <Movies {...props} user={user}/>} 
            /> */}

            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/dash" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
