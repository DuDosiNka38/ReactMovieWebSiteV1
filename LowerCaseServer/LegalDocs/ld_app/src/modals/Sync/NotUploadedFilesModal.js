import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import * as ModalActions from "../../store/modal/actions";
import * as MainActions from "../../store/main/actions";
import * as SyncActions from "../../store/sync/actions";
import * as PreloaderActions from "./../../store/preloader/actions";

import notify from "../../services/notification";
import SyncApi from "../../api/SyncApi";

import { convertBytesToNormal, getSecondsToday, mapStep } from "./../../services/Functions";

class NotUploadedFilesModal extends Component {
  state = {
  };

  componentDidMount() {
  }

  checkAndStartUpload = async () => {
    const { data, AuthHash, Preloader } = this.props;

    Preloader.show();    
    let totalSize = 0;

    await mapStep(data, (e, next) => {
      totalSize += parseInt(e.Size);
      setTimeout(next, 10);
    })
    // data.map((x) => {
    //   totalSize += parseInt(x.Size)
    // });
       
    setTimeout(() => {
      this.props.hideModal(this.props.type); 
      this.props.showModal("SYNCHRONIZATION", {notUploaded: data, totalSize, onMount: Preloader.hide});
    }, 1000)
    
  }

  removeFiles = async () => {
    const { data } = this.props;
    this.props.hideModal();

    this.props.showModal("REMOVE_PARSED_FILES", {
      files: data.map(({Person_id, Computer_id, File_id}) => ({
        Person_id, Computer_id, File_id
      })),
      // onClose: () => {
      //   notify.isSuck("Files successfully removed from upload queue.");
      // }
    });

  }

  remindLater = async () => {
    this.props.remindLater();
    this.props.hideModal(this.props.type);
  }

  render() {
    const { data } = this.props;
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="m" style={{minWidth:"600px"}}>
          <ModalHeader className="d-flex align-items-center justify-content-center">
            <div className="d-flex align-items-center">
              <i className="ri-error-warning-line mr-2"></i> Warning
            </div>
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal">
            <h5 className="text-justify h5">
              You have <b>{data.length}</b> not uploaded files from previous synchronizations. Do you want to upload it now?
            </h5>
          </ModalBody>
          <ModalFooter className= "mfooterG">
            <Button className="ld-button-success" type="submit" onClick={this.checkAndStartUpload}>
              Ok, upload it
            </Button>
            <Button className="ld-button-warning" type="submit" onClick={this.remindLater}>
              Remind me later
            </Button>
            <Button className="ld-button-danger" type="submit" onClick={this.removeFiles}>
              No, remove it from queue
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  AuthHash: state.Main.auth_hash,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("NOT_UPLOADED")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NOT_UPLOADED")),
  },
  removeSyncSharePerson: (Share_to_Person_id) =>
    dispatch(SyncActions.removeSyncSharePersonRequested(Share_to_Person_id)),

  remindLater: () => dispatch(MainActions.remindLaterNotUploaded())
});

export default connect(mapStateToProps, mapDispatchToProps)(NotUploadedFilesModal);
