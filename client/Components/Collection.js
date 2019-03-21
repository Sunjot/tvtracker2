import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import '../Stylesheets/Collection.scss';
import Plus from 'react-feather/dist/icons/plus-square';
import Check from 'react-feather/dist/icons/check-square';
import Remove from 'react-feather/dist/icons/x-square';

class Collection extends React.Component {

  constructor() {
    super();
    this.state = {
      collection: "", // for loading all shows in the collection on initial render
      suggestions: [], // to store all the suggestions from 3rd party api call
      addId: [], // for keeping track of which shows in the suggestion list are part of the collection
      filters: []
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
        this.setState({collection: res});

        // go through all the genres and add them to the state array if not already there
        var filterArray = this.state.filters;
        res.map((eachShow, x) => {
          eachShow.genres.map((genre, i) => {
            if (!filterArray.includes(genre)) {
              filterArray.push(genre);
            }
          });
        });

        this.setState({filters: filterArray});
      }
      else {
        this.setState({collection: []});
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

  addShow = (showID) => {
    fetch('/api/add', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({id: showID}),
      headers: {'Content-Type': 'application/json'}
    }).then((res) => {
      if(res.status === 200) {
        this.setState({
          addId: [...this.state.addId, showID]
        });
      }
    });
  }

  removeShow = (showID) => {
    fetch('/api/remove', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({id: showID}),
      headers: {'Content-Type': 'application/json'}
    }).then((res) => {
      if (res.status === 200) {
        var addIndex = this.state.addId.indexOf(showID);
        // Since the collection is an array of objects, slightly more complex to find the index of an id
        var collIndex = this.state.collection.map((sh, x) => {
          return sh.showID
        }).indexOf(showID);

        this.setState({
          // Show removed from this array so the add/remove icons update accordingly
          addId: [...this.state.addId.slice(0,addIndex), ...this.state.addId.slice(addIndex+1)],
          // When removing a show, we also need to do so from the collection so the page updates accordingly
          collection: [...this.state.collection.slice(0, collIndex), ...this.state.collection.slice(collIndex+1)]
        });
      }
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
        {Array.isArray(this.state.collection) && this.state.collection.length === 0 &&
          <div id="no-coll-cont">
            <p><Link to="/home" id="searchLink">Search for shows</Link></p>
            <div id="suggestions">
              <p>OR...</p>
              <p id="suggestions-msg">Choose from some of these suggestions</p>
              <div id="suggestions-row">
                {this.state.suggestions.slice(0, 8).map((show, x) => {
                  return (
                    <div id="posterDiv" key={x}
                    onClick={this.state.addId.includes(show.id)? () => this.removeShow(show.id) : () => this.addShow(show.id)}>
                      {this.state.addId.includes(show.id)?
                        <Check id="plus-icon" size={30} color="White"/> :
                        <Plus id="plus-icon" size={30} color="White"/>
                      }
                      <img className="renderFade" src={"https://image.tmdb.org/t/p/w1280" + show.poster_path} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        }
        {Array.isArray(this.state.collection) && this.state.collection.length > 0 &&
          <div id="coll-cont">
            <div id="filter-section">
              {this.state.filters.length > 3 &&
                <div id="filter-list">
                {this.state.filters.map((filter, x) => {
                  return(
                    <p>{filter}</p>
                  )
                })}
                </div>
              }
              {this.state.filters.length < 4 &&
                <div>Add more shows to be able to filter your collection by genres!</div>
              }
            </div>
            <div id="coll-row">
              {this.state.collection.map((show, x) => {
                return(
                  <div id="posterDiv" key={x} onClick={() => this.removeShow(show.showID)}>
                    <Remove id="plus-icon" size={30} color="White"/>
                    <img src={"https://image.tmdb.org/t/p/w1280" + show.poster}></img>
                  </div>
                );
              })}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Collection;
