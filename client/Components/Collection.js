import React from 'react';
import ReactDOM from 'react-dom';
import Remove from 'react-feather/dist/icons/x-square';
import ShowBox from './ShowBox';

class Collection extends React.Component {

  constructor() {
    super();
    this.state = {
      selected: []
    }
  }

  // Adds/removes a genre to/from the filter array when clicked on
  filterClick = (e) => {
    var text = e.target.textContent;
    if (!this.state.selected.includes(text)) {
      this.setState({
        selected: [...this.state.selected, text]
      });
    }
    else {
      var filterIndex = this.state.selected.indexOf(text);
      this.setState({
        selected: [...this.state.selected.slice(0, filterIndex),
          ...this.state.selected.slice(filterIndex+1)]
      });
    }
  }

  // When a user applies the genre filter, this checks if a show fits the criteria
  checkGenre = (genreArray) => {
    var set = false;
    if (this.state.selected.length === 0) return true;
    else {
      genreArray.map((g, x) => {
        if (this.state.selected.includes(g)) set = true;
      });
      if (set === false) return false;
      else return true;
    }
  }

  render() {
    return(
      <div id="coll-cont">
        <div id="filter-section">
          {this.props.filters.length > 3 &&
            <div id="filter-list">
            {this.props.filters.map((filter, x) => {
              return(
                <div className={this.state.selected.includes(filter)? "filter fselec" : "filter"}
                key={x} onClick={(e) => this.filterClick(e)}>{filter}</div>
              )
            })}
            </div>
          }
          {this.props.filters.length < 4 &&
            <div id="add-more">Add more shows to be able to filter your collection by genres!</div>
          }
        </div>
        <div id="coll-row">
          {this.props.collection.map((show, x) => {
            return(
              <div key={x}>
                {this.checkGenre(show.genres) === true &&
                  <div className="posterDiv" >
                    <Remove id="plus-icon" size={30} color="White" onClick={() => this.props.removeShow(show.showID)} />
                    <img id={show.showID} src={"https://image.tmdb.org/t/p/w1280" + show.poster} onClick={(e) => this.props.expandShow(e)}></img>
                  </div>
                }
              </div>
            );
          })}
        </div>
        {this.props.expandActive === 1  &&
          <ShowBox {...this.props} />
        }
      </div>
    )
  }
}

export default Collection;
