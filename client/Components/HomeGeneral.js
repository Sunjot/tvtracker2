import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import '../Stylesheets/HomeGeneral.scss';
import Banner from '../../public/banner.jpg';

class HomeGeneral extends React.Component {

  render() {
    return (
      <div id="home-top-cont">
        <div id="home-title-sec">
          <p id="home-title">TV Calendar</p>
          <p id="home-slogan">A tracker for all your favorite shows.</p>
          <div id="auth">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
        <div id="home-pic-sec">
          <img id="home-banner" src={Banner}/>
        </div>
      </div>
    );
  }
}

export default HomeGeneral;
