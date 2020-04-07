import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import './Login.css';


export default class Login extends Component {

  constructor(props) {
    super(props); 

    this.state = ({
      employee_id: null,
      password: '',
    })
    this.updateInputValue = this.updateInputValue.bind(this);
  }
    
  updateInputValue(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {

    return (
      // <div className="loginWrapper">
      <Paper className="loginWrapper" elevation = {2}>
        {/* Index Title */}
        <p className="prjMng">Timely</p>
        <div className="loginContainer">
          <div className="loginHint">
            Login
          </div>
          {/* Login Form */}
          <form className="loginForm" onSubmit={(e) => this.props.loginHandler(e, {id: this.state.employee_id, password: this.state.password})}>
            {/* Email Div */}
            <div className="loginEmail">
              <input
                className="loginInputs"
                name="employee_id"
                placeholder="Employee Id"
                required
                autoFocus
                onChange = {this.updateInputValue}
              />
            </div>
            {/* Password Div */}
            <div className="loginPwd">
              <input
                  className="loginInputs"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange = {this.updateInputValue}
              />
            </div>
            <div className="loginBsection">
              <button className="loginBtn" type="submit"> Login </button>
            </div>
          </form>
        </div>
      {/* </div> */}
      </Paper>
    );
  }
}

