import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "../../store/modal/actions";
import * as CaseActions from "../../store/case/actions";
import * as PersonnelActions from "../../store/personnel/actions";

import notify from "../../services/notification";
import CaseApi from "../../api/CaseApi";
import CaseCardForModal from "../../components/Case/CaseCardForModal";
import AvCheckboxGroup from "availity-reactstrap-validation/lib/AvCheckboxGroup";
import AvCheckbox from "availity-reactstrap-validation/lib/AvCheckbox";
import notification from "../../services/notification";

class ChooseExistingPersonModal extends Component {
  state = {
    chkBoxModel: [],
    isMainChecked: false,
  };

  toggleOne = (e) => {
    let { chkBoxModel } = this.state;
    const { Cases, Case_Short_NAME, Personnel } = this.props;
    const { value, checked, name } = e.currentTarget;
    const Case = Cases.find((x) => x.Case_Short_NAME === Case_Short_NAME) || {};
    const Case_Participants = Case.Case_Participants || [];
    const availablePersons = Personnel.filter((x) => !Case_Participants.map((y) => y.Person_id).includes(x.Person_id));

    if (checked === false && chkBoxModel.indexOf(value) >= 0)
      chkBoxModel.splice(chkBoxModel.indexOf(value), 1);
    if (checked === true) chkBoxModel.push(value);
    this.setState({ chkBoxModel: chkBoxModel, isMainChecked: chkBoxModel.length === availablePersons.length });
  };

  toggleAll = (e) => {
    let { chkBoxModel } = this.state;
    const { Cases, Case_Short_NAME, Personnel } = this.props;
    const Case = Cases.find((x) => x.Case_Short_NAME === Case_Short_NAME) || {};
    const Case_Participants = Case.Case_Participants || [];
    const availablePersons = Personnel.filter((x) => !Case_Participants.map((y) => y.Person_id).includes(x.Person_id));
    const { checked } = e.currentTarget || e;
    chkBoxModel = [];
    if (checked === true) {
      availablePersons.map((x) => {
        chkBoxModel.push(x.Person_id);
      });
    }
    this.setState({ chkBoxModel: chkBoxModel, isMainChecked: checked });
  };

  nextStep = () => {
    const { Personnel, Case_Short_NAME } = this.props;
    const { chkBoxModel } = this.state;

    const Choosed_Persons = Personnel.filter((x) => chkBoxModel.includes(x.Person_id));

    if(Choosed_Persons.length === 0){
      notification.isError("You need to choose at least one person!");
      return false;
    }

    this.props.hideModal();
    this.props.showModal("CP_CHOOSE_ROLES", {Choosed_Persons, Case_NAME: Case_Short_NAME} )
  }

  componentDidMount() {
    this.props.fetchCaseParticipants(this.props.Case_Short_NAME);
    this.props.fetchPersonnel();
  }

  render() {
    let { chkBoxModel, isMainChecked } = this.state;
    const { Cases, Case_Short_NAME, isLoading, User, Personnel } = this.props;
    const Case = Cases.find((x) => x.Case_Short_NAME === Case_Short_NAME) || {};
    const Case_Participants = Case.Case_Participants || [];

    const availablePersons = Personnel.filter((x) => !Case_Participants.map((y) => y.Person_id).includes(x.Person_id));
    
    return (
      <>
        <Modal isOpen={true} centered={true} className="new-case-modal" size="xl" style={{ width: "800px" }}>
          <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
           Choose a Participant
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal manage-case-participants">
            <CaseCardForModal Case_Short_NAME={Case.Case_Short_NAME} />
            <AvForm>
              <AvCheckboxGroup name="existingPersons">
                <Table className="customTable">
                  <thead>
                    <tr>
                      <td>
                        <AvCheckbox customInput onChange={this.toggleAll} checked={isMainChecked} />
                      </td>
                      <td>Person Identifier</td>
                      <td>Name</td>
                      <td>E-mail Address</td>
                      <td>Phone Number</td>
                      <td>App Role</td>
                    </tr>
                  </thead>
                  <tbody>
                    {availablePersons.length ? (
                      <>
                        {availablePersons.map((p) => (
                      <>
                        <tr>
                          <td>
                            <AvCheckbox 
                            customInput 
                            value={p.Person_id} 
                            onChange={this.toggleOne} 
                            checked={
                              chkBoxModel.includes(
                                p.Person_id
                                )
                              } 
                            />
                          </td>
                          <td>{p.Person_id}</td>
                          <td>{p.NAME}</td>
                          <td>{p.Email_address || "-"}</td>
                          <td>{p.Phone_number || "-"}</td>
                          <td>{p.Role || "-"}</td>
                        </tr>
                      </>
                    ))}
                      </>
                    ) : (
                      <>
                        <td colSpan={6}>All avaliable Persons already Assigned to Case!</td>
                      </>
                    )}
                    
                  </tbody>
                </Table>
              </AvCheckboxGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter className="p-0  mfooterGT">
            <Button
              className="ld-button-success m-0 border-0"
              onClick={this.nextStep}
            >
              Submit
            </Button>
            <Button className="ld-button-danger border-0" onClick={this.props.hideModal}>
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
  Personnel: state.Personnel.personnel,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  fetchPersonnel: () => dispatch(PersonnelActions.personnelFetchRequested()),
  fetchCaseParticipants: (Case_NAME) => dispatch(CaseActions.caseParticipantsFetchRequested(Case_NAME)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseExistingPersonModal);
