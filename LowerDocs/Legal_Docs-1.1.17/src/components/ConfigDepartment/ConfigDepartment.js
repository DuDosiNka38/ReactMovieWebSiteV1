import React, { Component } from "react";
import { Label, FormGroup, Button } from "reactstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import axios from "./../../services/axios";
import * as actions from "./../../store/user/actions";
import { connect } from "react-redux";

import noteWindow from "../../services/notifications";

class ConfigDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Court_name: null,
      Department_name: null,
      Judge_name: null,
      Department_id: null,
      // modal: this.props.closeModal
    
    };
    this.addNewDepartment = this.addNewDepartment.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  async addNewDepartment() {
    if (
      this.state.Court_name === null ||
      this.state.Department_name === null ||
      this.state.Judge_name === null||
      this.state.Department_id === null
    ) {
      noteWindow.isError("Empty field");
    } else {
      const response = await axios.post(
        "/api/department/add",
        {
          Court_name: this.state.Court_name,
            Department_Name: this.state.Department_name,
            Judge_name: this.state.Judge_name,
            Department_id: this.state.Department_id,
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
        <AvForm onSubmit={this.addNewDepartment}>
        <FormGroup className="auth-form-group-custom mb-4">
            <i className="ri-bank-line auti-custom-input-icon"></i>
            <Label htmlFor="Department_id">Department Short Name</Label>

            <AvField
              name="Department_id"
              value={this.state.Department_id}
              type="text"
              className="form-control"
              id="Department_id"
              onChange={this.handleChange}
              validate={{ required: true }}
              placeholder="Enter Department Id"
            />
          </FormGroup>
          <FormGroup className="auth-form-group-custom mb-4">
            <i className="ri-bank-line auti-custom-input-icon"></i>
            <Label htmlFor="username">Court name</Label>

            <AvField
              name="Court_name"
              value={this.state.Court_name}
              type="text"
              className="form-control"
              id="courtName"
              onChange={this.handleChange}
              validate={{ required: true }}
              placeholder="Enter Court name"
            />
          </FormGroup>
          <FormGroup className="auth-form-group-custom mb-4">
            <i className=" ri-text auti-custom-input-icon"></i>
            <Label htmlFor="username">Department name</Label>
            <AvField
              name="Department_name"
              value={this.state.Department_name}
              type="text"
              className="form-control"
              id="departmentName"
              onChange={this.handleChange}
              validate={{ required: true }}
              placeholder="Enter Department name"
            />
          </FormGroup>
          <FormGroup className="auth-form-group-custom mb-4">
            <i className=" ri-user-shared-line auti-custom-input-icon"></i>
            <Label htmlFor="username">Judge name</Label>
            <AvField
              name="Judge_name"
              value={this.state.Judge_name}
              type="text"
              className="form-control"
              id="judgeName"
              onChange={this.handleChange}
              validate={{ required: true }}
              placeholder="Enter Judge name"
            />
          </FormGroup>
          <div className="mt-4 text-center">
            <Button
              color="primary"
              className="w-md waves-effect waves-light w-100"
              type="button"
              onClick={() => this.addNewDepartment()}
            >
              Add
            </Button>
          </div>
        </AvForm>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};
export default connect(null, mapDispatchToProps)(ConfigDepartment);
