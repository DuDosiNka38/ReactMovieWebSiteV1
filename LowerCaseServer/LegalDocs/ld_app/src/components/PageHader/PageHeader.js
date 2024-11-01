import React, { Component } from "react";
import GoBack from "./../GoBack/GoBack";
import Refresh from "./../Refresh/Refresh";

class PageHeader extends Component {
  state = {};
  render() {
 

    return (
      <>
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4 className="mb-2 page-title"> {this.props.children}</h4>
          <div className = "phButtonsHolder">
            <GoBack />
            {/* <Refresh resreshPage = {this.props.resreshPage} /> */}
          </div>
        </div>
      </>
    );
  }
}

export default PageHeader;
