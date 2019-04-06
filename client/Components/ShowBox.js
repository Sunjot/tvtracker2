import React from 'react';
import ReactDOM from 'react-dom';
import Close from 'react-feather/dist/icons/x-square';

class ShowBox extends React.Component {

  render() {
    return(
      <div id="expand-cont">
        <div id="show-box">
          {this.props.displayContent === 1 &&
            <div id="show-box-inner">
              <img id="expand-poster" src={"https://image.tmdb.org/t/p/w1280" + this.props.show.poster_path}/>
              <div id="show-info">
                <div id="title-genres">
                  <p id="title">{this.props.show.original_name}</p>
                  <div id="genres">
                    {this.props.show.genres.map((g, x) => {
                        return (
                          <p key={x} className="sec">{g.name}</p>
                        )
                      })
                    }
                  </div>
                </div>
                <p id="show-desc">{this.props.show.overview}</p>
              </div>
              <Close id="close-icon" size={30} color="Black" onClick={() => this.props.closeShow()} />
            </div>
          }
        </div>
        <div id="dim-cont"></div>
      </div>
    );
  }
}

export default ShowBox;
