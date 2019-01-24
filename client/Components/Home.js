import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import '../Stylesheets/Home.scss';
import Nav from './Nav';
import Plus from 'react-feather/dist/icons/plus-square';

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      timerRef: 0,
      searchResults: ""
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
    fetch('/api/add', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({id: e.currentTarget.parentNode.id, poster: e.currentTarget.parentNode.dataset.poster}),
      headers: {'Content-Type': 'application/json'}
    });
  }

  render() {
    return (
      <div id="home-cont">
        <Nav />
        <p id="search-title">What ya watchin'?</p>
        <input type="text" placeholder="Type over me" id="search-bar" onKeyUp={e => this.handleKey(e)}/>
        {this.state.searchResults !== "" &&
          <div id="results-cont">
            {this.state.searchResults.map((res, x) => {
              return (
                <div key={res.id} className="result-row">
                  <img src={"https://image.tmdb.org/t/p/w154" + res.poster_path}/>
                  <div className="show-info">
                    <div className="name-cont" id={res.id} data-poster={res.poster_path}>
                      <p className="show-name">{res.original_name}</p>
                      <Plus id="plus-icon" size={20} onClick={e => this.addShow(e)}/>
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
