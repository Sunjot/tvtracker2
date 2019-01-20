import React from 'react';
import ReactDOM from 'react-dom';
import '../Stylesheets/App.scss';
import Home from './Home';
import HomeGeneral from './HomeGeneral';
import Auth from './Auth';
import { BrowserRouter as Router, Route, Link , Redirect} from 'react-router-dom';

// HOC that handles any routes that aren't allowed access unless logged in
const PrivateRoute = ({component: Component, redirectURL: RedirectURL, ...rest}) => (
  // Before loading any of these routes, check if the user is logged in
  <Route {...rest} render={(props) => (
    localStorage.getItem('binge') === 'absolutely' ? <Component {...props}/> : <Redirect to={RedirectURL}/>
  )} />
)

class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomeGeneral} />
          <PrivateRoute exact path="/home" component={Home} redirectURL="/login"/>
          {/* authLogin prop allows component to render appropriate page (login or signup) */}
          <Route exact path="/login" render={() => (localStorage.getItem('binge') === 'absolutely' ?
            <Redirect to="/home"/> : <Auth authType="login"/>
          )}/>
          <Route exact path="/signup" render={() => (localStorage.getItem('binge') === 'absolutely' ?
            <Redirect to="/home"/> : <Auth authType="signup"/>
          )}/>
        </div>
      </Router>
    );
  }

}

export default App;
