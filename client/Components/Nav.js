import React from 'react';
import ReactDOM from 'react-dom';
import { Link, withRouter } from 'react-router-dom';
import '../Stylesheets/Nav.scss';
import LogOut from 'react-feather/dist/icons/log-out';
import HomeIcon from 'react-feather/dist/icons/home';

class Nav extends React.Component {

  logout = () => {
    fetch('/api/logout', {method: 'POST', credentials: "same-origin"});
    localStorage.removeItem('binge');
    this.props.history.push('/');
  }

  render() {
    return(
      <div id="nav-cont" className="renderFade">
        <div id="nav-bar">
          <Link id="home-link" to="/home"><HomeIcon color="black" size={25}/></Link>
          <Link id="collectio-link" to="/collection" className="nav-item">Collection</Link>
          <p className="nav-item">Watch List</p>
          <Link id="logout-link" to="/" onClick={this.logout}><LogOut color="black" size={25}/></Link>
        </div>
        <div id="bottom-nav-border"></div>
      </div>
    );
  }
}

export default withRouter(Nav);
