import React, { Component } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import * as actions from "./../../../store/user/actions";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
} from "reactstrap";
import axios from "./../../../services/axios";

class SelectCasePersonel extends Component {
  state = {
    modal: false,
    selectedUsers: [],
  };
  selectUser = this.selectUser.bind(this);

  switch_modal = (e) => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  onSelectChange = (e) => {
    this.setState({ selectedUsers: e});
  };
  selectUser() {
    const {cases} = this.props;
    let  persones = [];

    const SYSTEM = cases.find((x) => x.Case_Short_NAME === "SYSTEM");
    const CP = SYSTEM.Case_Participants;

    let { allUsers, staff } = this.props;
    let userData = allUsers.concat(staff);

    this.state.selectedUsers.forEach((e) => {
      userData.forEach((k) => {
        if (k.Person_id === e.value) {
          const pers = CP.find((x) => x.Person_id === k.Person_id);
          axios.post("/api/case/addCaseParticipant",{
            Person_id: k.Person_id,
            Role: pers.Role,
            Side: pers.Side,
            Case_NAME: this.props.CID
          })
          .then(resp => {
            if(this.props.hasOwnProperty("cb")){
              this.props.cb();
            }
            console.log(resp)
          })
          .catch(resp => console.log(resp));
        }
      });
    });

    this.setState({ persones: persones, selectedUsers: [] });
    this.switch_modal();
  }

  render() {
    const {cp, allUsers, staff} = this.props;
    const pids = cp.map((x) => (x.Person_id));
    let userData = allUsers
      .concat(staff)
      .filter((x) => pids.includes(x.Person_id) === false)
      .map((x) => ({
        name: "SelectedUser",
        value: x.Person_id,
        label: x.NAME,
      }));
    return (
      <>
        <Button
              className="ml-3 addBtn"
              color="info"
              type="button"
              onClick={() => this.setState({ modal: true })}
            >
              <span className="addMore">Select persone</span>{" "}
              <i className=" ri-menu-add-fill addIcon"></i>
            </Button>
        <Modal
          isOpen={this.state.modal}
          centered={true}
          onClosed={this.modalClose}
        >
          <ModalHeader
            toggle={() => this.setState({ modal: false })}
            className="text-center"
          >
            Select Case Personal
          </ModalHeader>
          <ModalBody>
            <FormGroup className="mb-4 mt-2">
              <Label htmlFor="billing-address">Select Users For Case</Label>
              <Select
                options={userData}
                isMulti={true}
                closeMenuOnSelect={false}
                onChange={this.onSelectChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="success" onClick={this.selectUser}>
              Add
            </Button>
            <Button
              type="button"
              color="primary"
              onClick={() => this.setState({ modal: false })}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    partisipantsRole: state.User.participantRoles,
    personeData: state.User.persone,
    staff: state.User.staff,
    allUsers: state.User.allUserData,
    cases: state.User.caseData.cases,

  };
};
const mapDispatchToProps = (dispatch) => ({
  onRoleLoad: () => dispatch(actions.getParticipantRoles()),
  onPersoneLoad: () => dispatch(actions.getPersonData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectCasePersonel);
