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
import * as CaseActions from "./../../../../store/case/actions";

import Select from "react-select";
import notification from "../../../../services/notification";

class AddCalendarsModal extends Component {
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
  }

  addCalendar = async () => {
    const res = await this.props.addCalendar(this.state);

    if (res) {
      notification.isSuck("Calendar succsesfuly added.");
      this.props.hideModal();
    }
    // notification.isError(res.error_text)
  };
  render() {
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
            New Calendar
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal">
            <AvForm
              className="form-horizontal"
              onValidSubmit={this.addCalendar}
            >
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-calendar-2-line"></i>
                <Label htmlFor="Calendar_name">Calendar Name</Label>
                <AvField
                  name="Calendar_name"
                  type="text"
                  className="form-control"
                  id="Calendar_name"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter Calendar Name ",
                    },
                    pattern: {
                      value: "^[A-Za-z0-9_-]+$",
                      errorMessage: "Calendar Name must not contain spaces",
                    },
                  }}
                  placeholder="ex. MY Calendar"
                  onChange={this.handleInputChange}
                  onBlur={this.checkAvailability}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class=" ri-font-size "></i>
                <Label htmlFor="Department_Name">Description</Label>
                <AvField
                  name="Description"
                  type="text"
                  className="form-control"
                  id="Description"
                  placeholder="ex.Calendar for... "
                  required={true}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter>
            <Button
              className="ld-button-success"
              type="submit"
              onClick={this.addCalendar}
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
  calendars: state.Case.calendars,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  addCalendar: (data) => dispatch(CaseActions.addCalendarRequested(data)),
  requestCalendars: () => dispatch(CaseActions.calendarsFetchRequested()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCalendarsModal);
