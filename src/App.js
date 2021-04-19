// Out of house
import React, { Component } from "react";
import {withRouter} from 'react-router-dom';
import { Route, Redirect, Switch } from "react-router-dom";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Container from 'react-bootstrap/Container'

// In house
import SignOut from './components/unique/signOut';
import NotFound from "./components/unique/notFound";
import SignInForm from "./components/unique/signInForm";
import SignUpForm from "./components/unique/signUpForm";
import ProtectedRoute from './components/common/protectedRoute';
import "./App.css";
import LandingContent from './components/unique/landing'
import FooterPage  from './components/unique/footer'
import UserSettings from './components/unique/userSettings/userSettings'
import Watchlist from './components/unique/watchlist'
import SectorOverview from './components/unique/sectorOverview'
import About from './components/unique/about'
import Dashboard from './components/unique/dashboard'

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
        <Dashboard curRoute={curRoute}/>
        <Container fluid style={{margin:0, padding:0}}>
          <Switch>
            <Route path="/Sign Up" component={SignUpForm} />
            <Route path="/Sign In" component={SignInForm} />
            <Route path="/Sign Out" component={SignOut} />
            <Route path="/dash" component={LandingContent} />
            <ProtectedRoute path="/settings" component={UserSettings} />
            <ProtectedRoute path="/watchlist" component={Watchlist} />
            <Route path="/SectorOverview" component={SectorOverview} />
            <Route path="/about" component={About} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/dash" />
            <Redirect to="/not-found" />
          </Switch>
        </Container>
        <FooterPage/>
      </React.Fragment>
    );
  }
}

export default withRouter(props => <App {...props}/>);
