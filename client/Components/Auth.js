import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import '../Stylesheets/Auth.scss';

class Auth extends React.Component {

  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      password2: ""
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    fetch(this.props.authLogin ? '/api/login' : '/api/signup', { // send login data to api
        method: 'POST',
        body: JSON.stringify(
          this.props.authLogin? (
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
        console.log(data);
      });
  }

  render() {
    return (
      <div id="auth-cont">
        <Link to="/" id="auth-tv-title">TV Calendar</Link>
        <form id="form" onSubmit={this.handleSubmit}>
        <p id="auth-title">{this.props.authLogin ? 'Login' : 'Signup'}</p>
        <input type="text" name="username" placeholder="Username" value={this.state.name} onChange={this.handleChange}/>
        <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
        { this.props.authLogin == false &&
          <input type="password" name="password2" placeholder="Confirm Password" value={this.state.password2} onChange={this.handleChange}/>
        }
        <input type="submit" value={this.props.authLogin ? 'Login' : 'Signup'}/>
          { this.props.authLogin ? (
            <p id="auth-other-message">Don't have an account? <Link to='/signup'>Sign up now</Link></p>
          ) : (
            <p id="auth-other-message">Have an account? <Link to='/login'>Log in here</Link></p>
          )}
        </form>
      </div>
    );
  }
}

export default Auth;
