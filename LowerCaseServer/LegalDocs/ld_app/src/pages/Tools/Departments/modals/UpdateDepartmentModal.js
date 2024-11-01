import React, { Component } from "react";
import {
  Button,
  Label,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "./../../../../store/modal/actions";
import * as PreloaderActions from "./../../../../store/preloader/actions";
import * as CaseActions from "./../../../../store/case/actions";

import Select from "react-select";
import notification from "../../../../services/notification";

class UpdateDepartmentModal extends Component {
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
    this.props.requestCalendars();
    this.setState({ ...this.props.DepartmentData });
  }

  updateDepartment = async () => {
    const res = await this.props.updateDepartment(this.state);

    if (res) {
      notification.isSuck("Department succsesfuly added.");
      this.props.hideModal();
    }
    // notification.isError(res.error_text)
  };
  render() {
    const { calendars } = this.props;
    
    const {
      Calendar_name,
      Court_name,
      Department_Name,
      Department_id,
      Judge_name,
    } = this.state;
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
            New Case
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal">
            <AvForm
              className="form-horizontal"
              onValidSubmit={this.updateDepartment}
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
                      errorMessage: "Please enter Case ID",
                    },
                    pattern: {
                      value: "^[A-Za-z0-9_-]+$",
                      errorMessage: "Case ID must not contain spaces",
                    },
                  }}
                  placeholder="ex. MY_CASE"
                  onChange={this.handleInputChange}
                  onBlur={this.checkAvailability}
                  required={true}
                  value={Department_id}
                  disabled={true}
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
                  value={Department_Name}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-hashtag"></i>
                <Label htmlFor="Case_Number">Court Name</Label>
                <AvField
                  name="Court_name"
                  type="text"
                  className="form-control"
                  id="Court_name"
                  placeholder="ex. Fam"
                  onChange={this.handleInputChange}
                  value={Court_name}
                />
              </FormGroup>

              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-hashtag"></i>
                <Label htmlFor="Case_Number">Judge Name</Label>
                <AvField
                  name="Judge_name"
                  type="text"
                  className="form-control"
                  id="Judge_name"
                  placeholder="ex. Vinston Cherchel"
                  value={Judge_name}
                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <FormGroup className="mb-4 text-left">
                <Label htmlFor="Calendar_name">Calendar Name</Label>
                <Select
                  name="Calendar_name"
                  id="Calendar_name"
                  options={calendars.map((x) => ({
                    value: x.Calendar_name,
                    label: x.Description,
                  }))}
                  onChange={this.handleSelectChange}
                  value={calendars
                    .map((x) => ({
                      value: x.Calendar_name,
                      label: x.Description,
                    }))
                    .find((y) => y.value === Calendar_name)}
                  required={true}
                />
              </FormGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter>
            <Button
              className="ld-button-success"
              type="submit"
              onClick={this.updateDepartment}
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
  requestCalendars: () => dispatch(CaseActions.calendarsFetchRequested()),
  updateDepartment: (depData) =>
    dispatch(CaseActions.updateDepartmentRequested(depData)),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("NEW_CASE_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NEW_CASE_MODAL")),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateDepartmentModal);
