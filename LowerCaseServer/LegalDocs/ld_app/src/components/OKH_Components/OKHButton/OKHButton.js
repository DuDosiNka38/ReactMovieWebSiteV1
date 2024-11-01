import React, { Component } from "react";

import "./style.scss";

class OKHButton extends Component {
  state = {};
  render() {
    const {customClass, size } = this.props;
    let classes = "";
    
    classes +=  customClass ? ` ${customClass}` : "";
    classes +=  size ? ` ${size}` : "small";

    return (
      <>
        <div onClick={this.props.onClick || null} style={{...this.props.style}} className={`okh-button ${classes}`}>
          <div className="okh-button-wrapper">
            <div className="button-text">{this.props.children}</div>
            <i className={this.props.iconClass || ""}></i>
          </div>
        </div>
      </>
    );
  }
}

export default OKHButton;
