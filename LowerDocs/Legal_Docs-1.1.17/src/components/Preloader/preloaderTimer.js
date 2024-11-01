import React, { Component } from "react";

class PreloaderTimer extends Component {
  state = {};

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) this.render();
  }

  render() {
    return (
      <>
        <div id="PreloaderTimer">
          <div id="status">
            {/* <div className="spinner">
              <i className="ri-loader-line spin-icon"></i>
            </div> */}
          </div>
          {/* Wait for the computer check */}
          <div className="check-holder">
            <h2 className=" check-title">Wait for the computer check</h2>
            <div className="loader-holder">
          <div className="loader">
            <span>W</span>
            <span>a</span>
            <span>i</span>
            <span>t</span>
            {/* <span>i</span>
            <span>n</span>
            <span>g</span> */}
          </div>
        </div>
            <h3 className="check-text-sub">{this.props.message}</h3>
          </div>
        </div>
      </>
    );
  }
}

export default PreloaderTimer;
