import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";
import * as PreloaderActions from "./../../store/preloader/actions";

import notify from "./../../services/notification";
import CaseApi from "../../api/CaseApi";
import SyncApi from "../../api/SyncApi";
import { mapPartedStep } from "../../services/Functions";

class RemovedParsedFilesModal extends Component {
  state = {};

  deleteParsedFiles = async () => {
    const { Preloader, files } = this.props;
    let response = true;
    Preloader.show();

    await mapPartedStep(files, 100, async (part, next) => {
      response = await SyncApi.removeSyncedFiles(part);
      next();
    }, async () => {
      if(response){
        notify.isSuck("Data successfully removed!");
        this.props.hideModal();
  
        if(typeof this.props.onSuccess === "function")
          this.props.onSuccess();
  
      } else {
        notify.isError(response.data.error_message);
      }

      Preloader.hide();
    })
  };

  componentWillUnmount() {
    if (this.props.onClose) {
      this.props.onClose(this);
    }
  }

  render() {
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="m">
          <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
            <div className="d-flex align-items-center">
              <i className="ri-error-warning-line mr-2"></i> Warning
            </div>
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal confirm-modal">
            <h5 className="text-justify h5">
              Are you sure want to delete selected<b>({this.props.files.length})</b> files irrevocably? All related data
              will also be deleted.
            </h5>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-success" type="submit" onClick={this.deleteParsedFiles}>
              Submit
            </Button>
            <Button className="ld-button-danger" type="submit" onClick={() => this.props.hideModal(this.props.type)}>
              Cancel
            </Button>
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
  hideModal: (type, props) => {
    dispatch(ModalActions.hideModal(type, props));
  },
  removeCase: (Case_Short_NAME) => dispatch(CaseActions.removeCase(Case_Short_NAME)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("RemovedParsedFilesModal")),
    hide: () => dispatch(PreloaderActions.hidePreloader("RemovedParsedFilesModal")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RemovedParsedFilesModal);
