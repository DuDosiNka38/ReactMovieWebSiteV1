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
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "./../../../../store/modal/actions";
import * as PreloaderActions from "./../../../../store/preloader/actions";
import * as CaseActions from "./../../../../store/case/actions";

import Textarea from "./../../../../components/FormComponents/Textarea/Textarea";
import Select from "react-select";
import notification from "../../../../services/notification";
// import notify from "./../../../../../services/notification";

class AddDepartmantModal extends Component {
  state = {};

  handleInputChange = (e, val) => {
    const { name } = e.currentTarget;

    const element = document.querySelector(`#${name}`);
    if (element) element.classList.remove("available", "not-available");

    this.setState({ [name]: val });
  };

  handleSelectChange = (el, e) => {
    const { value } = el;
    const { name } = e;
    this.setState({ [name]: value });
  };

  componentDidMount() {
		this.props.requestCalendars()
	}

	addDepartment = async () => {
		const res = await this.props.addDepartment(this.state)

		if(res) {
			notification.isSuck("Department succsesfuly added.") 
			this.props.hideModal()
		} 
		// notification.isError(res.error_text)
	}
  render() {
		const {calendars}= this.props
    return (
      <>
        <Modal
          isOpen={true}
          centered={true}
          className="new-case-modal"
          size="xl"
          style={{ width: "700px" }}
        >
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Add Department
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal">
            <AvForm
              className="form-horizontal"
              onValidSubmit={this.addDepartment}
            >
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-fingerprint-line"></i>
                <Label htmlFor="Department_id">Department Identifier</Label>
                <AvField
                  name="Department_id"
                  type="text"
                  className="form-control"
                  id="Department_id"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter Department ID",
                    },
                    pattern: {
                      value: "^[A-Za-z0-9_-]+$",
                      errorMessage: "Department ID must not contain spaces",
                    },
                  }}
                  placeholder="ex. DEPARTMENT_1"
                  onChange={this.handleInputChange}
                  onBlur={this.checkAvailability}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-government-line"></i>
                <Label htmlFor="Department_Name">Department Name</Label>
                <AvField
                  name="Department_Name"
                  type="text"
                  className="form-control"
                  id="Department_Name"
                  placeholder="ex. Departmant 123 "
                  required={true}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-hashtag"></i>
                <Label htmlFor="Court_name">Court Name</Label>
                <AvField
                  name="Court_name"
                  type="text"
                  className="form-control"
                  id="Court_name"
                  placeholder="ex. Fam"
                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-hashtag"></i>
                <Label htmlFor="Judge_name">Judge Name</Label>
                <AvField
                  name="Judge_name"
                  type="text"
                  className="form-control"
                  id="Judge_name"
									placeholder="ex. Vinston Cherchel"

                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <FormGroup className="mb-4 text-left">
                <Label htmlFor="Calendar_name">Calendar Name</Label>
                <Select
                  name="Calendar_name"
                  id="Calendar_name"
                  options={calendars.map((x) => ({ value: x.Calendar_name, label: x.Description }))}
                  onChange={this.handleSelectChange}
                  required={true}
                />
              </FormGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter>
            <Button
              className="ld-button-success"
              type="submit"
              onClick={this.addDepartment}
            >
              Submit
            </Button>
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
  calendars: state.Case.calendars,
  User: state.User.data,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
	addDepartment: (depData) => dispatch(CaseActions.addDepartmentRequested(depData)),
	requestCalendars: () => dispatch(CaseActions.calendarsFetchRequested()),

});

export default connect(mapStateToProps, mapDispatchToProps)(AddDepartmantModal);
