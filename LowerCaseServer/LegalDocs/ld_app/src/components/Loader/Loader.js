import React, { Component } from "react";


class Loader extends Component {
  state = {};
  render() {
    return (
      <>
        <div className="loader-holder">
          <div className="loader">
            <span>L</span>
            <span>o</span>
            <span>a</span>
            <span>d</span>
            <span>i</span>
            <span>n</span>
            <span>g</span>
          </div>
        </div>
      </>
    );
  }
}

export default Loader;
