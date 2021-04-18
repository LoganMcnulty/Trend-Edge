// Out of House
import React from "react";
import Joi from "joi-browser";

// In House
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
      .label("Email"),
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    name: Joi.string()
      .required()
      .label("Username")
  };

  doSubmit = async () => {
    // Call the server
    console.log(this.state.user)
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
      <ServeToDash
        large={[3,0]}
        med={[10,0]}
        small={[10,2]}
      >
        <Paper elevation={3} className='p-3 m-0'>
            {/* <h1>Register</h1> */}
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("username", "Email")}
              {this.renderInput("password", "Password", "password")}
              {this.renderInput("name", "Username")}
              {this.renderButton("Register")}
            </form>
        </Paper> 
      </ServeToDash>
    );
  }
}

export default SignUpForm;
