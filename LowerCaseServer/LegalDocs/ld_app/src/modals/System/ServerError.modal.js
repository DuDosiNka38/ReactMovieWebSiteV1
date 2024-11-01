import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import DocsApi from "./../../api/DocsApi"
import notification from './../../services/notification'
import * as PreloaderActions from "../../store/preloader/actions";
import { ipcRenderer } from "electron";

import AuthService from "./../../services/AuthService";


class ServerError extends Component {
  state = {
    countdownSec: 0,
    isCountdown: false,
  }

  reloadWindow = () => {
    ipcRenderer.send("reloadWindow", {});
  }

  countdown = (sec, stepCb, endCb) => {
    this.setState({ countdownSec: sec });

    const { isCountdown } = this.state;

    console.log({sec, isCountdown})

    if(isCountdown){
      if (sec > 0) {
        setTimeout(() => this.countdown(sec - 1, stepCb, endCb), 1000);

        if (typeof stepCb === "function") stepCb();
      } else {
        this.stopCountdown();

        if (typeof endCb === "function") endCb();
      }
    }
  };

  runCountdown = (sec, cbStep, cbEnd) => {
    this.setState({ isCountdown: true, countdownSec: sec });

    setTimeout( () => this.countdown(sec, cbStep, cbEnd), 100);
  };

  stopCountdown = () => {
    this.setState({ isCountdown: false, countdownSec: 0 });
  };

  closeModal = () => {
    if(this.props.auth_hash){
      AuthService.removeAuthHash();
    }
    
    this.props.hideModal(this.props.type);
  }

  componentDidMount() {
    this.runCountdown(10, null, () => {
      this.reloadWindow();
    })
  }

  render() {
    const { countdownSec } = this.state;
  
    return (
      <>
        <>
          <Modal
            isOpen={true}
            centered={true}
            className="delete-case-modal"
            size="xs"
            style={{zIndex: "99999999", position: "relative"}}
          >
            <ModalHeader
              className="d-flex align-items-center justify-content-center"
              toggle={this.closeModal}
            >
              <i className="ri-error-warning-line mr-2"></i> Server is not responding
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal">
              Please, Notify your administrator about it.<br/>
              Reconnect after {countdownSec} sec.
            </ModalBody>
            {/* <ModalFooter className= "mfooterGTO">
              <Button
                className="ld-button-success"
                type="submit"
                onClick={this.reloadWindow}
              >
                Try to reconnect
              </Button>
            </ModalFooter> */}
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  auth_hash: state.Main.auth_hash
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("SERVER_ERROR")),
    hide: () => dispatch(PreloaderActions.hidePreloader("SERVER_ERROR"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerError);
