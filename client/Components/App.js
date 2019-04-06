import React from 'react';
import ReactDOM from 'react-dom';
import '../Stylesheets/App.scss';
import Home from './Home';
import HomeGeneral from './HomeGeneral';
import Auth from './Auth';
import Nav from './Nav';
import CollectionCont from './CollectionCont';
import Schedule from './Schedule';
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
const CollHOC = withRouter(PrivatePage(CollectionCont));
const SchedHOC = withRouter(PrivatePage(Schedule));

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      expandActive: 0,
      show: '',
      displayContent: 0
    };
  }

  /*  Authentication function resides here because we use it for every route
      Get the auth response (logged or not) and return */
  checkAuth = async () => {
    var res = await fetch('/api/user', {method: 'GET', credentials: 'same-origin'});
    var text = await res.text();

    return text;
  }

  expandShow = (e) => {

    fetch('/api/tv', {
      method: 'POST',
      body: JSON.stringify({id: e.currentTarget.id}),
      headers: {'Content-Type': 'application/json'},
      credentials: 'same-origin'
    }).then((res) => {
      return res.json();
    }).then((res) => {
      this.setState({
        show: res,
        displayContent: 1
      })
    });

    this.setState({
      expandActive: 1
    }, () => {
      document.getElementById("dim-cont").className = "dim";
      document.getElementById("show-box").className = "open";

    });
  }

  closeShow = () => {
    document.getElementById("dim-cont").className = "glow";
    document.getElementById("show-box").className = "close";

    setTimeout(() => {
      this.setState({
        expandActive: 0,
        show: '',
        displayContent: 0
      });

    }, 500);
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
          <Route exact path="/schedule" render={() => <SchedHOC authFunc={this.checkAuth}
          expandActive={this.state.expandActive} show={this.state.show} displayContent={this.state.displayContent}
          expandShow={this.expandShow} closeShow={this.closeShow} />} />
        </div>
      </Router>
    );
  }

}

export default App;
