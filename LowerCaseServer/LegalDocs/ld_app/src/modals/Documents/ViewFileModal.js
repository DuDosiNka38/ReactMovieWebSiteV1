import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import * as PreloaderActions from "../../store/preloader/actions";
import { DocumentViewer } from "react-documents";
import ConnectingAnimation from "../../components/StyledComponents/CoonectingAnimation/ConnectingAnnimation";

class ViewFileModal extends Component {
  render() {
    const { Format, ActuaFile, hostInfo } = this.props;
    
    return (
      <>
        <>
          <Modal
            isOpen={true}
            centered={true}
            className="delete-case-modal"
            size="xl"
          >
            <ModalHeader
              className="d-flex align-items-center justify-content-center"
              toggle={this.props.hideModal}
            ></ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal docModal">
             <ConnectingAnimation/>
              <DocumentViewer
                url={ActuaFile}
                viewer={Format === `pdf` || Format === `doc` || Format === `docx` ? "google" : "office"}
                overrideLocalhost="https://react-doc-viewer.firebaseapp.com/"
                googleCheckContentLoaded = {true} 
              ></DocumentViewer>
            </ModalBody>
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  hostInfo: state.Main.hostInfo,
  sysInfo: state.Main.system,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("DEL_DOC")),
    hide: () => dispatch(PreloaderActions.hidePreloader("DEL_DOC")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewFileModal);
