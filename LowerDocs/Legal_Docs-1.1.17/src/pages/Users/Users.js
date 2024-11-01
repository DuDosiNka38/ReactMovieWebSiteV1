import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";

import {
  Card,
  CardBody,
  Row,
  Col,
  Container,
  Media,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,

  // NavLink
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { NavLink } from "react-router-dom";
import axios from "./../../services/axios";
import noteWindow from "./../../services/notifications";
import PRIVILEGE from "../../services/privileges";
import UsersTabs from "./UsersTabs";
let pc = null;

class Users extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "#" },
      { title: "Users", link: "#" },
    ],
    modal: false,
    iRow: null,
    userName: null,
    modalType: "",
    uId: null,
    // users: []
  };
  // modalClose = this.modalClose.bind(this);
  deleteUser = this.deleteUser.bind(this);

  switch_modal = (e) => {
    this.setState({ iRow: e.currentTarget.value });
    this.setState({ userName: e.currentTarget.name });
    const row = e.currentTarget.getAttribute("attr-row-id");
    const type = e.currentTarget.getAttribute("attr-type");
    const modaltype = e.currentTarget.getAttribute("attr-modal-type");
    this.setState({ modalType: modaltype });
    let users = [];

    if (type === "person") {
      users = this.props.allUserData;
    }

    if (type === "user") {
      users = this.props.staff;
    }

    const UId = users[row].Person_id;
    this.setState({ uId: UId });

    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  goToSettings(e) {
    this.setState({ userName: e.currentTarget.name });
  }

  componentDidMount() {
    this.props.onAllUsersLoad();
    this.props.onStaffLoad();
  }

  addedLinkToCell = (cell, row, rowIndex, formatExtraData) => {
    return (
      <>
        {PRIVILEGE.check("EDIT_USER", this.props.personeData) && (
          <>
            <NavLink to={`/configusers/${cell}`}>
              <Button type="button" className="btnToTable" color="primary">
                <i className=" ri-settings-2-line iToTable"></i>
              </Button>
            </NavLink>
            {row.hasOwnProperty("Computers") && (
              <>
                <Button
                  className=" ml-2 btnToTable"
                  type="button"
                  color={
                    row.Computers.find((x) => x.Approved_date == null) ==
                    undefined
                      ? "info"
                      : "warning"
                  }
                  onClick={this.switch_modal}
                  value={rowIndex}
                  attr-row-id={rowIndex}
                  attr-type={row.type}
                  attr-modal-type="computers"
                  name={cell}
                >
                  <i className=" ri-computer-line iToTable"></i>
                </Button>
              </>
            )}
          </>
        )}
        {PRIVILEGE.check("DELETE_USER", this.props.personeData) && (
          <>
            <Button
              className=" ml-2 btnToTable"
              type="button"
              color="danger"
              onClick={this.switch_modal}
              value={rowIndex}
              attr-row-id={rowIndex}
              attr-type={row.type}
              name={cell}
              attr-modal-type="del"
            >
              <i className="ri-delete-bin-2-line iToTable"></i>
            </Button>
          </>
        )}
        {!PRIVILEGE.check("EDIT_USER", this.props.personeData) &&
          !PRIVILEGE.check("DELETE_USER", this.props.personeData) && (
            <>
              <p>-</p>
            </>
          )}
      </>
    );
  };

  async deleteUser() {
    // let ind = this.state.iRow;
    const update = this.props.onGlobalLoad;

    await axios
      .post("/api/user/delete", {
        Person_id: this.state.uId,
      })
      .then(function (response) {
        if (response.data.result) {
          update();
          noteWindow.isSuck("User Deleted!");
        } else {
          noteWindow.isError(response.data.result_data.result_error_text);
        }
      })
      .catch((response) => noteWindow.isError(response));
    this.setState({ modal: false });
  }

  async applyPC(x) {
    await axios
      .post("/api/user/acceptComputer", x)
      // .then(function (response) {
      //   if (response.data.result) {
      //     update();
      //     noteWindow.isSuck("User !");
      //   } else {
      //     noteWindow.isError(response.data.result_data.result_error_text);
      //   }
      // })
      // .catch((response) => noteWindow.isError(response));
      .then((response) => console.log(response))
      .catch((response) => console.log(response));
    this.props.onGlobalLoad();
  }
  async declinePC(x) {
    await axios
      .post("/api/user/declineComputer", x)
      .then((response) => console.log(response))
      .catch((response) => console.log(response));
    this.props.onGlobalLoad();
  }

  render() {
    const { uRoles } = this.props;

    if (this.props.personeData === undefined || uRoles.length === 0)
      return <></>;

    const pData = this.props.personeData;

    if (!PRIVILEGE.check("SHOW_USERS", pData))
      return (
        <>
          <div className="page-content">
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <h5>You don't have permissions to see this page!</h5>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      );

    const Users = this.props.allUserData.map((x) => {
      x.type = "person";
      let role = uRoles.find((r) => r.Role == x.User_Role);
      x.User_Role_Name = role !== undefined ? role.DESCRIPTION : null;

      return x;
    });
    const Staff = this.props.staff.map((x) => {
      x.type = "user";
      let role = uRoles.find((r) => r.Role == x.User_Role);
      x.User_Role_Name = role.DESCRIPTION;
      return x;
    });

    const renderPC = () => {
      if (this.state.modalType === "computers") {
        pc = Staff.find((x) => x.Person_id == this.state.uId).Computers;
        return (
          <>
            {pc.length > 0 ? (
              <>
                <Table className="table-bordered striped">
                  <thead>
                    <tr>
                      <td>Computer id</td>
                      <td>Mac Address</td>
                      <td>OS</td>
                      <td>Computer Type</td>
                      <td>Requested Date</td>
                      <td>Approved Date</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  {pc.map((x) => (
                    <>
                      <tr>
                        <td>{x.Computer_id}</td>
                        <td>{x.Mac_Address}</td>
                        <td>{x.OS}</td>
                        <td>{x.Computer_type}</td>
                        <td>{x.Request_date}</td>
                        <td>{x.Approved_date}</td>
                        <td>
                          {" "}
                          {x.Approved_date === null && (
                            <Button
                              type="button"
                              color="success"
                              onClick={() => this.applyPC(x)}
                              className="mr-2"
                            >
                              Apply
                            </Button>
                          )}
                          <Button
                            type="button"
                            color="danger"
                            onClick={() => this.declinePC(x)}
                          >
                            {x.Approved_date !== null ? "Remove" : "Decline"}
                          </Button>{" "}
                        </td>
                      </tr>
                    </>
                  ))}
                </Table>
              </>
            ) : (
              <h5>No connections, yet</h5>
            )}
          </>
        );
      }
    };
    //  if (pc === null ) return (<></>)

    const columns = [
      {
        dataField: "Person_id",
        text: "Person",
      },
      {
        dataField: "NAME",
        text: "Name",
      },
      {
        dataField: "Email_address",
        text: "Court",
      },
      {
        dataField: "Phone_number",
        text: "Phone",
      },
      {
        dataField: "User_Role_Name",
        text: "User Role",
      },
    ];

    const columnsStaff = [
      {
        dataField: "Person_id",
        text: "Person",
      },
      {
        dataField: "NAME",
        text: "Name",
      },
      {
        dataField: "Email_address",
        text: "Court",
      },
      {
        dataField: "Phone_number",
        text: "Phone",
      },
      {
        dataField: "User_Role_Name",
        text: "User Role",
      },
    ];

    return (
      <>
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title="Users"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
            <h5 className="mb-3">Users</h5>

            <Row>
              {/* <Col lg={12}>
                <Row className="d-flex justify-content-end">
                  <Col lg={3}>
                    {PRIVILEGE.check("ADD_USER", pData) && (
                      <>
                        <Card>
                          <CardBody className="border-top ">
                            <NavLink to="/register">
                              <Button
                                className="w-100 m-0"
                                color="success"
                                className="d-flex align-items-center w-100 justify-content-center"
                              >
                                <i className="ri-add-fill"></i>
                                Add New User
                              </Button>
                            </NavLink>
                          </CardBody>
                        </Card>
                      </>
                    )}
                  </Col>
                </Row>
              </Col> */}
              <UsersTabs
                users={Users}
                userData={columns}
                formatter={this.addedLinkToCell}
                staff={Staff}
                staffData={columnsStaff}
              />
              <Col lg={12}>
                <Modal
                  isOpen={this.state.modal}
                  switch={this.switch_modal}
                  centered={true}
                  onClosed={this.modalClose}
                  size={this.state.modalType === "del" ? "" : "xl"}
                >
                  {this.state.modalType === "del" ? (
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
                            {this.state.userName}
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
                        Computers
                      </ModalHeader>
                      <ModalBody toggle={() => this.setState({ modal: false })}>
                        <p>
                          User
                          <span className="accent_text">
                            {this.state.userName}
                          </span>{" "}
                          Computers
                        </p>
                        {renderPC()}
                      </ModalBody>
                    </>
                  )}
                </Modal>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allUserData: state.User.allUserData,
    personeData: state.User.persone,
    staff: state.User.staff,
    uRoles: state.User.User_Roles,
  };
};
const mapDispatchToProps = (dispatch) => ({
  onAllUsersLoad: () => dispatch(actions.getAllUserData()),
  onStaffLoad: () => dispatch(actions.getStf()),
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
