import React, { Component } from "react";
import axios from "./../../services/axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalBody,
  FormGroup,
  Label,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { AvField, AvForm } from "availity-reactstrap-validation";
import noteWindow from "../../services/notifications";
import PRIVILEGE from "./../../services/privileges";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";

// import PRIVILEGE from "../../services/privileges";
import { connect } from "react-redux";
import AddCalendar from "./AddCalendar";
const { SearchBar, ClearSearchButton } = Search;

class Calendars extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "Calendars Managment", link: "#" },
    ],
    calId: "",
    iRow: null,
    userName: null,
    modalType: "",
    Calendar_name: "",
    Description: "",
    modfiy: "",
    modal: false,
  };
  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };

  deleteCalendar = this.deleteCalendar.bind(this);
  editCalendar = this.editCalendar.bind(this);

  switch_modal = (e) => {
    const calId = e.currentTarget.value;
    this.setState({ calId: calId });

    this.setState({ modalType: e.currentTarget.name });
    const row = e.currentTarget.getAttribute("attr-row-id");
    this.setState({ iRow: row });
    const Dep = this.props.calendars.All[row];
    this.setState({
      Calendar_name: Dep.Calendar_name,
      Description: Dep.Description,
      modfiy: Dep.Modifiable,
    });

    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  addedLinkToCell = (cell, row, rowIndex, formatExtraData) => {
    return (
      <>
        {PRIVILEGE.check("EDIT_DEPARTMENT", this.props.personeData) && (
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
          </>
        )}
        {PRIVILEGE.check("DELETE_DEPARTMENT", this.props.personeData) && (
          <>
            <Button
              className=" ml-2 btnToTable"
              type="button"
              color="danger"
              onClick={this.switch_modal}
              value={cell}
              attr-row-id={rowIndex}
              name="del"
            >
              <i className="ri-delete-bin-2-line iToTable"></i>
            </Button>
          </>
        )}
        {!PRIVILEGE.check("EDIT_DEPARTMENT", this.props.personeData) &&
          !PRIVILEGE.check("DELETE_DEPARTMENT", this.props.personeData) && (
            <>
              <p>-</p>
            </>
          )}
      </>
    );
    // this.setState({})
  };

  async deleteCalendar() {
    let calId = this.props.calendars.All;
    let ind = this.state.iRow;
    calId.splice(ind, 1);

    const response = await axios.post("/api/calendar/delete", {
      Department_id: this.state.calId,
    });

    if (response.data.result) {
      noteWindow.isSuck("Department delete!");
    } else if (response.data.result_data.hasOwnProperty("result_error_text")) {
      noteWindow.isError(response.data.result_data.result_error_text);
    }

    this.setState({ modal: false });
  }

  async editCalendar(e) {
    const result = await axios
      .post("/api/calendar/update", {
        Calendar_name: this.state.Calendar_name,
        Description: this.state.Description,
        modfiy: this.state.modfiy,
      })
      .then(function (response) {
        if (response.data.result) {
          noteWindow.isSuck("Calendar edited");
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
      this.setState({ modal: !this.state.modal });
      setTimeout(window.location.reload(), 500);
    }
  }
  render() {
    const { calendars } = this.props;
    if (calendars.length < 0) return <></>;

    let allCalendars = calendars.All;
    if (allCalendars === undefined) return <></>;

    const columns = [
      {
        dataField: "Calendar_name",
        text: "Calendar Name",
      },
      {
        dataField: "Description",
        text: "Description",
      },
      {
        dataField: "Modifiable",
        text: "Modifiable",
      },

      {
        dataField: "",
        text: "Actions",
        formatter: this.addedLinkToCell,
        editable: (cell) => (cell = false),
      },
    ];
    const sizePerPageRenderer = ({
      options,
      currSizePerPage,
      onSizePerPageChange,
    }) => (
      <div className="btn-group" role="group">
        {options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelect ? "btn-secondary" : "btn-light"}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    );

    const pagination = {
      sizePerPageRenderer,
    };

    return (
      <>
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title="Calendars Managment"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
            <h5 className="mb-3">Calendars Managment</h5>

            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <div className="justify-content-end d-flex">
                      <AddCalendar />
                    </div>

                    <ToolkitProvider
                      bootstrap4
                      keyField="1"
                      data={allCalendars}
                      columns={columns}
                      className="striped"
                      search
                    >
                      {(props) => (
                        <div>
                          <Row className="d-flex align-items-center justify-content-between">
                            <Col lg="11">
                              <SearchBar
                                className="mb-3"
                                onChang={this.handleChange}
                                {...props.searchProps}
                                style={{ width: "400px", height: "40px" }}
                              />
                            </Col>

                            <Col
                              lg={1}
                              className="d-flex justify-content-end mb-4"
                            >
                              <ClearSearchButton
                                {...props.searchProps}
                                className="btn btn-info"
                              />
                            </Col>
                          </Row>
                          <div className="">
                            <BootstrapTable
                              {...props.baseProps}
                              filter={filterFactory()}
                              noDataIndication="There is no solution"
                              pagination={
                                allCalendars.length > 10 &&
                                paginationFactory(pagination)
                              }
                              striped
                              hover
                              condensed
                              className="striped"
                            />
                          </div>
                        </div>
                      )}
                    </ToolkitProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Modal
              isOpen={this.state.modal}
              switch={this.switch_modal}
              centered={true}
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
                      <span className="accent_text"></span>?
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      type="button"
                      color="danger"
                      onClick={this.deleteCalendar}
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
                    <p>Edit Department</p>
                  </ModalHeader>
                  <ModalBody toggle={() => this.setState({ modal: false })}>
                    <>
                      <AvForm>
                        <FormGroup className="auth-form-group-custom mb-4">
                          <i className="ri-bank-line auti-custom-input-icon"></i>
                          <Label htmlFor="CalendarName">Calendar Name</Label>

                          <AvField
                            name="Calendar_name"
                            value={this.state.Calendar_name}
                            type="text"
                            className="form-control"
                            id="CalendarName"
                            onChange={this.handleChange}
                            validate={{ required: true }}
                            placeholder="Enter Calendar Name"
                          />
                        </FormGroup>
                        <FormGroup className="auth-form-group-custom mb-4">
                          <i className="ri-bank-line auti-custom-input-icon"></i>
                          <Label htmlFor="Description">Description</Label>

                          <AvField
                            name="Description"
                            value={this.state.Description}
                            type="text"
                            className="form-control"
                            id="Description"
                            onChange={this.handleChange}
                            validate={{ required: true }}
                            placeholder="Enter Court name"
                          />
                        </FormGroup>
                        <FormGroup className="auth-form-group-custom mb-4">
                          <i className=" ri-text auti-custom-input-icon"></i>
                          <Label htmlFor="username">Department name</Label>
                          <AvField
                            name="Department_Name"
                            value={this.state.modfiy}
                            type="text"
                            className="form-control"
                            id="departmentName"
                            onChange={this.handleChange}
                            validate={{ required: true }}
                            placeholder="Enter Department name"
                          />
                        </FormGroup>
                      </AvForm>
                    </>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      type="button"
                      color="success"
                      onClick={this.editCalendar}
                    >
                      Acept
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
              )}
            </Modal>
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    calendars: state.User.calendars,
    personeData: state.User.persone,
  };
};
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Calendars);
