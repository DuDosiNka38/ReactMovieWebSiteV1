import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "../../store/modal/actions";
import * as CaseActions from "../../store/case/actions";
import * as PreloaderActions from "../../store/preloader/actions";

import notify from "../../services/notification";
import CaseApi from "../../api/CaseApi";
import notification from "../../services/notification";

class DeleteCaseParticipantModal extends Component {
  state = {};

  submitDeleteCaseParticipant = async () => {
    const { Case_NAME, Person_id, Preloader } = this.props;
    Preloader.show();
    const resDelCaseParticipant = await CaseApi.deleteCaseParticipant({Case_NAME: Case_NAME, Person_id: Person_id});

    if(!resDelCaseParticipant.result){
      notification.isError(resDelCaseParticipant.data.error_message);
      Preloader.hide();
      return false;
    }
    this.props.fetchCaseParticipants(Case_NAME);
    this.props.hideModal();
    Preloader.hide();
  }

  componentDidMount() {
  }

  render() {
    const { Cases, Case_NAME, isLoading, User } = this.props;
    const Case = Cases.find((x) => x.Case_NAME === Case_NAME) || {};
    return (
      <>
        <Modal isOpen={true} centered={true} className="new-case-modal" size="m">
          <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
            Delete Case Participant
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal manage-case-participants confirm-modal">
            <h5 className="text-justify h5">Are you sure want to delete <b>{this.props.Person_NAME}</b> from Case Participants of <b>{this.props.Case_NAME}</b> irrevocably? All related data will also be deleted.</h5>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button
              className="ld-button-success mr-2"
              onClick={this.submitDeleteCaseParticipant}
            >
              Submit
            </Button>
            <Button className="ld-button-danger" onClick={this.props.hideModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.User.data,
  Cases: state.Case.cases,
  isLoading: state.Case.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  fetchCaseParticipants: (Case_NAME) => dispatch(CaseActions.caseParticipantsFetchRequested(Case_NAME)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("DELETE_CASE_PARTICIPANT")),
    hide: () => dispatch(PreloaderActions.hidePreloader("DELETE_CASE_PARTICIPANT"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteCaseParticipantModal);
