import React from 'react';
import ReactDOM from 'react-dom';
import Close from 'react-feather/dist/icons/x-square';

class ScheduleList extends React.Component {

  constructor() {
    super();
    this.state = {
      expandActive: 0,
      show: ''
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
        show: res
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
        show: ''
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
              {this.state.expandActive === 1  &&
                <div id="expand-cont">
                  <div id="show-box">
                    <p>{this.state.show.original_name}</p>
                    <Close id="close-icon" size={30} color="Black" onClick={() => this.closeShow()} />
                  </div>
                  <div id="dim-cont"></div>
                </div>
              }
            </div>
          )
        })}
        {this.props.showData.length === 0 &&
          <div id="no-listings"><p>There are no listings!</p></div>
        }
      </div>
    )
  }
}

export default ScheduleList;
