import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table, Progress } from "reactstrap";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import * as ModalActions from "../../../store/modal/actions";

class ShowHa extends Component {
  state = {
  };

  render() {
    

    return (
      <>
        <Modal
          isOpen={true}
          centered={true}
          className="sync-progress-modal fullscreen-modal overflow-hidden"
          size="xl"
        >
          <ModalHeader
              className="d-flex align-items-center justify-content-center"
              toggle={this.props.hideModal}
            >
            </ModalHeader>
          <ModalBody className="w-100 p-0">
            {/* <video width="100%" height="100%" autoPlay={true} loop={true} poster="video/duel.jpg">
              <source src="https://images-ext-2.discordapp.net/external/MddDnfQ0G2iPU-RJIDjq977yisCfHE9x4Zx8dzFJJww/https/i.imgur.com/mWC2xyl.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'/>
            </video> */}
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/DEdlWpZ1E4Y?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowHa);
