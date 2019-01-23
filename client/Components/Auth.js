import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router-dom';
import '../Stylesheets/Auth.scss';

class Auth extends React.Component {

  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      password2: "",
      comparePass: false
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.props.authType === "login" ||
      (this.props.authType === "signup" && this.state.password === this.state.password2))
        this.state.comparePass = true;

    fetch(this.props.authType === "login" ? '/api/login' : '/api/signup', { // send login data to api
        method: 'POST',
        body: JSON.stringify(
          this.props.authType === "login" ? (
            {username: this.state.username, password: this.state.password}
          ) : (
            {username: this.state.username, password: this.state.password, password2: this.state.password2}
          )
        ),
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin"
      }).then((res) => {
        return res.text();
      }).then((data) => {
        if (data === "Authorized") {
          localStorage.setItem('binge', 'absolutely');
          this.props.history.push('/home');
        }
      }
    );
  }

  render() {
    return (
      <div id="auth-cont">
        <Link to="/" id="auth-tv-title">TV Calendar</Link>
        <form id="form" onSubmit={this.handleSubmit}>
          <p id="auth-title">{this.props.authType === "login" ? 'Login' : 'Signup'}</p>
          <input type="text" name="username" placeholder="Username" value={this.state.name} onChange={this.handleChange}/>
          <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
          { this.props.authType == "signup" &&
            <input type="password" name="password2" placeholder="Confirm Password" value={this.state.password2} onChange={this.handleChange}/>
          }
          <input type="submit" value={this.props.authType === "login" ? 'Login' : 'Signup'}/>
          { this.props.authType === "login" ? (
            <p id="auth-other-message">Don't have an account? <Link to='/signup'>Sign up now</Link></p>
          ) : (
            <p id="auth-other-message">Have an account? <Link to='/login'>Log in here</Link></p>
          )}
        </form>
      </div>
    );
  }
}

export default withRouter(Auth);
