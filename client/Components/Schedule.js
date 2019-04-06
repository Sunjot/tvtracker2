import React from 'react';
import ReactDOM from 'react-dom';
import '../Stylesheets/Schedule.scss';
import * as moment from 'moment';
import ScheduleList from './ScheduleList';

class Schedule extends React.Component {

  constructor(){
    super();
    this.state = {
      week: [], // for shows airing in the coming week
      upcoming: [] // for shows airing in the near future
    }
  }

  getShows = () => {
    fetch('/api/collection', {
      method: 'GET'
    }).then((res) => {
      return res.json();
    }).then((data) => {
      var week = moment().add(7, 'days');

      data.map((show, x) => {
        if (show.nextAir.date != undefined) {
          var airDate = moment(show.nextAir.date);
          if (airDate.isBefore(week)) { // if the show is airing in the next 7 days

            // using index to place shows in correct order
            var index = 0;
            this.state.week.map((sh, x) => {
              if (airDate.isAfter(sh.date)) index++;
            });

            this.setState({
              week: [...this.state.week.slice(0, index),
                {poster: show.poster, showName:show.name, name: show.nextAir.name,
                  date: airDate, id: show.showID, genres: show.genres},
                ...this.state.week.slice(index)]
            });
          }
          if (airDate.isSameOrAfter(week)) { // if the show is airing after the next 7 days

            var index = 0;
            this.state.upcoming.map((sh, x) => {
              if (airDate.isAfter(sh.date)) index++;
            });

            this.setState({
              upcoming: [...this.state.upcoming.slice(0, index),
                {poster: show.poster, showName:show.name, name: show.nextAir.name,
                  date: airDate, id: show.showID, genres: show.genres},
                ...this.state.upcoming.slice(index)]
            });
          }
        }
      });
    });
  }

  componentDidMount() {
    this.getShows();
  }

  render() {
    return(
      <div id="sched-cont">
        <div id="week" className="sched-sec">
          <div className="sched-title">This week</div>
          <ScheduleList showData={this.state.week} />
        </div>

        <div id="upcoming" className="sched-sec">
          <div className="sched-title">Upcoming</div>
          <ScheduleList showData={this.state.upcoming} />
        </div>
      </div>
    )
  }
}

export default Schedule;
