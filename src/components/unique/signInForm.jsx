// out of house
import React from "react";
import Joi from "joi-browser";
import {Redirect} from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import { NavLink } from "react-router-dom";
import Button from '@material-ui/core/Button'
import CardHeader from '@material-ui/core/CardHeader';

// in house
import ServeToDash from '../common/serveToDash'
import Form from "../common/form";
import auth from '../../services/authService'

class SignInForm extends Form {
  state = {
    data: { username: "", password: "" },
    classes:{},
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    try {
      const {data} = this.state
      await auth.login(data.username, data.password)
    // causes a full reload of application, so that app component is mounted again and get the JWT 

    const {state} = this.props.location
    window.location = state ? state.from.pathname : '/'

    } catch (err) {
      if (err.response && err.response.status === 400){
        const errors = {...this.state.errors}
        errors.password = err.response.data
        this.setState ({errors})
      }
    }

  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/"/>
    return (
      <ServeToDash>
          <Paper elevation={3} className='p-3 m-0'>
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("username", "Username")}
              {this.renderInput("password", "Password", "password")}
              {this.renderButton("Sign In")}
            </form>
          </Paper>

          <Paper elevation={3} className='p-3 mt-3 justify-content-center text-center'>
            <div className="row">
              <div className="col">
                <h5>New Here?</h5>
                <button className="btn btn-primary btn-block" style={{backgroundColor:'#fc5a3d', border:'none'}}>
                  <NavLink className="h7 p-0 text-white" to="/Sign Up">Get Started</NavLink>
                </button>
              </div>
            </div>
          </Paper>
      </ServeToDash>
    );
  }
}

export default SignInForm;

const styles = {
  btn: {
    width: 300,
  },
};
