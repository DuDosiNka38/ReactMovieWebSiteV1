import React, { Component } from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { connect } from "react-redux";
import Select from "react-select";
import AddCasePersonalModal from './../CasePersonal/AddCasePersonalModal'
import moduleName from './../CasePersonal/SelectCasePersonel/SelectCasePersonel'
// import SelectCasePersonel from './c';
import noteWindow from "../../services/notifications";
import axios from "./../../services/axios";
import * as actions from "./../../store/user/actions";
import SelectCasePersonel from "./../CasePersonal/SelectCasePersonel/SelectCasePersonel";

class CasePersonalView extends Component {


    state = {
      modal: false,
      iRow: null,
      userName: null,
      modalType: "",
      userId: "",
      refresh: this.props.refresh,
      newRole: null,
      newSide: null,
      rolePriv: []
    };

  deleteUser = this.deleteUser.bind(this);
  editUser = this.editUser.bind(this);
  onChangeRolePrivilege = this.onChangeRolePrivilege.bind(this);

  switch_modal = (e) => {
    this.setState({ modalType: e.currentTarget.name });
    const row = e.currentTarget.getAttribute("attr-row-id");
    this.setState({iRow: row})
    const UId = this.props.CasePersonal[row].Person_id;
    this.setState({ userId: UId });
    this.setState({newRole: this.props.CasePersonal[row].Role});
    this.setState({newSide: this.props.CasePersonal[row].Side});
    this.setState({curPerson: this.props.CasePersonal[row]})
    this.setSelectedPrivileges(UId);
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  handleChange = (e, el) => {
    this.setState({[el.name]: e.value});
  };
  deleteUser(e) {
    let personeId = this.props.CasePersonal;
    let ind = this.state.iRow;

    const result = axios
      .post("/api/case/deletePerson", {
        Case_NAME: this.props.CID,
        Person_id: this.state.userId,
      })
      .then(function (response) {
        if (response.data.result) {
          noteWindow.isSuck("Case participant successfully deleted!");
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
      setTimeout(this.props.onGlobalLoad(), 100);
    }

    setTimeout(this.setState({ modal: false }), 200);
  }
  editUser(e) {
    const {URoles} = this.props;
    const { userId, newRole, newSide } = this.state;

    const result = axios
      .post("/api/case/updatePerson", {
        Case_NAME: this.props.CID,
        Person_id: this.state.userId,
        Role: newRole,
        Side: newSide
      })
      .then(function (response) {
        if (response.data.result) {
          noteWindow.isSuck("Case participant successfully updated!");
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
      this.updatePrivileges().then(() => {
        setTimeout(this.props.onGlobalLoad(), 100);
      });
    }

    setTimeout(this.setState({ modal: false }), 200);
  }


  async  componentDidUpdate(prevProps, prevState) {
    if(this.state.refresh !== prevState.refresh) {
      // await this.setState({refresh: !this.state.refresh})
    }
  }
 
  addedLinkToCell = (cell, row, rowIndex, formatExtraData) => {
    return (
      <>
        <Button
          onClick={this.switch_modal}
          name="add"
          type="button"
          className="btnToTable"
          color="primary"
          attr-row-id={rowIndex}
        >
          <i className="  ri-pencil-line iToTable"></i>
        </Button>
        <Button
          className=" ml-2 btnToTable"
          type="button"
          color="danger"
          onClick={this.switch_modal}
          value={rowIndex}
          attr-row-id={rowIndex}
          name="del"
        >
          <i className="ri-delete-bin-2-line iToTable"></i>
        </Button>
      </>
    );
    // this.setState({})
  };
  setSelectedPrivileges(UID) {
      const {CasePersonal, casePreviliges} = this.props;
      const p = CasePersonal.filter((x) => x.Person_id == UID)[0];
      const rolePreviliges = p.Privileges.map((x) => {
        let priv = casePreviliges.single.find((y) => y.Privilege == x.Privilege);
        return {
          name: "RP",
          label: priv.DESCRIPTION,
          value: x.Privilege
        };
      });

      if (rolePreviliges != undefined && rolePreviliges.length != 0) {
        let p = [];
        p = rolePreviliges.map((x) => {
          return {
            name: "RP",
            label: x.label,
            value: x.value,
          };
        });
        this.setState({ rolePriv: p });
      } else {
        this.setState({ rolePriv: []});
      }
  }
  onChangeRolePrivilege(e, el) {
    this.setState({rolePriv: e});
  }
  async updatePrivileges() {
    const {URoles} = this.props;
    const {userId, newRole} = this.state;
    const role = URoles.find((x) => x.Case_NAME == this.props.CID && x.Person_id == userId);
    const key = newRole+"|"+role.Role_id;
    
    console.log(key, this.state.rolePriv)
    const result = await axios
      .post(
        "/api/privilege/updateRolePrivilege",
        {[key]:this.state.rolePriv}
      )
      .then(function (response) {
        if (response.data.result) {
          noteWindow.isSuck("Data successfully saved!");
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
      this.props.onGlobalLoad();
    }
  }

  render() {
    const cp = this.props.CasePersonal;
    const pr = this.props.participantRoles;
     const updateCP =  (newCP) => {
      cp.push(
        newCP
      )
    }
    if (cp === undefined || this.props.casePreviliges === undefined || this.props.casePreviliges.single === undefined) {
      return <></>;
    }

    cp.forEach((x) => {
      const t = pr.find((y) => y.Role === x.Role);
      x.Role_Title = t !== undefined ? t.DESCRIPTION : x.Role;
    });

    const options = pr.map((o) => ({ value: o.Role, label: o.DESCRIPTION }));
    const side = [
      {name: "PartSide", value: "Office", label: "Office"},
      {name: "PartSide", value: "Opposite", label: "Opposite"},
      {name: "PartSide", value: "Third_party", label: "Third Party"},
    ];
    
    const CasePriviliges =  this.props.casePreviliges.single.filter((x)=> x.Priv_Type === "case");
    const filt = (v, i, a) => {
      if(this.state.rolePriv.filter((p) => p.value == v.Privilege).length == 0)
        return true;
      else  
        return false;
    }
    
    const previliges = CasePriviliges.filter(filt).map((x)=> (
      {
        name: "casePriv",
        value: x.Privilege,
        label: x.DESCRIPTION
      }
    ))

    const roles = this.props.participantRoles.filter((x) => x.Case_NAME === "SYSTEM").map((x) => (
      {
        name: "PersRole",
        value: x.Role,
        label: x.DESCRIPTION
      }
    ));
    const columns = [
      {
        dataField: "Person_id",
        text: "User ID",
      },
      {
        dataField: "NAME",
        text: "User Full Name",
      },
      {
        dataField: "Email_address",
        text: "Email",
      },
      // {
      //   dataField: "Phone_number",
      //   text: "Phone",
      // },
      {
        dataField: "Role_Title",
        text: "Role",
      },
      {
        dataField: "Side",
        text: "Side",
      },
      {
        dataField: "",
        text: "Settings",
        formatter: this.addedLinkToCell,
      },
    ];
    return (
      <>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="table-sm custom-table some-table">
                  <BootstrapTable keyField="id" data={cp} columns={columns}  className="border-none"/>
                </div>
                <div className="d-flex align-items-center">
                <AddCasePersonalModal CID = {this.props.CID} cp = {cp} updateCP={updateCP}/>
                <SelectCasePersonel CID = {this.props.CID} cp = {cp} cb={this.props.onGlobalLoad}/>
                </div>
                
              </CardBody>
            </Card>
            <Modal
              isOpen={this.state.modal}
              switch={this.switch_modal}
              centered={true}
            >
              {this.state.modalType == "del" ? (
                <>
                  <ModalHeader
                    toggle={() => this.setState({ modal: false })}
                    className="text-center"
                  >
                    Delete User
                  </ModalHeader>
                  <ModalBody toggle={() => this.setState({ modal: false })}>
                    <p>
                      Are you sure you want to delete
                      <span className="accent_text">
                        { this.state.userId }
                      </span>
                      ?
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      type="button"
                      color="danger"
                      onClick={this.deleteUser}
                    >
                      Delete
                    </Button>
                    <Button
                      type="button"
                      color="primary"
                      onClick={() => this.setState({ modal: false })}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </>
              ) : (
                <>
                  <ModalHeader
                    toggle={() => this.setState({ modal: false })}
                    className="text-center"
                  >
                    <p>Edit User</p>
                  </ModalHeader>
                  <ModalBody toggle={() => this.setState({ modal: false })}>
                    <div>
                      <p>Role</p>
                      <Select
                        options={roles}
                        defaultValue={roles.filter((x) => x.value == this.state.newRole)}
                        className="basic-multi-select"
                        name="newRole"
                        classNamePrefix="select"
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="mt-3">
                    <p>Side</p>
                      <Select
                        attr-case-name={this.props.caseName}
                        options={side}
                        name="newSide"
                        defaultValue={side.filter((x) => x.value == this.state.newSide)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="mt-3">
                      <p>Previliges</p>
                      <Select
                        attr-case-name={this.props.caseName}
                        options={previliges}
                        isMulti={true}
                        closeMenuOnSelect={false}
                        name="newSide"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={this.state.rolePriv}
                        onChange={this.onChangeRolePrivilege}
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      type="button"
                      color="success"
                      onClick={this.editUser}
                    >
                      Accept
                    </Button>
                  </ModalFooter>
                </>
              )}
            </Modal>
          </Col>
        </Row>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    participantRoles: state.User.participantRoles,
    casePreviliges: state.User.previliges,
    URoles: state.User.User_Roles,
    
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CasePersonalView);
