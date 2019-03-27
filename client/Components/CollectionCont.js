import React from 'react';
import ReactDOM from 'react-dom';
import '../Stylesheets/Collection.scss';
import Suggestions from './Suggestions';
import Collection from './Collection';

class CollectionCont extends React.Component {

  constructor() {
    super();
    this.state = {
      collection: "", // for loading all shows in the collection on initial render
      addId: [], // for keeping track of which shows in the suggestion list are part of the collection
      filters: [] // for tracking all the genres
    }
  }

  // Pulls a user's collection of shows
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
            if (!filterArray.includes(genre)) filterArray.push(genre);
          });
        });
        this.setState({filters: filterArray});
      }
      else
        this.setState({collection: []});
    });
  }

  // Adds a show to a user's collection
  // Only used by the Suggestion component but since it updates a state (addId)
  // required by another function (removeShow), the implementation is in the parent component
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

  // Removes a show from a user's collection
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
    this.getCollection(); // Grabs user's collection on page render
  }

  render() {
    return(
      <div>
        {this.state.collection === "" &&
          <div></div>
        }
        {Array.isArray(this.state.collection) && this.state.collection.length === 0 &&
          <Suggestions addId={this.state.addId} addShow={this.addShow} removeShow={this.removeShow}/>
        }
        {Array.isArray(this.state.collection) && this.state.collection.length > 0 &&
          <Collection collection={this.state.collection} removeShow={this.removeShow} filters={this.state.filters}/>
        }
      </div>
    );
  }
}

export default CollectionCont;
