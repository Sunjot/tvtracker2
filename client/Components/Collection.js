import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import '../Stylesheets/Collection.scss';

class Collection extends React.Component {

  constructor() {
    super();
    this.state = {
      collection: ""
    }
  }

  getCollection = () => {
    fetch('/api/collection', {
      method: 'POST',
      credentials: 'include',
      headers: {"Content-Type": "application/json"}
    }).then((res) => {
      return res.json();
    }).then((res) => {
      this.setState({
        collection: res
      });
    });
  }

  componentDidMount() {
    this.getCollection();
  }

  render() {
    return(
      <div>
        {this.state.collection === "" &&
          <div>You have no shows! Add some here.</div>
        }
        {this.state.collection.length !== 0 &&
          <div id="coll-cont">
            {this.state.collection.map((show, x) => {
              return(
                <img key={x} src={"https://image.tmdb.org/t/p/w1280" + show.poster}></img>
              );
            })}
          </div>
        }
      </div>
    );
  }
}

export default Collection;
