import React from 'react';
import ReactDOM from 'react-dom';
import '../Stylesheets/App.scss';
import Home from './Home';
import HomeGeneral from './HomeGeneral';
import Auth from './Auth';
import Nav from './Nav';
import Collection from './Collection';
import { BrowserRouter as Router, Route, Link , Redirect, withRouter} from 'react-router-dom';

// HOC for dealing with components that require the navigation bar
const PrivatePage = (Comp) => {
  return class Hoc extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return(
        <div>
          <Nav />
          <Comp {...this.props}/>
        </div>
      );
    }
  }
}

const HomeHOC = PrivatePage(Home);
const CollHOC = PrivatePage(Collection);

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      auth: "Loading"
    }
  }

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
