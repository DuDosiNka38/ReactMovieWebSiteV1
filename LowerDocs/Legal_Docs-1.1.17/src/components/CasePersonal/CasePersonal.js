import React, { Component } from "react";
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
} from "reactstrap";
import { AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import Select from 'react-select'


class CasePersonal extends Component {
  state = {
    modal: false,
    selectedUsers: []
  };
  addRow = this.addRow.bind(this);
  modalClose = this.modalClose.bind(this);
  selectUser = this.selectUser.bind(this);
  checkFromDB = this.checkFromDB.bind(this)
  addRow() {
    const persones = this.props.persones;
    // const {personeData} = this.props;
    persones.push({
      personeFullName: "",
      personeEmail: "",
      personePseudonym: "",
      personeCaseRole: "",
      side: "",
      // addedFromDB: false,
    });
    this.setState({ persones: persones });
  }
  switch_modal = (e) => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  modalClose() {
    this.setState({ userName: null });
  }

  onSelectChange = (e) => {
    this.setState({ selectedUsers: e});
  };
  selectUser() {
    const persones = this.props.persones;
    let {allUsers, staff} = this.props;
    let userData = allUsers.concat(staff);
    
    this.state.selectedUsers.forEach((e) => {
      userData.forEach((k) => {
        if (k.Person_id === e.value) {
          persones.push({
            personeFullName: k.NAME,
            personeEmail: k.Email_address,
            personePseudonym: k.Person_id,
            personeCaseRole: "",
            side: "Office",
            addedFromDB: true,
          });
        }
      });
    });

    this.setState({ persones: persones, selectedUsers: [] });
    this.switch_modal();
  }

  checkFromDB(index) {
   const s = this.props.persones;
    const ss =   s.filter((x)=> (x.addedFromDB === true))
    if (index) {
     return index
    }
  }

  componentDidMount() {
    this.props.onRoleLoad();
    const persones = this.props.persones;
    const {personeData} = this.props;
    persones.push({
      personeFullName: personeData.NAME,
      personeEmail: personeData.Email_address,
      personePseudonym: personeData.Person_id,
      personeCaseRole: "OWNER|3",
      side: "Office",
      addedFromDB: true,
    });
    // persones.push({
    //   personeFullName: "kjkl",
    //   personeEmail: "huy@nahuy.com",
    //   personePseudonym: "Cheburek",
    //   personeCaseRole: "LAWYER",
    //   side: "Opposite",
    // });
    // persones.push({
    //   personeFullName: "HUY",
    //   personeEmail: "a.trygub@mail.ru",
    //   personePseudonym: "lfksdf",
    //   personeCaseRole: "PARALEGAL",
    //   side: "Opposite",
    // });
    this.setState({ persones: persones });
  }


  componentDidUpdate(prevProps, prevState) {
    if(this.props.refresh !== prevProps.refresh) {
      this.props.onRefresh(!prevProps.refresh);
    }
  }

  render() {
    if(this.state.persones == undefined)
      return (<></>);

    const partisipantRole = this.props.partisipantsRole.filter((x) => x.Case_NAME === "DEFAULT" && x.Role !== "OWNER|3");

    const filt = (v, i, a) => {
      if(this.state.persones.filter((x) => x.personePseudonym === v.Person_id).length === 0)
        return true;
      else
        return false;
    }

    let {allUsers, staff} = this.props;
    // let currentUser = this.props.personeData.Person_id
    let userData = allUsers.concat(staff).filter(filt).map((x) => (
      {
        name: "SelectedUser",
        value: x.Person_id,
        label: x.NAME
      }
    ));

    let sides = [
      {label: "Select", value: "Default"},
      {label: "Office", value: "Office"},
      {label: "Opposite", value: "Opposite"},
      {label: "Third_Party", value: "Third_Party"}
    ];

    return (
      <>
        <div className="">
          <Table className="mb-0 customTable" >
            <thead>
              <tr>
                <td></td>
                <td>Person ID</td>
                <td>E-mail</td>
                <td>Full Name</td>
                <td>Participant Role</td>
                <td>Participant Side</td>
              </tr>
            </thead>
            <tbody>
              {this.props.persones.map((item, index) => (
                <tr key={index} id={`id${index}`}>
                  <td className="text-center ">
                    {index > 0 &&
                      <>
                        <i
                          class="ri-close-line removeSyncScheduleRow"
                          row={index} onClick={this.props.deleteRow}
                          title="Remove this person from share"
                        ></i>
                        {/* <Button row={index} onClick={this.props.deleteRow} color="light" type="button"><i className="ri-close-line font-size-16"></i></Button> */}
                      </>
                    }
                  </td>
                  <td>
                    <AvField
                      row={index}
                      name="personePseudonym"
                      value={this.props.persones[index].personePseudonym}
                      type="text"
                      className="form-control mb-0"
                      id="personePseudonym"
                      placeholder="Person ID"
                      onChange={this.props.hendelChange}
                      disabled = {this.props.persones[index].hasOwnProperty("addedFromDB") === true ? true : false }
             
                    />
                  </td>
                  <td>
                    <AvField
                      row={index}
                      name="personeEmail"
                      value={this.props.persones[index].personeEmail}
                      type="text"
                      className="form-control mb-0"
                      id="personeEmail"
                      placeholder="E-mail"
                      onChange={this.props.hendelChange}
                      disabled = {this.props.persones[index].hasOwnProperty("addedFromDB") === true  ? true : false }

                    />
                  </td>
                  <td>
                    <AvField
                      row={index}
                      name="personeFullName"
                      value={this.props.persones[index].personeFullName}
                      type="text"
                      className="form-control mb-0"
                      id="personeFullName"
                      placeholder="Full name"
                      onChange={this.props.hendelChange}
                      disabled = {this.props.persones[index].hasOwnProperty("addedFromDB") === true ? true : false }

                    />
                  </td>

                  <td>
                    {index !== 0 ?
                    <>
                      <select
                        row={index}
                        className="form-control"
                        onChange={this.props.hendelChange}
                        // value={this.props.persones[index].personeCaseRole}
                        name="personeCaseRole"
                      >
                        <option value="Default">Select</option>
                        {partisipantRole.map(({ Role, Role_id, DESCRIPTION }) => (
                          <>
                          {this.props.persones[index].personeCaseRole === Role+"|"+Role_id ?
                            <>
                              <option key={Role+"|"+Role_id} value={Role+"|"+Role_id} selected>
                                {DESCRIPTION}
                              </option>
                            </>
                            :
                            <>
                              <option key={Role+"|"+Role_id} value={Role+"|"+Role_id} >
                                {DESCRIPTION}
                              </option>
                            </>
                          }                        
                          </>
                        ))}
                      </select>
                    </>
                    :
                    <>
                    -
                    </>
                  }
                  </td>
                  <td>
                  {index !== 0 ?
                    <>
                      <select
                        row={index}
                        className="form-control"
                        onChange={this.props.hendelChange}
                        name="side"
                      >
                      {sides.map(({ value, label }) => (
                          <>
                          {this.props.persones[index].side === value ?
                            <>
                              <option key={value} value={value} selected>
                                {label}
                              </option>
                            </>
                            :
                            <>
                              <option key={value} value={value} >
                                {label}
                              </option>
                            </>
                          }                        
                          </>
                        ))}
                      </select>
                    </>
                    :
                    <>
                    -
                    </>
                  }
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
                  // className="form-control"
                  options={userData}
                  // isObject={false}
                  isMulti={true}
                  closeMenuOnSelect={false}
                  onChange={this.onSelectChange}
                  // closeIcon="close"
                  // onSelect={this.onSelect}
                  // onRemove={this.onRemove}
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
          <div className="d-flex">
            <Button
              className="btn btn-success my-3 mr-3 addBtn"
              type="button"
              onClick={this.addRow}
            >
              <span className="addMore">Add New Persone</span>{" "}
              <i className=" ri-menu-add-fill addIcon"></i>
            </Button>
            <Button
              className="my-3 addBtn"
              color="info"
              type="button"
              onClick={() => this.setState({ modal: true })}
            >
              <span className="addMore">Select Persone from Users</span>{" "}
              <i className=" ri-menu-add-fill addIcon"></i>
            </Button>
          </div>
        </div>
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
  };
};
const mapDispatchToProps = (dispatch) => ({
  onRoleLoad: () => dispatch(actions.getParticipantRoles()),
  onPersoneLoad: () => dispatch(actions.getPersonData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CasePersonal);
