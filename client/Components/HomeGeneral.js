import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router-dom';
import '../Stylesheets/HomeGeneral.scss';
import Banner from '../../public/banner.jpg';

class HomeGeneral extends React.Component {

  logout = () => {
    fetch('/api/logout', {method: 'GET', credentials: "same-origin"});
    localStorage.removeItem('binge');
    this.props.history.push('/');
  }

  render() {
    return (
      <div id="home-top-cont">
        <div id="home-title-sec">
          <p id="home-title">TV Calendar</p>
          <p id="home-slogan">A tracker for all your favorite shows.</p>
          <div id="auth">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
            <Link to="/" onClick={this.logout}>Log out</Link>
          </div>
        </div>
        <div id="home-pic-sec">
          <img id="home-banner" src={Banner}/>
        </div>
      </div>
    );
  }
}

export default withRouter(HomeGeneral);
