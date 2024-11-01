import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";
import * as PreloaderActions from "../../store/preloader/actions";

import notify from "./../../services/notification";
import CaseApi from "../../api/CaseApi";
import CaseCardForModal from "../../components/Case/CaseCardForModal";
import Select from "react-select";
import { isHasEmptyFields } from "../../services/FormChecker";
import notification from "./../../services/notification";
import { filterObj } from "../../services/Functions";

class ChooseCaseParticipantsRolesModal extends Component {
  state = {
    Case_Participants: [],
  };

  handleSelectChange = (el, e) => {
    const {Case_Participants} = this.state;
    const { value, Person_id } = el;
    const { name } = e;

    Case_Participants.map((x) => {
      if(x.Person_id === Person_id){
        x[name] = value;
      }
    });
    this.setState({ Case_Participants: Case_Participants });
  };

  submitCaseParticipants = async () => {
    const { Preloader, Case_NAME } = this.props;
    const {Case_Participants} = this.state;
    let error = false;
    Preloader.show();
    
    Case_Participants.map((x) => {
      const check =isHasEmptyFields(x);
      if(check)
        error = true;
    });

    if(error){
      notification.isError("You have not completed all the fields!");
      Preloader.hide();
      return false;
    }
    const postData = Case_Participants.map(
      (x, i, a) => (
        filterObj(x, 
          (v, i) => {
            return i !== "Person_NAME"
          }
        )
      )
    );

    const resCaseParticipants = await CaseApi.postCaseParticipants(postData);

    if(!resCaseParticipants.result){
      notification.isError(resCaseParticipants.data.error_message);
      Preloader.hide();
      return false;
    }

    this.props.fetchCaseParticipants(Case_NAME);

    this.props.hideModal();
    Preloader.hide();
  }

  componentDidMount() {
    this.props.fetchCaseRoles();
    this.props.fetchCaseSides();

    const { Choosed_Persons, Case_NAME } = this.props;
    const Case_Participants = [];
    Choosed_Persons.map((p) => {
      Case_Participants.push({
        Person_id: p.Person_id,
        Person_NAME: p.NAME,
        Case_NAME: Case_NAME,
        Case_Participant_ROLE: null,
        Case_Participant_SIDE: null,
      });
    });

    this.setState({ Case_Participants: Case_Participants });
  }

  render() {
    const { Case_Participants } = this.state;
    const { Case_NAME, caseRoles, caseSides } = this.props;

    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="xl" style={{ width: "800px" }}>
          <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
            Choose Roles
          </ModalHeader>
          <ModalBody className="w-100">
            <CaseCardForModal Case_Short_NAME={Case_NAME} />
            <Table className="customTable">
              <thead>
                <tr>
                  <td>
                  </td>
                  <td>Person Identifier</td>
                  <td>Name</td>
                  <td>Role</td>
                  <td>Side</td>
                </tr>
              </thead>
              <tbody>
                {Case_Participants.map((p) => (
                  <>
                    <tr>
                      <td>
                      </td>
                      <td>{p.Person_id}</td>
                      <td>{p.Person_NAME}</td>
                      <td>
                        <Select
                          name="Case_Participant_ROLE"
                          id="Case_Participant_ROLE"
                          options={caseRoles.filter((x) => x.Show == true).map((x) => ({ value: x.Role, label: x.Description, Person_id: p.Person_id }))}
                          onChange={this.handleSelectChange}
                          required={true}
                        />
                      </td>
                      <td>
                        <Select
                          name="Case_Participant_SIDE"
                          id="Case_Participant_SIDE"
                          attr-Person_id={p.Person_id}
                          options={caseSides.map((x) => ({ value: x.Side, label: x.Description, Person_id: p.Person_id }))}
                          onChange={this.handleSelectChange}
                          required={true}
                        />
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-success" type="submit" onClick={this.submitCaseParticipants}>
              Submit
            </Button>
            <Button className="ld-button-danger" type="submit" onClick={this.props.hideModal}>
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
  Personnel: state.Personnel.personnel,
  caseRoles: state.Case.caseRoles,
  caseSides: state.Case.caseSides,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  fetchCaseRoles: () => dispatch(CaseActions.caseRolesFetchRequested()),
  fetchCaseSides: () => dispatch(CaseActions.caseSidesFetchRequested()),
  fetchCaseParticipants: (Case_NAME) => dispatch(CaseActions.caseParticipantsFetchRequested(Case_NAME)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("CHOOSE_CP_ROLES")),
    hide: () => dispatch(PreloaderActions.hidePreloader("CHOOSE_CP_ROLES"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseCaseParticipantsRolesModal);
