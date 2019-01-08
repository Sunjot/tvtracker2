import React from 'react';
import ReactDOM from 'react-dom';
import '../../Stylesheets/Login.scss';
import { Link } from 'react-router-dom';

class Login extends React.Component {

  constructor() {
    super();

    this.state = {
      username: "",
      password: ""
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.username);
  }

  render() {
    return (
      <div id="login-cont">
        <Link to="/" id="login-tv-title">TV Calendar</Link>
        <form id="form" onSubmit={this.handleSubmit}>
          <p id="login-title">Login</p>
          <input type="text" name="username" placeholder="Username" value={this.state.name} onChange={this.handleChange}/>
          <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
          <input type="submit" value="Login"/>
          <p id="signup-message">Don't have an account? <Link to="/signup">Sign up now</Link></p>
        </form>
      </div>
    );
  }
}

export default Login;
