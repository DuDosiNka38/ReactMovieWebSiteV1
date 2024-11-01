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

class UpdateUserModal extends Component {
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

  checkAvailability = async (e, val) => {
    const { name } = e.currentTarget;

    switch (name) {
      case "Person_id":
        return checkAvailability(name, val, UserApi.fetchSinglePerson);

      default:
        break;
    }
  };

  isHasEmptyFields = () => {
    const userData = { ...this.state };

    return isHasEmptyFields(userData);
  };

  componentDidMount() {
    this.setState({ ...this.props.UserData });
    this.props.fetchRoles();
    this.props.fetchCaseRoles();
    this.props.fetchCaseSides();
  }

  upddateUser = async () => {
    const { Preloader } = this.props;
    Preloader.show();

    const userData = {
      ...filterObj(this.state, (v, i) => {
        return ![
          "Last_Name",
          "First_Name",
          "Repeat_Password",
          "Password",
          "Not_Approved_Computers",
          "Hourly_fee",
          "Calendar_name",
        ].includes(i);
      }),
    };

    const res = await UserApi.putUser(this.state.Person_id, userData);
    if (res) {
      notification.isSuck("User is successfully update");
      this.props.hideModal();
    } else {
      notification.isError(res.data.error_message)
    }

    if(typeof this.props.onSuccess === "function"){
      this.props.onSuccess();
    }

    Preloader.hide();
  };

  render() {
    const { Roles, Case_NAME, caseRoles, caseSides } = this.props;
    const { Email_address, NAME, Role, Phone_number, Person_id } = this.state;

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
            User Settings
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal manage-case-participants">
            <AvForm
              className="form-horizontal"
              onValidSubmit={this.upddateUser}
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
                  disabled={true}
                  value={Person_id}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i class="ri-font-size"></i>
                <Label htmlFor="NAME">User Name</Label>
                <AvField
                  name="NAME"
                  type="text"
                  className="form-control"
                  id="NAME"
                  placeholder="ex. John Angel"
                  onChange={this.handleInputChange}
                  required={true}
                  value={NAME}
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
                  value={Email_address}
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
                  value={Phone_number}
                />
              </FormGroup>
              {Role && (
                <>
                  <FormGroup className="mb-4 text-left ld-form-group-custom roleSelect">
                    <i class="ri-admin-line"></i>
                    <Label htmlFor="User_Role">User Role</Label>
                    <Select
                      name="Role"
                      id="User_Role"
                      options={Roles.map((x) => ({
                        value: x.Role,
                        label: x.DESCRIPTION,
                      }))}
                      
                      onChange={this.handleSelectChange}
                      required={true}
                      placeholder="Select User Role"
                      className="customRoleSelect"
                      value={Roles.map((x) => ({
                        value: x.Role,
                        label: x.DESCRIPTION,
                      })).find((y) => y.value === Role)}
                    />
                  </FormGroup>
                </>
              )}
              {Role === null && (
                <>
                  <FormGroup className="mb-4 text-left ld-form-group-custom roleSelect">
                    <i class="ri-admin-line"></i>
                    <Label htmlFor="Case_Role">Case Role</Label>
                    <Select
                      name="CaseRole"
                      id="Case_Role"
                      options={caseRoles.map((x) => ({
                        value: x.Role,
                        label: x.Description,
                      }))}
                      onChange={this.handleSelectChange}
                      required={true}
                      placeholder="Select Case Role"
                      className="customRoleSelect"
                      defaultValue={caseRoles
                        .map((x) => ({
                          value: x.Role,
                          label: x.Description,
                        }))
                        .filter((y) => y.value === Role)}
                    />
                  </FormGroup>
                  <FormGroup className="mb-4 text-left ld-form-group-custom roleSelect">
                    <i class="ri-admin-line"></i>
                    <Label htmlFor="Side"> Side</Label>
                    <Select
                      name="Side"
                      id="Side"
                      options={caseSides.map((x) => ({
                        value: x.Side,
                        label: x.Description,
                      }))}
                      onChange={this.handleSelectChange}
                      required={true}
                      placeholder="Select User Side"
                      className="customRoleSelect"
                      defaultValue={caseSides
                        .map((x) => ({
                          value: x.Side,
                          label: x.Description,
                        }))
                        .find((y) => y.value === Role)}
                    />
                  </FormGroup>
                </>
              )}
            </AvForm>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button
              className="ld-button-success mr-2"
              onClick={this.upddateUser}
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
  caseRoles: state.Case.caseRoles,
  caseSides: state.Case.caseSides,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  fetchCaseRoles: () => dispatch(CaseActions.caseRolesFetchRequested()),
  fetchCaseSides: () => dispatch(CaseActions.caseSidesFetchRequested()),
  fetchRoles: () => dispatch(PersonnelActions.rolesFetchRequested()),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("NEW_USER_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NEW_USER_MODAL")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserModal);
