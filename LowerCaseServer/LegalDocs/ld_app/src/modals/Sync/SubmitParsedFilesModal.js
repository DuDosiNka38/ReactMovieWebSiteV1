import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";
import * as PreloaderActions from "./../../store/preloader/actions";
import SyncApi from "../../api/SyncApi";
import { mapPartedStep, mapStep } from "../../services/Functions";

class SubmitParsedFilesModal extends Component {
  state = {
  };

  submitFiles = async () => {
    const { files, Preloader } = this.props;
    Preloader.show();

    const response = [];

    await mapPartedStep(files, 100, async (part, next) => {
      const res = await SyncApi.saveSyncedFiles(part);
      response.push(res);
      next();
    }, () => {
      if(this.props.onSuccess){
        this.props.onSuccess();
      }
  
      this.props.hideModal();
      Preloader.hide();
    });
  }

  componentWillUnmount() {
    if (this.props.onClose) {
      this.props.onClose(this);
    }
  }

  render() {
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="m">
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Save files to library
          </ModalHeader>
          <ModalBody
            className="w-100 scrollable-modal confirm-modal"
          >
            <h5 className="text-justify h5">Are you sure want to save selected files?</h5>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-success" type="submit" onClick={this.submitFiles}>Submit</Button>
            <Button className="ld-button-danger" type="submit" onClick={this.props.hideModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  removeCase: (Case_Short_NAME) => dispatch(CaseActions.removeCase(Case_Short_NAME)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("SUBMIT_PARSED_FILES_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("SUBMIT_PARSED_FILES_MODAL"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubmitParsedFilesModal);
