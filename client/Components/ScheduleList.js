import React from 'react';
import ReactDOM from 'react-dom';
import Close from 'react-feather/dist/icons/x-square';

class ScheduleList extends React.Component {

  constructor() {
    super();
    this.state = {
      expandActive: 0,
      show: '',
      displayContent: 0
    };
  }

  expandShow = (e) => {

    fetch('/api/tv', {
      method: 'POST',
      body: JSON.stringify({id: e.currentTarget.id}),
      headers: {'Content-Type': 'application/json'},
      credentials: 'same-origin'
    }).then((res) => {
      return res.json();
    }).then((res) => {
      this.setState({
        show: res,
        displayContent: 1
      })
    });

    this.setState({
      expandActive: 1
    }, () => {
      document.getElementById("dim-cont").className = "dim";
      document.getElementById("show-box").className = "open";

    });
  }

  closeShow = () => {
    document.getElementById("dim-cont").className = "glow";
    document.getElementById("show-box").className = "close";

    setTimeout(() => {
      this.setState({
        expandActive: 0,
        show: '',
        displayContent: 0
      });

    }, 500);
  }

  render() {
    return(
      <div className="sched-list">
        {this.props.showData.map((show, x) => {
          return (
            <div key={x} className="sched-item">
              <img onClick={(e) => this.expandShow(e)} id={show.id} src={"https://image.tmdb.org/t/p/w1280" + show.poster}/>
              <div onClick={(e) => this.expandShow(e)} id={show.id} className="show-info">
                <div className="name-date-cont">
                  <div className="show-name">{show.showName}</div>
                  <div className="episode-date">{show.date.format('dddd, MMMM Do YYYY')}</div>
                </div>
                <div className="episode-name">{show.name}</div>
              </div>
            </div>
          )
        })}
        {this.state.expandActive === 1  &&
          <div id="expand-cont">
            <div id="show-box">
              {this.state.displayContent === 1 &&
                <div id="show-box-inner">
                  <img id="expand-poster" src={"https://image.tmdb.org/t/p/w1280" + this.state.show.poster_path}/>
                  <div id="show-info">
                    <div id="title-genres">
                      <p id="title">{this.state.show.original_name}</p>
                      <div id="genres">
                        {this.state.show.genres.map((g, x) => {
                            return (
                              <p key={x} className="sec">{g.name}</p>
                            )
                          })
                        }
                      </div>
                    </div>
                    <p id="show-desc">{this.state.show.overview}</p>
                  </div>
                  <Close id="close-icon" size={30} color="Black" onClick={() => this.closeShow()} />
                </div>
              }
            </div>
            <div id="dim-cont"></div>
          </div>
        }
        {this.props.showData.length === 0 &&
          <div id="no-listings"><p>There are no listings!</p></div>
        }
      </div>
    )
  }
}

export default ScheduleList;
