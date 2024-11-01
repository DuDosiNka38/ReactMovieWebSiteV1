import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, Button, FormGroup,Label} from "reactstrap";
import PRIVILEGE from "../../services/privileges";
import { AvField, AvForm } from "availity-reactstrap-validation";
import axios from "./../../services/axios";
// import * as actions from "./../../store/user/actions";
import { connect } from "react-redux";
import noteWindow from "../../services/notifications";

class AddCalendar extends Component {
  state = {
    modal: false,
    succsess: false,
    Calendar_name: null,
    Description	: null,
    modfiy: null,
  };
  addNewCalendar = this.addNewCalendar.bind(this);

  closeModal() {
    this.setState({ modal: false });
  }

  handleChange = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  switch_modal = this.switch_modal.bind(this);
  switch_modal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
    this.setState({ succsess: !this.state.succsess });
  }

  async addNewCalendar() {
    if (
      this.state.Calendar_name === null ||
      this.state.Description	 === null ||
      this.state.modfiy === null
    ) {
      noteWindow.isError("Empty field");
    } else {
      const response = await axios.post(
        "/api/calendar/add",
        {
          Calendar_name: this.state.Calendar_name,
          Description	: this.state.Description	,
          modfiy: this.state.modfiy,
        }
      );

      if (response.data.result) {
        // window.location.reload()
        setTimeout(this.props.onGlobalLoad(), 10);
        this.props.switch_modal()
        noteWindow.isSuck("Department added!");

      } else if (
        response.data.result_data.hasOwnProperty("result_error_text")
      ) {
        noteWindow.isError(response.data.result_data.result_error_text);
      }
    }
  }
  render() {
    return (
      <>
        <Button
          type="button"
          color="success"
          className="waves-effect waves-light align-items-center d-flex mb-3"
          onClick={this.switch_modal}
        >
          <i className="ri-add-fill"></i>
          Add New Calendar
        </Button>
        <Modal isOpen={this.state.modal} centered={true}>
          <ModalHeader
            toggle={() => this.setState({ modal: false })}
            className="text-center"
          >
            Add new Calendar
          </ModalHeader>
          <ModalBody>
          <AvForm onSubmit={this.addNewCalendar}>
        <FormGroup className="auth-form-group-custom mb-4">
            <i className="ri-bank-line auti-custom-input-icon"></i>
            <Label htmlFor="Calendar_name">Calendar Name</Label>

            <AvField
              name="Calendar_name"
              value={this.state.Calendar_name}
              type="text"
              className="form-control"
              id="Department_id"
              onChange={this.handleChange}
              validate={{ required: true }}
              placeholder="Enter Calendar Name"
            />
          </FormGroup>
          <FormGroup className="auth-form-group-custom mb-4">
            <i className="ri-bank-line auti-custom-input-icon"></i>
            <Label htmlFor="Description	">Description	</Label>

            <AvField
              name="Description	"
              value={this.state.Description	}
              type="text"
              className="form-control"
              id="Description	"
              onChange={this.handleChange}
              validate={{ required: true }}
              placeholder="Enter Description	"
              
            />
          </FormGroup>
          <FormGroup className="auth-form-group-custom mb-4">
            <i className=" ri-text auti-custom-input-icon"></i>
            <Label htmlFor="modfiy">Modifiy</Label>
            <AvField
              name="modfiy"
              value={this.state.modfiy}
              type="text"
              className="form-control"
              id="modfiy"
              onChange={this.handleChange}
              validate={{ required: true }}
              placeholder="Enter modfiy "
            />
          </FormGroup>
          
          <div className="mt-4 text-center">
            <Button
              color="primary"
              className="w-md waves-effect waves-light w-100"
              type="button"
              onClick={() => this.addNewCalendar()}
            >
              Add
            </Button>
          </div>
        </AvForm>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default AddCalendar;
