import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "./../../store/modal/actions";
import * as PreloaderActions from "./../../store/preloader/actions";
import * as CaseActions from "./../../store/case/actions";

import Textarea from "../../components/FormComponents/Textarea/Textarea";
import Select from "react-select";
import { HuePicker } from "react-color";
import CaseBlock from "../../components/Case/CaseBlock";
import notify from "./../../services/notification";
import CaseApi from "../../api/CaseApi";
import { checkAvailability, isHasEmptyFields, isHasNotAvailable } from "../../services/FormChecker";

class NewCaseModal extends Component {
  state = {
    Case_Short_NAME: null,
    Case_Full_NAME: null,
    Case_Number: null,
    DESCRIPTION: null,
    Case_Type: null,
    Department_id: null,
    CaseBg: "#ff0000",
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

  handleChangeComplete = (color) => {
    this.setState({ CaseBg: color.hex });
  };

  checkAvailability = async (e, val) => {
    const { name } = e.currentTarget;

    switch(name){
      case 'Case_Short_NAME':
        return await checkAvailability(name, val, CaseApi.fetchSingleCase);
      
      default:
        break;
    }    
  }

  isHasEmptyFields = () => {
    const caseData = {...this.state};

    return isHasEmptyFields(caseData); 
  }

  submitNewCaseForm = async () => {
    const { Preloader, User, Case } = this.props;
    Preloader.show();

    console.log(isHasNotAvailable())

    if(isHasNotAvailable()){
      Preloader.hide();
      return false;
    }

    if(this.isHasEmptyFields()){
      Preloader.hide();
      return false;      
    }
    
    const caseData = {...this.state};
    const res = await CaseApi.postCase(caseData);

    if(res.result){
      const caseParticipant = {
        Person_id: User.Person_id,
        Case_NAME: caseData.Case_Short_NAME,
        Case_Participant_ROLE: "OWNER"
      };

      await CaseApi.postCaseParticipant(caseParticipant);
      Case.getSingle(caseData.Case_Short_NAME);

      this.props.hideModal();
      this.props.showModal("MANAGE_CASE_PARTICIPANTS", {Case_Short_NAME: caseData.Case_Short_NAME});
    }
    Preloader.hide();
  };

  componentDidMount() {
    const { requestDepartments, requestCaseTypes } = this.props;

    // if(!caseTypes){
      requestCaseTypes();
      requestDepartments();
    // }
  }

  render() {
    const { CaseBg } = this.state;
    const { caseTypes } = this.props;
    return (
      <>
        <Modal isOpen={true} centered={true} className="new-case-modal" size="xl" style={{ width: "700px" }} >
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            New Case
          </ModalHeader>
          <ModalBody
            className="w-100 scrollable-modal"
          >
            <AvForm className="form-horizontal" onValidSubmit={this.submitNewCaseForm}>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-fingerprint-line"></i>
                <Label htmlFor="Case_Short_NAME">Case Identifier</Label>
                <AvField
                  name="Case_Short_NAME"
                  type="text"
                  className="form-control"
                  id="Case_Short_NAME"
                  validate={{
                    required: {value: true, errorMessage: 'Please enter Case ID'},
                    pattern: {value: '^[A-Za-z0-9_-]+$', errorMessage: 'Case ID must not contain spaces'},
                   
                  }} 
                  placeholder="ex. MY_CASE"
                  onChange={this.handleInputChange}
                  onBlur={this.checkAvailability}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-briefcase-line"></i>
                <Label htmlFor="Case_Full_NAME">Case Name</Label>
                <AvField
                  name="Case_Full_NAME"
                  type="text"
                  className="form-control"
                  id="Case_Full_NAME"
                  placeholder="ex. My New Case"
                  onChange={this.handleInputChange}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-hashtag"></i>
                <Label htmlFor="Case_Number">Case Number</Label>
                <AvField
                  name="Case_Number"
                  type="text"
                  className="form-control"
                  id="Case_Number"
                  placeholder="ex. 45632578"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-4 form-textarea">
                <Textarea maxLen={500} label="Description" name="DESCRIPTION" placeholder="ex. My First Successfull Case" onChange={this.handleInputChange}/>
              </FormGroup>
              <FormGroup className="mb-4 text-left">
                <Label htmlFor="Case_Type">Case Type</Label>
                <Select
                  name="Case_Type"
                  id="Case_Type"
                  options={caseTypes.map((x) => ({ value: x.Case_Type, label: x.Description }))}
                  onChange={this.handleSelectChange}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="mb-4 text-left">
                <Label htmlFor="Department_id">Department</Label>
                <Select
                  name="Department_id"
                  id="Department_id"
                  options={this.props.departments.map((x) => ({ value: x.Department_id, label: x.Department_Name }))}
                  onChange={this.handleSelectChange}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="mb-4 text-left">
                <Label htmlFor="CaseBg">Case Color</Label>
                <HuePicker name="CaseBg" color={CaseBg} onChangeComplete={this.handleChangeComplete} width="100%" className="mb-2"/>

                <Label htmlFor="CaseBg">Case Card Example</Label>
                <CaseBlock caseData={this.state} disableLinks={true}/>

                {/* <div className="d-block">
                  <Label htmlFor="CaseBg">Case Color</Label>
                  <ChromePicker name="CaseBg" color={CaseBg} onChangeComplete={this.handleChangeComplete} className="mb-2"/>
                </div>

                <div className="d-block">
                  <Label htmlFor="CaseBg">Case Card Example</Label>
                  <CaseBlock caseData={this.state} disableLinks={true}/>
                </div> */}
              </FormGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter className="mfooterGTO">
            <Button className="ld-button-success" type="submit" onClick={this.submitNewCaseForm}>Submit</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  caseTypes: state.Case.caseTypes,
  departments: state.Case.departments,
  User: state.User.data
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),

  requestCaseTypes: () => dispatch(CaseActions.caseTypesFetchRequested()),
  requestDepartments: () => dispatch(CaseActions.departmentsFetchRequested()),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("NEW_CASE_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NEW_CASE_MODAL"))
  },
  Case: {
    getSingle: (Case_Short_NAME) => dispatch(CaseActions.userSingleCaseFetchRequested(Case_Short_NAME))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewCaseModal);
