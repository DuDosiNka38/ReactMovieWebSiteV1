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
import notification from "./../../services/notification";
import CaseApi from "../../api/CaseApi";
import { filterObj } from "../../services/Functions";

import { checkAvailability, isHasEmptyFields, isHasNotAvailable } from "../../services/FormChecker";

class SettingCaseModal extends Component {
  state = {
    // Case_Short_NAME: null,
    // Case_Full_NAME: null,
    // Case_Number: null,
    // DESCRIPTION: null,
    // Case_Type: null,
    // Department_id: null,
    // CaseBg: this.props.CaseData.CaseBg,
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

 
  componentDidMount() {
		this.setState({...this.props.CaseData})
  }

updateCase = async () => {
  const { Preloader } = this.props;
  Preloader.show();
	const caseData = {
		...filterObj(
			this.state, 
			(v, i) => {
				return !["Case_Docs_Count", "Case_Events_Count", "Case_Participants"].includes(i)
			}
		),
	};
	
	const res = await CaseApi.putCase(this.state.Case_Short_NAME, caseData);
	if(res) {
    this.props.fetchUserCases();
		notification.isSuck("Case is successfully updated")
		this.props.hideModal(this.props.type);
	}

  Preloader.hide();
}

  render() {
    const { CaseBg , Case_Short_NAME, Case_Full_NAME, DESCRIPTION, Case_Number, Case_Type, Department_id} = this.state;
    
    return (
      <>
        <Modal isOpen={true} centered={true} className="new-case-modal" size="xl" style={{ width: "700px" }}>
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Case Settings
          </ModalHeader>
          <ModalBody
            className="w-100 scrollable-modal"
          >
            <AvForm className="form-horizontal">
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
									disabled = {true}
                  placeholder="ex. MY_CASE"
                  onChange={this.handleInputChange}
                  onBlur={this.checkAvailability}
                  required={true}
									value = {Case_Short_NAME}
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
									value = {Case_Full_NAME}

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
									value = {Case_Number}

                />
              </FormGroup>
              <FormGroup className="mb-4 form-textarea">
                <Textarea maxLen={500} label="Description" name="DESCRIPTION" placeholder="ex. My First Successfull Case" value = {DESCRIPTION} onChange={this.handleInputChange}/>
              </FormGroup>
              <FormGroup className="mb-4 text-left">
                <Label htmlFor="Case_Type">Case Type</Label>
                <Select
                  name="Case_Type"
                  id="Case_Type"
                  options={this.props.caseTypes.map((x) => ({ value: x.Case_Type, label: x.Description }))}
                  onChange={this.handleSelectChange}
                  required={true}
									defaultValue = {this.props.caseTypes.map((x) => ({ value: x.Case_Type, label: x.Description })).filter((y) => y.value === Case_Type)}
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
									defaultValue = {this.props.departments.map((x) => ({ value: x.Department_id, label: x.Department_Name })).filter((y) => y.value === Department_id)}
                />
              </FormGroup>
              <FormGroup className="mb-4 text-left">
                <Label htmlFor="CaseBg">Case Color</Label>
                <HuePicker name="CaseBg" color={this.state.CaseBg} onChangeComplete={this.handleChangeComplete} width="100%" className="mb-2"/>

                <Label htmlFor="CaseBg">Case Card Example</Label>
                <CaseBlock caseData={this.state} disableLinks={true}/>
              </FormGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter className="mfooterGTO">
            <Button className="ld-button-success" type="submit" onClick={this.updateCase}>Submit</Button>
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
  fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("NEW_CASE_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NEW_CASE_MODAL"))
  },
  Case: {
    getSingle: (Case_Short_NAME) => dispatch(CaseActions.userSingleCaseFetchRequested(Case_Short_NAME))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingCaseModal);
