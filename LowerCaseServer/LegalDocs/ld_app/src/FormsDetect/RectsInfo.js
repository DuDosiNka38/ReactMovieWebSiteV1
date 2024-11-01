import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import Icon from "react-icofont";
// import {} from "reactstrap";
class RectsInfo extends React.Component {
  state = {};

  roundProps = (prop) => {
    return Math.round(prop);
  };
  render() {
    const { name, id, selectRect, field, action, x, y, width, height } =
      this.props;
    return (
      <>
        <div
          className="rectLayerInfo"
          data-tip
          data-for="info"
          id={id}
          onClick={selectRect}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="rectLayerName"> Alias: </span> {name} Id: {id}
            </div>
            <Icon icon="icofont-ui-edit"></Icon>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className="rectLayerName">Action: </span> {action}
            </div>
            <div>
              <span className="rectLayerName">Field Name: </span> {field}
            </div>
          </div>

          <ReactTooltip id="info" aria-haspopup="true" role="info">
            <div>
              <span className="rectLayerName">x: </span> {this.roundProps(x)}
            </div>
            <div>
              <span className="rectLayerName">y: </span>
              {this.roundProps(y)}
            </div>
            <div>
              <span className="rectLayerName">width: </span>
              {this.roundProps(width)}
            </div>
            <div>
              <span className="rectLayerName">height: </span>{" "}
              {this.roundProps(height)}
            </div>
          </ReactTooltip>
        </div>
      </>
    );
  }
}

export default RectsInfo;
