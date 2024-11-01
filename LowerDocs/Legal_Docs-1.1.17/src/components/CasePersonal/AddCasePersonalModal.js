import React, { Component } from "react";
import {
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
} from "reactstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import Select from "react-select";
import axios from "./../../services/axios";
import noteWindow from "./../../services/notifications";
import SelectCasePersonel from "./SelectCasePersonel/SelectCasePersonel";
import * as actions from "./../../store/user/actions";
class AddCasePersonalModal extends Component {
  state = {
    modal: false,
    Person_id: "",
    Phone_number: "",
    NAME: "",
    Email_address: "",
    Role: "",
    Side: "",
  };
  addNewPersone = this.addNewPersone.bind(this);
  switch_modal = (e) => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };
  onSelectChange = (el) => {
    this.setState({ [el.name]: el.value });
  };
  async addNewPersone() {
    const result = await axios
      .post("/api/case/addPerson", {
        Case_NAME: this.props.CID,
        Person_id: this.state.Person_id,
        NAME: this.state.NAME,
        Email_address: this.state.Email_address,
        Phone_number: this.state.Phone_number,
        Role: this.state.Role,
        Side: this.state.Side,
      })
      .then(function (response) {
        if (response.data.result) {
          noteWindow.isSuck("User Added!");
          return true;
        } else {
          noteWindow.isError(response.data.result_data.result_error_text);
          return false;
        }
      })
      .catch((response) => {
        noteWindow.isError(response);
        return false;
      });

    if (result) {
      this.switch_modal();
      this.props.onGlobalLoad();
    }
  }

  render() {
    const pr = this.props.participantRoles;

    if (pr === undefined) {
      return <></>;
    }

    const options = pr.filter((x) => x.Case_NAME === "SYSTEM").map((o) => {
      return {
        name: "Role",
        value: o.Role,
        label: o.DESCRIPTION,
      };
    });
    const Side = [
      { name: "Side", value: "Office", label: "Office" },
      { name: "Side", value: "Opposite", label: "Opposite" },
      { name: "Side", value: "Third_Party", label: "Third_Party" },
    ];

    return (
      <>
        <Button
          className="btn btn-success  addBtn"
          type="button"
          onClick={this.switch_modal}
        >
          <span className="addMore">Add </span>{" "}
          <i className=" ri-menu-add-fill addIcon"></i>
        </Button>
        <Modal
          size="lg"
          isOpen={this.state.modal}
          switch={this.switch_modal}
          centered={true}
        >
          <AvForm onValidSubmit={this.addNewPersone}>
            <ModalHeader
              toggle={() => this.setState({ modal: false })}
              className="text-center"
            >
              Add New Person
            </ModalHeader>
            <ModalBody toggle={() => this.setState({ modal: false })}>
              <Row>
                <Col lg={12}>
                  <FormGroup className="auth-form-group-custom">
                    <i className=" ri-hashtag auti-custom-input-icon"></i>
                    <Label htmlFor="personid">Person ID</Label>
                    <AvField
                      name="Person_id"
                      value={this.state.Person_id}
                      validate={{ required: true }}
                      type="text"
                      className="form-control"
                      id="person_id"
                      onChange={this.handleChange}
                      placeholder="Enter person id"
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup className="auth-form-group-custom">
                    <i className=" ri-hashtag auti-custom-input-icon"></i>
                    <Label htmlFor="personid">Full Name</Label>
                    <AvField
                      name="NAME"
                      value={this.state.NAME}
                      validate={{ required: true }}
                      type="text"
                      onChange={this.handleChange}
                      className="form-control"
                      id="NAME"
                      placeholder="Enter person id"
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup className="auth-form-group-custom">
                    <i className=" ri-hashtag auti-custom-input-icon"></i>
                    <Label htmlFor="personid">E-mail</Label>
                    <AvField
                      name="Email_address"
                      value={this.state.Email_address}
                      validate={{ required: true, email: true }}
                      type="email"
                      onChange={this.handleChange}
                      className="form-control"
                      id="Email_address"
                      placeholder="Enter person id"
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup className="auth-form-group-custom">
                    <i className=" ri-hashtag auti-custom-input-icon"></i>
                    <Label htmlFor="personid">Phone</Label>
                    <AvField
                      name="Phone_number"
                      value={this.state.Phone_number}
                      // validate={{ required: true, }}
                      type="text"
                      onChange={this.handleChange}
                      className="form-control"
                      id="person_id"
                      placeholder="Enter person id"
                    />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <Label htmlFor="personid">Role</Label>
                  <Select
                    attr-case-name={this.props.caseName}
                    options={options}
                    className="basic-multi-select"
                    name="Role"
                    classNamePrefix="select"
                    onChange={this.onSelectChange}
                  />
                </Col>
                <Col lg={6}>
                  <Label htmlFor="personid">Side</Label>
                  <Select
                    attr-case-name={this.props.caseName}
                    options={Side}
                    className="basic-multi-select"
                    name="Side"
                    classNamePrefix="select"
                    onChange={this.onSelectChange}
                  />
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                className="w-100"
                // type="button"
                color="success"
                // onClick={this.deleteUser}
              >
                Add
              </Button>
            </ModalFooter>
          </AvForm>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    participantRoles: state.User.participantRoles,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddCasePersonalModal);
