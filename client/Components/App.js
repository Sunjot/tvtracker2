import React from 'react';
import ReactDOM from 'react-dom';
import '../Stylesheets/App.scss';
import Home from './Home';
import HomeGeneral from './HomeGeneral';
import Auth from './Auth';
import Nav from './Nav';
import Collection from './Collection';
import { BrowserRouter as Router, Route, Link , Redirect, withRouter} from 'react-router-dom';

// HOC for dealing with components that require authentication
const PrivatePage = (Comp) => {
  return class Hoc extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        auth: "Loading"
      };
    }

    /*  Check if the user is authenticated - If so, render component as expected.
        Otherwise, redirect to login page */
    componentDidMount(){
      this.props.authFunc().then((authVal) => {
        if (authVal === "Invalid") this.props.history.push('/login');
        else this.setState({auth: authVal});
      });
    }

    render() {
      return(
        <div>
          {this.state.auth === "Loading" &&
            <div>
            </div>
          }
          {this.state.auth === "Valid" &&
            <div>
              <Nav />
              <Comp {...this.props}/>
            </div>
          }
        </div>
      );
    }
  }
}

const HomeHOC = withRouter(PrivatePage(Home));
const CollHOC = withRouter(PrivatePage(Collection));

class App extends React.Component {

  /*  Authentication function resides here because we use it for every route
      Get the auth response (logged or not) and return */
  checkAuth = async () => {
    var res = await fetch('/api/user', {method: 'GET', credentials: 'same-origin'});
    var text = await res.text();

    return text;
  }

  render() {

    return (
      <Router>
        <div>
          <Route exact path="/" render={() => <HomeGeneral authFunc={this.checkAuth}/>} />
          <Route exact path="/home" render={() => <HomeHOC authFunc={this.checkAuth}/>} />
          {/* authLogin prop allows component to render appropriate page (login or signup) */}
          <Route exact path="/login" render={() => <Auth authType="login" authFunc={this.checkAuth}/>} />
          <Route exact path="/signup" render={() => <Auth authType="signup" authFunc={this.checkAuth}/>} />
          <Route exact path="/collection" render={() => <CollHOC authFunc={this.checkAuth} />} />
        </div>
      </Router>
    );
  }

}

export default App;
