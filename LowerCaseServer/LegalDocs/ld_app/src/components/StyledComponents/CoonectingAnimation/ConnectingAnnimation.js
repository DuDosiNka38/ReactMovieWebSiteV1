import React, { Component } from "react";
import "./_style.scss";
class ConnectingAnimation extends Component {
  state = {};
  render() {
    return (
      <>
        <div class="box">
          <div class="comp">
            <i
              className=" ri-computer-line
"
            ></i>
          </div>
          <div class="loader"></div>
          <div class="con"></div>
          <div class="byte"></div>
          <div class="server">
            <i
              className=" ri-database-2-line
"
            ></i>
          </div>
        </div>
      </>
    );
  }
}

export default ConnectingAnimation;
