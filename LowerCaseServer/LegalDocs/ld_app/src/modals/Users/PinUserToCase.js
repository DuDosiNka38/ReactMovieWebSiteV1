import React, { Component } from "react";
import {
  Button,
  Label,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Table,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";

import notify from "./../../services/notification";
import CaseApi from "../../api/CaseApi";
import Select from "react-select";
import { isHasEmptyFields } from "../../services/FormChecker";
import notification from "./../../services/notification";
import { filterObj } from "../../services/Functions";
import AvCheckboxGroup from "availity-reactstrap-validation/lib/AvCheckboxGroup";
import AvCheckbox from "availity-reactstrap-validation/lib/AvCheckbox";
import * as PreloaderActions from "./../../store/preloader/actions";

class PinUserToCase extends Component {
  state = {
    Case_Participants: [],
    User_Cases: [],
    chkBoxModel: [],
    isMainChecked: false,
  };

  toggleOne = (e) => {
    let { chkBoxModel, User_Cases, Case_Participants } = this.state;
    const { allCases, userData } = this.props;
    const { value, checked, name } = e.currentTarget;
    const availableCases = allCases.filter(
      (x) =>
        User_Cases.find((c) => c.Case_Short_NAME === x.Case_Short_NAME) ===
        undefined
    );

    if (
      checked === false &&
      chkBoxModel.indexOf(value) >= 0 &&
      Case_Participants.findIndex((x) => x.Case_NAME === value) >= 0
    ) {
      chkBoxModel.splice(chkBoxModel.indexOf(value), 1);
      Case_Participants.splice(
        Case_Participants.findIndex((x) => x.Case_Short_NAME === value),
        1
      );
    }

    if (checked === true) {
      chkBoxModel.push(value);
      Case_Participants.push({
        Person_id: userData.Person_id,
        Case_NAME: value,
        Case_Participant_ROLE: null,
        Case_Participant_SIDE:
          userData.Role === null && userData.Password === null
            ? null
            : "OFFICE",
      });
    }
    this.setState({
      chkBoxModel: chkBoxModel,
      isMainChecked: chkBoxModel.length === availableCases.length,
      Case_Participants,
    });
  };

  toggleAll = (e) => {
    let { chkBoxModel, User_Cases, Case_Participants } = this.state;
    const { allCases, userData } = this.props;
    const { value, checked, name } = e.currentTarget;
    const availableCases = allCases.filter(
      (x) =>
        User_Cases.find((c) => c.Case_Short_NAME === x.Case_Short_NAME) ===
        undefined
    );
    chkBoxModel = [];
    if (checked === true) {
      availableCases.map((x) => {
        chkBoxModel.push(x.Case_Short_NAME);
        Case_Participants.push({
          Person_id: userData.Person_id,
          Case_NAME: x.Case_Short_NAME,
          Case_Participant_ROLE: null,
          Case_Participant_SIDE:
            userData.Role === null && userData.Password === null
              ? null
              : "OFFICE",
        });
      });
    }
    this.setState({
      chkBoxModel: chkBoxModel,
      isMainChecked: checked,
      Case_Participants: checked ? Case_Participants : [],
    });
  };

  handleSelectChange = (el, e) => {
    const { Case_Participants } = this.state;
    const { value, Person_id } = el;
    const { name } = e;

    Case_Participants.map((x) => {
      if (x.Person_id === Person_id) {
        x[name] = value;
      }
    });
    this.setState({ Case_Participants: Case_Participants });
  };

  submitCaseParticipants = async () => {
    const { User, userData, Preloader } = this.props;
    const { Case_Participants } = this.state;

    Preloader.show();

    let error = false;

    Case_Participants.map((x) => {
      const check = isHasEmptyFields(x);
      if (check) error = true;
    });

    if (error) {
      notification.isError("You have not completed all the fields!");
      Preloader.hide();
      return false;
    }

    const resCaseParticipants = await CaseApi.postCaseParticipants(
      Case_Participants
    );

    if (!resCaseParticipants.result) {
      notification.isError(resCaseParticipants.data.error_message);
      Preloader.hide();
      return false;
    } else {
      notification.isSuck("User succsesfully attached to cases!");
    }

    if (User.Person_id === userData.Person_id) {
      this.props.fetchUserCases();
    }

    this.props.hideModal(this.props.type);
    Preloader.hide();
  };

  componentDidMount = async () => {
    this.props.fetchCaseRoles();
    this.props.fetchCaseSides();
    this.props.fetchAllCases();

    const userCases = await CaseApi.fetchCasesByPersonId(
      this.props.userData.Person_id
    );
    this.setState({ User_Cases: userCases });
  };

  render() {
    const { User_Cases, chkBoxModel, isMainChecked, Case_Participants } =
      this.state;
    const { allCases, caseRoles, caseSides, userData } = this.props;

    return (
      <>
        <Modal
          isOpen={true}
          centered={true}
          className="delete-case-modal"
          size="xl"
          style={{ width: "800px" }}
        >
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Select Case and Role
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal  p-0">
            <AvForm>
              <AvCheckboxGroup name="cases" style={{marginBottom: "0"}}>
                <Table className="customTable mb-0">
                  <thead>
                    <tr>
                      <td>
                        <AvCheckbox
                          customInput
                          onChange={this.toggleAll}
                          checked={isMainChecked}
                        />
                      </td>
                      <td>Case Identifier</td>
                      <td>Case Name</td>
                      <td>Role</td>
                      {userData.Role === null && userData.Password === null && (
                        <td>Side</td>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {allCases
                      .filter(
                        (x) =>
                          User_Cases.find(
                            (c) => c.Case_Short_NAME === x.Case_Short_NAME
                          ) === undefined
                      )
                      .map((Case) => (
                        <>
                          <tr>
                            <td>
                              <AvCheckbox
                                customInput
                                value={Case.Case_Short_NAME}
                                onChange={this.toggleOne}
                                checked={chkBoxModel.includes(
                                  Case.Case_Short_NAME
                                )}
                              />
                            </td>
                            <td>{Case.Case_Short_NAME}</td>
                            <td>{Case.Case_Full_NAME}</td>
                            <td>
                              <Select
                                name="Case_Participant_ROLE"
                                id="Case_Participant_ROLE"
                                options={caseRoles
                                  .filter((x) => x.Show == true)
                                  .map((x) => ({
                                    value: x.Role,
                                    label: x.Description,
                                    Person_id: userData.Person_id,
                                  }))}
                                // value={null}
                                onChange={this.handleSelectChange}
                                required={true}
                                isDisabled={
                                  !chkBoxModel.includes(Case.Case_Short_NAME)
                                }
                              />
                            </td>
                            {userData.Role === null &&
                              userData.Password === null && (
                                <td>
                                  <Select
                                    name="Case_Participant_SIDE"
                                    id="Case_Participant_SIDE"
                                    options={caseSides.map((x) => ({
                                      value: x.Side,
                                      label: x.Description,
                                      Person_id: userData.Person_id,
                                    }))}
                                    onChange={this.handleSelectChange}
                                    required={true}
                                  />
                                </td>
                              )}
                          </tr>
                        </>
                      ))}
                  </tbody>
                </Table>
              </AvCheckboxGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button
              className="ld-button-success"
              type="submit"
              onClick={this.submitCaseParticipants}
            >
              Submit
            </Button>
            <Button
              className="ld-button-danger"
              type="submit"
              onClick={this.props.hideModal}
            >
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
  allCases: state.Case.allCases,
  caseRoles: state.Case.caseRoles,
  caseSides: state.Case.caseSides,

  User: state.User.data,
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  fetchAllCases: () => dispatch(CaseActions.allCasesFetchRequested()),
  fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),
  fetchCaseRoles: () => dispatch(CaseActions.caseRolesFetchRequested()),
  fetchCaseSides: () => dispatch(CaseActions.caseSidesFetchRequested()),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("NEW_USER_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NEW_USER_MODAL")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PinUserToCase);
