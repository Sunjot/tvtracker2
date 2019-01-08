import React from 'react';
import ReactDOM from 'react-dom';
import '../Stylesheets/App.scss';
import HomeGeneral from './HomeGeneral';
import Login from './auth/Login';
import Signup from './auth/Signup';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomeGeneral} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
        </div>
      </Router>
    );
  }

}

export default App;
