import React from 'react';
import ReactDOM from 'react-dom';
import { Link, withRouter } from 'react-router-dom';
import '../Stylesheets/Nav.scss';
import LogOut from 'react-feather/dist/icons/log-out';
import HomeIcon from 'react-feather/dist/icons/home';
import Folder from 'react-feather/dist/icons/folder';
import Calendar from 'react-feather/dist/icons/calendar';

class Nav extends React.Component {

  logout = () => {
    fetch('/api/logout', {method: 'POST', credentials: "same-origin"});
    localStorage.removeItem('binge');
    this.props.history.push('/');
  }

  navHover = (e) => {
    e.currentTarget.getElementsByClassName("sliding-border")[0].className = "sliding-border border-in";


  }

  render() {
    return(
      <div id="nav-cont" className="renderFade">
        <div id="nav-bar">
          <Link id="home-link" to="/home"><HomeIcon color="black" size={25}/></Link>
          <Link to="/collection" className="nav-item" onMouseOver={(e) => this.navHover(e)}>
            <div className="nav-item-inner">
              <Folder color="black" size={20}/>
              <p>Collection</p>
            </div>
            <div className="sliding-border"></div>
          </Link>
          <Link to="/schedule" className="nav-item" onMouseOver={(e) => this.navHover(e)}>
            <div className="nav-item-inner">
              <Calendar color="black" size={20}/>
              <p>Schedule</p>
            </div>
            <div className="sliding-border"></div>
          </Link>
          <Link id="logout-link" to="/" onClick={this.logout}><LogOut color="black" size={25}/></Link>
        </div>
        <div id="bottom-nav-border"></div>
      </div>
    );
  }
}

export default withRouter(Nav);
