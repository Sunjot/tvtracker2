import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import '../Stylesheets/Collection.scss';
import Plus from 'react-feather/dist/icons/plus-square';

class Collection extends React.Component {

  constructor() {
    super();
    this.state = {
      collection: "",
      suggestions: []
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
      if (res.length > 0) {
        this.setState({
          collection: res
        });
      }
      else {
        this.setState({
          collection: "None"
        });
      }
    });
  }

  getSuggestions = () => {
    fetch('/api/suggestions', {
      method: 'GET',
      credentials: 'same-origin'
    }).then((res) => {
      return res.json();
    }).then((res) => {
      this.setState({
        suggestions: res.results
      });
    });
  }

  componentDidMount() {
    this.getCollection();
    // Contemplated putting this inside getCollection IF there was no collection
    // but it caused performance issues (delayed fetch call = delayed render)
    this.getSuggestions();
  }

  render() {
    return(
      <div>
        {this.state.collection === "" &&
          <div></div>
        }
        {this.state.collection === "None" &&
          <div id="no-coll-cont">
            <p><Link to="/home" id="searchLink">Search for shows</Link></p>
            <div id="suggestions">
              <p>OR...</p>
              <p id="suggestions-msg">Choose from some of these suggestions</p>
              <div id="suggestions-row">
                {this.state.suggestions.slice(0, 8).map((show, x) => {
                  return (
                    <div id="posterDiv">
                      <Plus id="plus-icon" size={30} color="White"/>
                      <img key={x} className="renderFade" src={"https://image.tmdb.org/t/p/w1280" + show.poster_path} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        }
        {Array.isArray(this.state.collection) &&
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
