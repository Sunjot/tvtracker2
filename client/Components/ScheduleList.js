import React from 'react';
import ReactDOM from 'react-dom';
import Close from 'react-feather/dist/icons/x-square';

class ScheduleList extends React.Component {

  constructor() {
    super();
    this.state = {
      expandActive: 0
    };
  }

  expandShow = () => {
    this.setState({
      expandActive: 1
    });
  }

  closeShow = () => {
    this.setState({
      expandActive: 0
    });
  }

  render() {
    return(
      <div className="sched-list">
        {this.props.showData.map((show, x) => {
          return (
            <div key={x} className="sched-item">
              <img onClick={() => this.expandShow()} src={"https://image.tmdb.org/t/p/w1280" + show.poster}/>
              <div className="show-info">
                <div className="name-date-cont">
                  <div className="show-name">{show.showName}</div>
                  <div className="episode-date">{show.date.format('dddd, MMMM Do YYYY')}</div>
                </div>
                <div className="episode-name">{show.name}</div>
              </div>
              {this.state.expandActive === 1  &&
                <div id="expand-cont">
                  <div id="expand-box">
                    <Close id="close-icon" size={30} color="Black" onClick={() => this.closeShow()} />
                  </div>
                  <div id="expand-dim"></div>
                </div>
              }
            </div>
          )
        })}
      </div>
    )
  }
}

export default ScheduleList;
