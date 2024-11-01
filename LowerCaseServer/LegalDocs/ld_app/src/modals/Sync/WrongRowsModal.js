import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";
import * as PreloaderActions from "./../../store/preloader/actions";

import CaseApi from "../../api/CaseApi";
import SyncApi from "../../api/SyncApi";
import { mapPartedStep } from "../../services/Functions";

class WrongRowsModal extends Component {
  state = {
  };

  deleteCase = async () => {
    const { Case_Short_NAME, Preloader } = this.props;
    Preloader.show();

    const res = await CaseApi.deleteCase(Case_Short_NAME);

    if(res.result){
      this.props.removeCase(Case_Short_NAME);
    }

    this.props.hideModal();
    Preloader.hide();
  }

  submit = () => {
    this.props.hideModal(this.props.type);
    this.props.showModal(
      "SUBMIT_PARSED_FILES", 
      {
        files: this.props.correctFiles,
        onSuccess: this.props.onSuccess,
        onClose: this.props.onClose,
      }
    );
  }

  submitFiles = async () => {
    const { correctFiles:files, Preloader } = this.props;
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
    const { correctFiles } = this.props;
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="m">
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            <div className="d-flex align-items-center">
              <i className="ri-error-warning-line mr-2"></i> Warning
            </div>
          </ModalHeader>
          <ModalBody
            className="w-100 scrollable-modal confirm-modal"
          >
            <h5 className="text-justify h5">
              <div>You're trying to submit files, which hasn't selected Case Name or File Form!</div>
              {correctFiles.length > 0 ? (
                <>
                <div>Do you want to submit only correctly filled files?</div>
                </>
              ) : (
                <>
                  <div className="font-weight-bold">Please fill in the missing information and try again.</div>
                </>
              )}
            </h5>
          </ModalBody>
          <ModalFooter>
            {correctFiles.length > 0 ? (
              <>
                <Button className="ld-button-success" type="submit" onClick={this.submitFiles}>Submit</Button>
              <Button className="ld-button-danger" type="submit" onClick={this.props.hideModal}>Cancel</Button>
              </>
            ) : (
              <>
                <Button className="ld-button-success" type="submit" onClick={this.props.hideModal}>Ok</Button>
              </>
            )}            
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
    show: () => dispatch(PreloaderActions.showPreloader("WRONG_ROWS_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("WRONG_ROWS_MODAL"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WrongRowsModal);
