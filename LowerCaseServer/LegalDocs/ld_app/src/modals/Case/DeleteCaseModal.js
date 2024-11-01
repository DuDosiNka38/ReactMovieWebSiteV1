import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";
import * as PreloaderActions from "./../../store/preloader/actions";

import notify from "./../../services/notification";
import CaseApi from "../../api/CaseApi";

class DeleteCaseModal extends Component {
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

  render() {
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="m">
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Delete Case
          </ModalHeader>
          <ModalBody
            className="w-100 scrollable-modal confirm-modal"
          >
            <h5 className="text-justify h5">Are you sure want to delete this case? All documents will be deleted.</h5>
          </ModalBody>
          <ModalFooter className="mfooterGT">
            <Button className="ld-button-success" type="submit" onClick={this.deleteCase}>Submit</Button>
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
    show: () => dispatch(PreloaderActions.showPreloader("NEW_CASE_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NEW_CASE_MODAL"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteCaseModal);
