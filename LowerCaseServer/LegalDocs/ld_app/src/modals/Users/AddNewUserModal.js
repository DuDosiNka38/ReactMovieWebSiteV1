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
import Select from "react-select";

import * as ModalActions from "../../store/modal/actions";
import * as CaseActions from "../../store/case/actions";
import * as PersonnelActions from "../../store/personnel/actions";
import * as PreloaderActions from "./../../store/preloader/actions";

import {
  checkAvailability,
  isHasEmptyFields,
  isHasNotAvailable,
} from "../../services/FormChecker";
import UserApi from "../../api/UserApi";
import { filterObj } from "../../services/Functions";
import notification from "../../services/notification";
import CaseApi from "../../api/CaseApi";

class AddNewUSerModal extends Component {
  state = {
    Person_id: null,
    First_Name: null,
    Last_Name: null,
    Email_address: null,
    Password: null,
    Phone_number: null,
    Role: null,
  };

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

  checkAvailability = async (e, val) => {
    const { name } = e.currentTarget;

    switch (name) {
      case "Person_id":
        return checkAvailability(name, val, UserApi.fetchSinglePerson, (notAvailable) => {
          if(notAvailable){
            notification.isError("User with typed identifier already exists! Type another one!");
          }
        });

      default:
        break;
    }
  };

  isHasEmptyFields = () => {
    const userData = { ...this.state };

    return isHasEmptyFields(userData);
  };

  submitAddCaseParticipant = async () => {
    const { Preloader, Case_Short_NAME } = this.props;
    Preloader.show();

    if (isHasNotAvailable()) {
      Preloader.hide();
      return false;
    }

    if (this.isHasEmptyFields()) {
      Preloader.hide();
      return false;
    }

    const userData = {
      ...filterObj(this.state, (v, i) => {
        return !["First_Name", "Last_Name", "Repeat_Password"].includes(i);
      }),
      NAME: `${this.state.First_Name} ${this.state.Last_Name}`,
    };
    const resPerson = await UserApi.postUser(userData);
   
    if (!resPerson.result) {
      notification.isError(resPerson.data.error_message);
      return false;
    }

    notification.isSuck ("User Registration Successfully Done!");
    this.props.hideModal(this.props.type);
    this.props.showModal("NEW_USER_SUCCEEDED", { userData: userData });

    if(typeof this.props.onSuccess === "function"){
      this.props.onSuccess();
    }

    Preloader.hide();
  };

  componentDidMount() {
    this.props.fetchRoles();
  }

  render() {
    const { Roles } = this.props;

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
            Add New User
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal manage-case-participants">
            <AvForm
              className="form-horizontal"
              onValidSubmit={this.submitNewCaseForm}
            >
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
                  validate={{ required: true }}
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
                  validate={{ required: true }}
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
                  validate={{ required: true }}
                  required={true}
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

              <FormGroup className="ld-form-group-custom mb-4">
                <i class=" ri-lock-line"></i>
                <Label htmlFor="Password">Password</Label>
                <AvField
                  name="Password"
                  type="Password"
                  className="form-control"
                  placeholder="***********"
                  id="Password"
                  onChange={this.handleInputChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "This Field is required",
                    },
                    minLength: {
                      value: 6,
                      errorMessage: "Password cannot be less than 6 characters",
                    },
                  }}
                  required={true}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class=" ri-lock-line"></i>
                <Label htmlFor="Repeat_Password">Repeat Password</Label>
                <AvField
                  name="Repeat_Password"
                  type="password"
                  className="form-control"
                  id="Repeat_Password"
                  placeholder="***********"
                  onChange={this.handleInputChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "This Field is required",
                    },
                    minLength: {
                      value: 6,
                      errorMessage: "Password cannot be less than 6 characters",
                    },
                    match: {
                      value: "Password",
                      errorMessage: "Password missmatch",
                    },
                  }}
                  required={true}
                />
              </FormGroup>

              <FormGroup className="mb-4 text-left ld-form-group-custom roleSelect">
                <i class="ri-admin-line"></i>
                <Label htmlFor="User_Role">User Role</Label>
                <Select
                  name="Role"
                  id="USER_ROLE"
                  options={Roles.map((x) => ({
                    value: x.Role,
                    label: x.DESCRIPTION,
                  }))}
                  onChange={this.handleSelectChange}
                  required={true}
                  placeholder="Select User Role"
                  className="customRoleSelect"
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
  Roles: state.Personnel.Roles,
  isLoadingPersonnel: state.Personnel.loading,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  fetchRoles: () => dispatch(PersonnelActions.rolesFetchRequested()),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("NEW_USER_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NEW_USER_MODAL")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNewUSerModal);
