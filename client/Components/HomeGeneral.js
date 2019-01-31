import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router-dom';
import '../Stylesheets/HomeGeneral.scss';
import Banner from '../../public/banner.jpg';

class HomeGeneral extends React.Component {

  constructor() {
    super();
    this.state = {
      auth: "Loading"
    };
  }

  /*  Check authentication and redirect to home if so.
      Otherwise, render root as expected */
  componentDidMount() {
    this.props.authFunc().then((authVal) => {
      if (authVal === "Valid") this.props.history.push('/home');
      else this.setState({auth: authVal});
    });
  }

  render() {
    return (
      <div>
        {this.state.auth === "Loading" &&
        <div></div>
        }
        {this.state.auth === "Invalid" &&
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
        }
      </div>
    );
  }
}

export default withRouter(HomeGeneral);
