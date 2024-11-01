import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import Select from "react-select";

import * as ModalActions from "../../store/modal/actions";
import * as CaseActions from "../../store/case/actions";
import * as PreloaderActions from "../../store/preloader/actions";

import CaseCardForModal from "../../components/Case/CaseCardForModal";
import { checkAvailability, isHasEmptyFields, isHasNotAvailable } from "../../services/FormChecker";
import UserApi from "../../api/UserApi";
import { filterObj } from "../../services/Functions";
import notification from "../../services/notification";
import CaseApi from "../../api/CaseApi";

class AddNewPersonModal extends Component {
  state = {
    Person_id: null,
    First_Name: null,
    Last_Name: null,
    Email_address: null,
    Phone_number: null,
    Case_Participant_ROLE: null,
    Case_Participant_SIDE: null,
  };

  handleInputChange = (e, val) => {
    const { name } = e.currentTarget;

    const element = document.querySelector(`#${name}`);
    if(element)
      element.classList.remove('available', 'not-available');

    this.setState({ [name]: val });
  };

  handleSelectChange = (el, e) => {
    const { value } = el;
    const { name } = e;
    this.setState({ [name]: value });
  };

  checkAvailability = async (e, val) => {
    const { name } = e.currentTarget;

    switch(name){
      case 'Person_id':
        return checkAvailability(name, val, UserApi.fetchSinglePerson);
      
      default:
        break;
    }    
  }

  isHasEmptyFields = () => {
    const userData = {...this.state};

    return isHasEmptyFields(userData); 
  }

  submitAddCaseParticipant = async () => {
    const { Preloader, Case_Short_NAME } = this.props;
    Preloader.show();

    if(isHasNotAvailable()){
      Preloader.hide();
      return false;
    }

    if(this.isHasEmptyFields()){
      Preloader.hide();
      return false;      
    }
    
    const userData = {
      ...filterObj(
        this.state, 
        (v, i) => {
          return !['First_Name', 'Last_Name', 'Case_Participant_ROLE', 'Case_Participant_SIDE'].includes(i)
        }
      ), 
      NAME: `${this.state.First_Name} ${this.state.Last_Name}`
    };

    const resPerson = await UserApi.postPerson(userData);
    
    if(!resPerson.result){
      notification.isError(resPerson.data.error_message);
      return false;
    }

    const caseParticipant = {
      Person_id: resPerson.data.Person_id,
      Case_NAME: Case_Short_NAME,
      Case_Participant_ROLE: this.state.Case_Participant_ROLE,
      Case_Participant_SIDE: this.state.Case_Participant_SIDE
    };
    const resCaseParticipant = await CaseApi.postCaseParticipant(caseParticipant);

    if(!resCaseParticipant.result){
      notification.isError(resCaseParticipant.data.error_message);
      return false;
    }

    this.props.fetchCaseParticipants(Case_Short_NAME);
    
    this.props.hideModal(this.props.type);

    Preloader.hide();
  }

  componentDidMount() {
    this.props.fetchCaseParticipants(this.props.Case_Short_NAME);
    this.props.fetchCaseRoles();
    this.props.fetchCaseSides();
  }

  render() {
    const { Cases, Case_Short_NAME, isLoading, User, caseRoles, caseSides } = this.props;
    
    const Case = Cases.find((x) => x.Case_Short_NAME === Case_Short_NAME) || {};

    return (
      <>
        <Modal isOpen={true} centered={true} className="new-case-modal" size="xl" style={{ width: "700px" }}>
          <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
            Add New Person
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal manage-case-participants">
            <CaseCardForModal Case_Short_NAME={Case.Case_Short_NAME}/>
            <AvForm className="form-horizontal" onValidSubmit={this.submitNewCaseForm}>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-fingerprint-line"></i>
                <Label htmlFor="Person_id">Person Identifier</Label>
                <AvField
                  name="Person_id"
                  type="text"
                  className="form-control"
                  id="Person_id"
                  validate={{ required: true }}
                  placeholder="ex. User"
                  onChange={this.handleInputChange}
                  onBlur={this.checkAvailability}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-font-size"></i>
                <Label htmlFor="First_Name">First Name</Label>
                <AvField
                  name="First_Name"
                  type="text"
                  className="form-control"
                  id="First_Name"
                  placeholder="ex. John"
                  onChange={this.handleInputChange}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-font-size"></i>
                <Label htmlFor="Last_Name">Last Name</Label>
                <AvField
                  name="Last_Name"
                  type="text"
                  className="form-control"
                  id="Last_Name"
                  placeholder="ex. Doe"
                  onChange={this.handleInputChange}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-at-line"></i>
                <Label htmlFor="Email_address">E-mail Address</Label>
                <AvField
                  name="Email_address"
                  type="text"
                  className="form-control"
                  id="Email_address"
                  placeholder="ex. john.doe@doe.com"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class=" ri-phone-line"></i>
                <Label htmlFor="Phone_number">Phone Number</Label>
                <AvField
                  name="Phone_number"
                  type="text"
                  className="form-control"
                  id="Phone_number"
                  placeholder="ex. +1-541-754-3010"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-4 text-left">
                <Label htmlFor="Case_Participant_ROLE">Participant Role</Label>
                <Select
                  name="Case_Participant_ROLE"
                  id="Case_Participant_ROLE"
                  options={caseRoles.map((x) => ({ value: x.Role, label: x.Description }))}
                  onChange={this.handleSelectChange}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="mb-4 text-left">
                <Label htmlFor="Case_Participant_SIDE">Participant Side</Label>
                <Select
                  name="Case_Participant_SIDE"
                  id="Case_Participant_SIDE"
                  options={caseSides.map((x) => ({ value: x.Side, label: x.Description }))}
                  onChange={this.handleSelectChange}
                  required={true}
                />
              </FormGroup>
            </AvForm>
            
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button
              className="ld-button-success mr-2"
              onClick={this.submitAddCaseParticipant}
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
  caseRoles: state.Case.caseRoles,
  caseSides: state.Case.caseSides,
  isLoading: state.Case.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),

  fetchCaseParticipants: (Case_NAME) => dispatch(CaseActions.caseParticipantsFetchRequested(Case_NAME)),
  fetchCaseRoles: () => dispatch(CaseActions.caseRolesFetchRequested()),
  fetchCaseSides: () => dispatch(CaseActions.caseSidesFetchRequested()),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("NEW_PERSON_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NEW_PERSON_MODAL"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNewPersonModal);
