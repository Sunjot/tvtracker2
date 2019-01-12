import React from 'react';
import ReactDOM from 'react-dom';
import '../Stylesheets/App.scss';
import Home from './Home';
import HomeGeneral from './HomeGeneral';
import Auth from './Auth';
import { BrowserRouter as Router, Route, Link , Redirect} from 'react-router-dom';

// Object that we'll use to (de)authenticate a user when logging in(out)
// When we want to load a private route, use this object to check if a user is allowed access
const checkAuth = {
  auth: false,
  authenticate() {
    this.auth = true;
  },
  signout() {
    this.auth = false;
  }
}

// HOC that handles any routes that aren't allowed access unless logged in
const PrivateRoute = ({component: Component, ...rest}) => (
  // Before loading any of these routes, check if the user is authorized first and redirect otherwise
  <Route {...rest} render={(props) => (
    checkAuth.auth === true ? <Component {...props}/> : <Redirect to="/login"/>
  )} />
)

class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomeGeneral} />
          <PrivateRoute exact path="/home" component={Home} />
          {/* authLogin prop allows component to render appropriate page (login or signup) */}
          <Route exact path="/login" render={() => <Auth authLogin={true} authObj={checkAuth} />} />
          <Route exact path="/signup" render={() => <Auth authLogin={false} authObj={checkAuth} />} />
        </div>
      </Router>
    );
  }

}

export default App;
