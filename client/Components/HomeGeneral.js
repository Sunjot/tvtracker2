import React from 'react';
import ReactDOM from 'react-dom';
import '../Stylesheets/HomeGeneral.scss';

class HomeGeneral extends React.Component {

  render() {
    return (
      <div id="home-top-cont">
        <div id="home-title-sec">
          <p id="home-title">TV Calendar</p>
          <p id="home-slogan">A simplified tracker for all your favorite shows.</p>
        </div>
        <div id="home-pic-sec">
          <p id="home-pic">Placeholder</p>
        </div>
      </div>
    );
  }
}

export default HomeGeneral;
