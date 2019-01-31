import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router-dom';

class Collection extends React.Component {

  constructor() {
    super();
    this.state = {
      auth: "Loading"
    }
  }

  /*  Check if the user is authenticated - If so, render component as expected.
      Otherwise, redirect to login page */
  componentDidMount() {
    this.props.authFunc().then((authVal) => {
      if (authVal === "Invalid") this.props.history.push('/login');
      else this.setState({auth: authVal});
    });
  }

  render() {
    return(
      <div>
        {this.state.auth === "Loading" &&
          <div></div>
        }
        {this.state.auth === "Valid" &&
          <div>

          </div>
        }
      </div>
    );
  }


}

export default withRouter(Collection);
