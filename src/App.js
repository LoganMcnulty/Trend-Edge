// Out of house
import React, { Component } from "react";
import {withRouter} from 'react-router-dom';
import { Route, Redirect, Switch } from "react-router-dom";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Container from 'react-bootstrap/Container'

// In house
import SignOut from './components/unique/signOut';
import auth from './services/authService'
import NotFound from "./components/unique/notFound";
import SignInForm from "./components/unique/signInForm";
import SignUpForm from "./components/unique/signUpForm";
import ProtectedRoute from './components/common/protectedRoute';
import "./App.css";
import Dashboard from './components/unique/dashboard'
import LandingContent from './components/unique/landing'

class App extends Component {
  state = {

  }

  componentDidMount() {
    console.log('App Mounted')
    const curRoute = this.props.location.pathname
    this.setState({curRoute})
    }

    componentDidUpdate(prevProps) {
      const prevRoute = prevProps.location.pathname
      const curRoute = this.props.location.pathname
      if (curRoute !== prevRoute) {
        console.log('Route Change')
        this.setState({curRoute})
      }
      console.log(this.state)
    }

  render() {
    const {user, curRoute} = this.state
    return (
      <React.Fragment>
        <ToastContainer />
        <Dashboard
          curRoute={curRoute}
        />
        <Container fluid style={{margin:0, padding:0}}>
          <Switch>
            {/* <Route 
              path="/dash" 
              render = {props => <Dashboard {...props} user={user}/>}
            /> */}

            <Route path="/Sign Up" component={SignUpForm} />
            <Route path="/Sign In" component={SignInForm} />
            <Route path="/Sign Out" component={SignOut} />
            <Route path="/dash" component={LandingContent} />


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
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(props => <App {...props}/>);
