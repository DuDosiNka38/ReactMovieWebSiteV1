import React, { Component } from "react";
import {
  Label,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Col,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

class AddNewCaseType extends Component {
  state = {
    caseType: "",
    description: "",
    modal: false,
  };
  switch_modal = this.switch_modal.bind(this);
  switch_modal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  addCaseType() {
    this.setState({ modal: false });
  }

  render() {
    return (
      <>
        <FormGroup row>
          <Label className="col col-form-label">&nbsp;</Label>
          <Col md={12}>
            <Button
              type="button"
              color="info"
              className="waves-effect btn btn-light custom-plus w-100"
              onClick={this.switch_modal}
            >
              Add new
            </Button>
          </Col>
        </FormGroup>

        <Modal isOpen={this.state.modal} centered={true}>
          <ModalHeader
            toggle={() => this.setState({ modal: false })}
            className="text-center"
          >
            Add new case type
          </ModalHeader>
          <ModalBody>
            {/* <AvForm
              className="mt-3"
              onValidSubmit={this.props.userSetNewPassword}
            > */}

            <FormGroup className="auth-form-group-custom mb-4">
              <i className=" ri-folders-fill auti-custom-input-icon"></i>
              <Label htmlFor="username">Case Type</Label>
              <AvField
                name="case_type"
                value={this.state.caseFullName}
                type="text"
                className="form-control"
                id="case_type"
                validate={{
                  required: {
                    value: true,
                    errorMessage: "Please enter a Case Type",
                  },
                  // maxLength: {value: 10, errorMessage: 'Your name must be between 1 and 10 characters'}
                }}
                placeholder="Enter case type"
              />
            </FormGroup>
            <FormGroup className="auth-form-group-custom mb-4">
              <i className=" ri-advertisement-fill auti-custom-input-icon"></i>
              <Label htmlFor="username">Description</Label>
              <AvField
                name="description"
                value={this.state.caseFullName}
                type="text"
                className="form-control"
                id="case_type_description"
                validate={{
                  required: {
                    value: true,
                    errorMessage: "Please enter a description",
                  },
                  // number: {value: true, errorMessage: ''},
                  // maxLength: {value: 10, errorMessage: 'Your name must be between 1 and 10 characters'}
                }}
                placeholder="Enter description"
              />
            </FormGroup>

            <div className="mt-4 text-center">
              <Button
                color="primary"
                className="w-md waves-effect waves-light"
                type="button"
                onClick={() => this.addCaseType()}
              >
                Add
              </Button>
            </div>
            {/* </AvForm> */}
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default AddNewCaseType;
