// out of house
import React from "react";
import Joi from "joi-browser";
import {Redirect} from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import { NavLink } from "react-router-dom";

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
      .label("Email"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    try {
      const {data} = this.state
      await auth.login(data.username.toLowerCase(), data.password)
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
      <ServeToDash
        med={[8,4]}
        large={[6,0]}
        small={[12,0]}
      >
          <Paper elevation={3} className='p-3 m-0'>
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("username", "Email")}
              {this.renderInput("password", "Password", "password")}
              {this.renderButton("Sign In")}
            </form>
          </Paper>

          <Paper elevation={3} className='p-3 mt-3 justify-content-center text-center'>
            <div className="row">
              <div className="col">
                <NavLink className="h7 p-0 text-white" to="/Sign Up">
                  <button className="btn btn-primary btn-block" style={{backgroundColor:'#fc5a3d', border:'none'}}>Sign Up</button>
                </NavLink>
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
