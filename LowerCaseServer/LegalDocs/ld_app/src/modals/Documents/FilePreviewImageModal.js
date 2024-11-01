import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import DocsApi from "./../../api/DocsApi"
import notification from './../../services/notification'
import * as PreloaderActions from "../../store/preloader/actions";
import ReactModal from 'react-modal-resizable-draggable';

const path = require('path');


class FilePreviewImageModal extends Component {

  render() {
    const { hostInfo, file } = this.props;
  
    return (
      <>
        <>
          <Modal
            isOpen={true}
            centered={true}
            size="xl"
            style={{width:"450px"}}
          >
            <ModalHeader
              className="d-flex align-items-center justify-content-center"
              toggle={this.props.hideModal}
            >
            File Preview
            </ModalHeader>
            <ModalBody className="p-0">
              <img src={hostInfo.host+"/"+ file} style={{width: "100%"}}/>
           
            </ModalBody>
            <ModalFooter>
              <Button
                className="ld-button-danger"
                type="submit"
                onClick={this.props.hideModal}
              >
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  hostInfo: state.Main.hostInfo,
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("FILE_PREVIEW_IMAGE")),
    hide: () => dispatch(PreloaderActions.hidePreloader("FILE_PREVIEW_IMAGE"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FilePreviewImageModal);
