import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from '../services/authService'
import {Redirect} from 'react-router-dom'
import Paper from '@material-ui/core/Paper'

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

    console.log(this.props.location)
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
      <div>
        <div className='row justify-content-center pt-3'>
          <div className="col-sm-12 col-lg-6">
            <h1>
                <br />
            </h1>
          <Paper elevation={3} className='p-3'>
          <p className="h4 text-center mb-3">Welcome</p>
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("username", "Username")}
              {this.renderInput("password", "Password", "password")}
              {this.renderButton("Login")}
            </form>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

export default SignInForm;

const styles = {
  btn: {
    width: 300,
  },
};
