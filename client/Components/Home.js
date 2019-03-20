import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import '../Stylesheets/Home.scss';
import Plus from 'react-feather/dist/icons/plus-square';
import Check from 'react-feather/dist/icons/check-square';

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      timerRef: 0,
      searchResults: "",
      auth: "Loading",
      addId: []
    }
  }

  getSearch = (data) => {
    fetch('/api/search', {
      method: 'post',
      credentials: 'include',
      body: JSON.stringify({query: data}),
      headers: {"Content-Type": "application/json"}
    }).then((res) => {
      return res.json();
    }).then((res) => {
      if (res.errors || res.results.length === 0)
        this.setState({searchResults: ""});
      else
        this.setState({searchResults: res.results});
    });
  }

  /* setTimeout ensures fetch isn't fired for every key pressed and lets the user
  finish typing. Used clearTimeout to reset the timer everytime a user presses a key. */
  handleKey = (e) => {
    clearTimeout(this.state.timerRef);
    var queryValue = e.target.value;
    this.setState({
      timerRef: setTimeout(() => this.getSearch(queryValue), 300)
    });
  }

  addShow = (e) => {
    var currentNode = e.currentTarget;
    fetch('/api/add', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({id: currentNode.parentNode.id}),
      headers: {'Content-Type': 'application/json'}
    }).then(() => {
      this.setState({
        addId: [...this.state.addId, currentNode.parentNode.id]
      });
    });
  }

  removeShow = (e) => {
    var currentNode = e.currentTarget;
    fetch('/api/remove', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({id: currentNode.parentNode.id}),
      headers: {'Content-Type': 'application/json'}
    }).then(() => {
      var index = this.state.addId.indexOf(currentNode.parentNode.id);
      this.setState({
        addId: [...this.state.addId.slice(0, index), ...this.state.addId.slice(index+1)]
      });
    });
  }

  render() {
    return (
      <div className="renderFade" id="home-cont">
        <p id="search-title">What ya watchin'?</p>
        <input type="text" placeholder="Type over me" id="search-bar" onKeyUp={e => this.handleKey(e)}/>
        {this.state.searchResults !== "" &&
          <div id="results-cont">
            {this.state.searchResults.map((res, x) => {
              return (
                <div key={res.id} id={x} className="result-row">
                  <img src={"https://image.tmdb.org/t/p/w154" + res.poster_path}/>
                  <div className="show-info">
                    <div className="name-cont" id={res.id} data-poster={res.poster_path}>
                      <p className="show-name">{res.original_name}</p>
                      {this.state.addId.includes(res.id.toString()) ?
                        <Check id="plus-icon" size={20} color="green" onClick={e => this.removeShow(e)} /> :
                        <Plus id="plus-icon" size={20} onClick={e => this.addShow(e)}/>
                      }
                    </div>
                    { res.overview.length > 300 ?
                      <p className="show-overview"> { res.overview.substring(0, 300) + "..." }</p> :
                      <p className="show-overview">{ res.overview }</p>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        }
      </div>
    );
  }
}

export default Home;
