import React, { Component } from "react";
import { createPortal } from "react-dom";
import Icofont from "react-icofont";
import ModalService from "../../services/ModalService";
const modalRoot = document.getElementById("flaxy-modal");

const flaxySize = {
  smallSize: "flaxy-holder--small",
  mediumSize: "flaxy-holder--medium",
  bigSize: "flaxy-holder--big",
};

class FlexyModal extends Component {
  state = {
    flaxySize: "flaxy-holder--small",
    bodySize: "smallSize",
  };

  setStyle = (type) => {
    this.setState({ flaxySize: flaxySize[type] });
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if(this.state.flaxySize === flaxySize.smallSize) {

  //   }
  // }
  render() {
    const showBody = () => {
      switch (this.state.flaxySize) {
        case flaxySize.smallSize:
          return this.props.bodyS;

        case flaxySize.mediumSize:
          return this.props.bodyM;

        case flaxySize.bigSize:
          return this.props.bodyB;

        default:
          return this.props.bodyS;
      }
    };

    const showHeader = () => {
      return <>{this.props.header}</>;
    };
    let flaxyStatus = "warning"
    return createPortal(
      <>
        {/* {ModalService.renderModal(this.props.history)} */}
        {/* <div className="flaxyModal">
          <div className="flaxy-holder ">
            <div
              className={`flaxy-holder ${this.state.flaxySize}` }
            >
              <div className={`flaxy-header flexy-buttons-block d-flex align-items-center justify-content-end w-100 flaxy-action-${flaxyStatus}`}>
                <div>
                  {showHeader()}
             
                  <Icofont
                    icon="minus"
                    flip="h"
                    className="font-size-22"
                    onClick={() => this.setStyle("smallSize")}
                  />
              
                  <Icofont
                    icon="maximize"
                    flip="h"
                    className="font-size-22"
                    onClick={() => this.setStyle("mediumSize")}
                  />
              
                  <Icofont
                    icon="expand"
                    flip="h"
                    className="font-size-22"
                    onClick={() => this.setStyle("bigSize")}
                  />
              
                </div>
              </div>
              <div className="flaxy-body ">{showBody()}</div>
            </div>
          </div>
        </div> */}
      </>,
      modalRoot
    );
  }
}

export default FlexyModal;
