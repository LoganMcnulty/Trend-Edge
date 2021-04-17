import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import * as userService from "../../services/userService"
import auth from '../../services/authService'
import ServeToDash from '../common/serveToDash'
import Paper from '@material-ui/core/Paper'

class SignUpForm extends Form {
  state = {
    data: { username: "", password: "", name: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .email()
      .label("Username"),
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    name: Joi.string()
      .required()
      .label("Name")
  };

  doSubmit = async () => {
    // Call the server
    try{
      const response = await userService.register(this.state.data)
      auth.loginWithJwt(response.headers["x-auth-token"])
      window.location = '/'
    }
    catch(err){
      if (err.response && err.response.status === 400){
        const errors = {...this.state.errors}
        errors.username = err.response.data
        this.setState({errors})
      }
    }
  };

  render() {
    return (
      <ServeToDash>
          <Paper elevation={3} className='p-3 m-0'>
            {/* <h1>Register</h1> */}
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("username", "Username")}
              {this.renderInput("password", "Password", "password")}
              {this.renderInput("name", "Name")}
              {this.renderButton("Register")}
            </form>
          </Paper>
      </ServeToDash>
    );
  }
}

export default SignUpForm;
