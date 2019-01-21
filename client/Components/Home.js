import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import '../Stylesheets/Home.scss';
import LogOut from 'react-feather/dist/icons/log-out';
import HomeIcon from 'react-feather/dist/icons/home';

class Home extends React.Component {

  componentDidMount() {
    fetch('/api/user', {method: 'get', credentials: 'same-origin'}).then((res) => {
      return res.text();
    }).then((data) => {

    });
  }

  logout = () => {
    fetch('/api/logout', {method: 'GET', credentials: "same-origin"});
    localStorage.removeItem('binge');
    this.props.history.push('/');
  }

  render() {
    return (
      <div id="home-cont">
        <div id="nav-bar">
          <Link id="home-link" to="/home"><HomeIcon color="black" size={25}/></Link>
          <p className="nav-item">Collection</p>
          <p className="nav-item">Schedule</p>
          <Link id="logout-link" to="/" onClick={this.logout}><LogOut color="black" size={25}/></Link>
        </div>
        <div id="bottom-nav-border"></div>
      </div>
    );
  }
}

export default Home;
