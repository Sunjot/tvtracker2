import React from 'react';
import ReactDOM from 'react-dom';
import '../Stylesheets/App.scss';
import HomeGeneral from './HomeGeneral';
import Auth from './Auth';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomeGeneral} />
          {/* authLogin prop allows component to render appropriate page (login or signup) */}
          <Route exact path="/login" render={() => <Auth authLogin={true} />} />
          <Route exact path="/signup" render={() => <Auth authLogin={false} />} />
        </div>
      </Router>
    );
  }

}

export default App;
