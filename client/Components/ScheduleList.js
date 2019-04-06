import React from 'react';
import ReactDOM from 'react-dom';

class ScheduleList extends React.Component {

  render() {
    return(
      <div className="sched-list">
        {this.props.showData.map((show, x) => {
          return (
            <div key={x} className="sched-item">
              <img onClick={(e) => this.props.expandShow(e)} id={show.id} src={"https://image.tmdb.org/t/p/w1280" + show.poster}/>
              <div onClick={(e) => this.props.expandShow(e)} id={show.id} className="show-info">
                <div className="name-date-cont">
                  <div className="show-name">{show.showName}</div>
                  <div className="episode-date">{show.date.format('dddd, MMMM Do YYYY')}</div>
                </div>
                <div className="episode-name">{show.name}</div>
              </div>
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
