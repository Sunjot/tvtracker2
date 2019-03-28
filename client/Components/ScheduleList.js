import React from 'react';
import ReactDOM from 'react-dom';

class ScheduleList extends React.Component {

  render() {
    return(
      <div className="sched-list">
        {this.props.showData.map((show, x) => {
          return (
            <div key={x} className="sched-item">
              <img src={"https://image.tmdb.org/t/p/w1280" + show.poster}/>
              <div className="show-info">
                <div className="episode-date">{show.date.format('dddd, MMMM Do YYYY')}</div>
                <div className="episode-name">{show.name}</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default ScheduleList;
