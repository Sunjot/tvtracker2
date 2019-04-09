import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Plus from 'react-feather/dist/icons/plus-square';
import Check from 'react-feather/dist/icons/check-square';

class Suggestions extends React.Component {

  constructor(){
    super();
    this.state = {
      suggestions: []
    }
  }

  // Pulls a suggestion of shows from the API
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

  componentDidMount(){
    this.getSuggestions();
  }

  render() {
    return(
      <div id="no-coll-cont">
        <p><Link to="/home" id="searchLink">Search for shows</Link></p>
        <div id="suggestions">
          <p>OR...</p>
          <p id="suggestions-msg">Choose from some of these suggestions</p>
          <div id="suggestions-row">
            {this.state.suggestions.slice(0, 8).map((show, x) => {
              return (
                <div className="posterDiv" key={x}
                onClick={this.props.addId.includes(show.id)? () => this.props.removeShow(show.id) : () => this.props.addShow(show.id)}>
                  {this.props.addId.includes(show.id)?
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
    )
  }

}

export default Suggestions;
