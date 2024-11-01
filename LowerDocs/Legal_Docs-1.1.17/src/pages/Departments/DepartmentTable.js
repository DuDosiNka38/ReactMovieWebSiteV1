import React, { Component } from "react";
import { AvField, AvForm } from "availity-reactstrap-validation";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Col,
  Row
} from "reactstrap";
// Editable
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import { connect } from "react-redux";
import axios from "./../../services/axios";
import noteWindow from "../../services/notifications";
import PRIVILEGE from "../../services/privileges";
import AddDepartment from "./AddDepartment";
const { SearchBar, ClearSearchButton } = Search;

//Import Breadcrumb

class EditableTables extends Component {
  state = {
    modal: false,
    iRow: null,
    userName: null,
    modalType: "",
    depId: "",
  };

  deleteDepartment = this.deleteDepartment.bind(this);
  editDepartment = this.editDepartment.bind(this);

  switch_modal = (e) => {
    const depId = e.currentTarget.value;
    this.setState({depId: depId});

    this.setState({ modalType: e.currentTarget.name });
    const row = e.currentTarget.getAttribute("attr-row-id");
    this.setState({ iRow: row });
    const Dep = this.props.departments[row];
    this.setState({
      Court_name: Dep.Court_name,
      Department_Name: Dep.Department_Name,
      Judge_name: Dep.Judge_name,
      Department_id: Dep.Department_id,
    });
    const UId = this.props.departments[row].Department_id;
    this.setState({ depId: UId });
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };
  async deleteDepartment() {
    let depID = this.props.departments;
    let ind = this.state.iRow;
    depID.splice(ind, 1);

    const response = await axios.post(
      "/api/department/delete", {Department_id: this.state.depId});

    if (response.data.result) {
      noteWindow.isSuck("Department delete!");
    } else if (
      response.data.result_data.hasOwnProperty("result_error_text")
    ) {
      noteWindow.isError(response.data.result_data.result_error_text);
    }

    this.setState({ modal: false });
  }

  async editDepartment(e) {
    // const { departments } = this.props;
    // const { depId } = this.state;
    // const getCurrentDep = departments[this.state.iRow];

    const result = await axios.post('/api/department/update', 
    // getCurrentDep
    {
      Court_name: this.state.Court_name,
      Department_Name: this.state.Department_Name,
      Judge_name: this.state.Judge_name,
      Department_id: this.state.Department_id,
    }
    ).then(function (response) {
      if (response.data.result) {
        noteWindow.isSuck("User Added!")
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

    if(result) {
      this.setState({modal: !this.state.modal})
      setTimeout(window.location.reload(),500)
          
    }
  }

  addedLinkToCell = (cell, row, rowIndex, formatExtraData) => {
    return (
      <>
        {PRIVILEGE.check("EDIT_DEPARTMENT", this.props.personeData) && 
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
        }
        {PRIVILEGE.check("DELETE_DEPARTMENT", this.props.personeData) && 
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
        }
        {!PRIVILEGE.check("EDIT_DEPARTMENT", this.props.personeData)&&!PRIVILEGE.check("DELETE_DEPARTMENT", this.props.personeData) &&
        <>
        <p>-</p>
        </>
        }
      </>
    );
    // this.setState({})
  };
  render() {
    if(this.props.personeData === undefined)
        return (<></>);

    // const pData = this.props.personeData;

    const cellEdit = cellEditFactory({
      mode: "click",
      beforeSaveCell(oldValue, newValue, row, column, done) {
        setTimeout(() => {
          const conf = window.confirm;
          if (conf("Do you want to accept this change?")) {
            done();
          } else {
            done(false);
          }
        }, 0);
        return { async: true };
      },
    });

    const columns = [
      {
        dataField: "Department_id",
        text: "Department Short Name",
      },
      {
        dataField: "Court_name",
        text: "Court",
      },
      {
        dataField: "Department_Name",
        text: "Department",
      },
      {
        dataField: "Judge_name",
        text: "Judge",
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
      <React.Fragment>
        <Card>
          <CardBody>
            <div className="">
              <div className="d-flex justify-content-end w-100">
              <AddDepartment/>
              </div>
             
              <div className="some-table ">
              <ToolkitProvider
                            bootstrap4
                            keyField="1"
                            data={this.props.departments}
                            columns={columns}
                            cellEdit={cellEdit}
                            className="striped  custom-table some-table"
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
                                    pagination={this.props.departments.length > 10 && paginationFactory(pagination) }
                                    striped
                                    hover
                                    condensed
                                    className="striped"
                                  />
                                </div>
                              </div>
                            )}
                          </ToolkitProvider>
              </div>
            </div>
          </CardBody>
        </Card>
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
                  onClick={this.deleteDepartment}
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
                  <AvForm onSubmit={this.addNewDepartment}>
                    <FormGroup className="auth-form-group-custom mb-4">
                      <i className="ri-bank-line auti-custom-input-icon"></i>
                      <Label htmlFor="DepartmentId">Department Id</Label>

                      <AvField
                        name="Department_id"
                        value={this.state.Department_id}
                        type="text"
                        className="form-control"
                        id="DepartmentId"
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
                        name="Department_Name"
                        value={this.state.Department_Name}
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
                  </AvForm>
                </>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  color="success"
                  onClick={this.editDepartment}
                >
                  Accept
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
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    departments: state.User.depatmentsData.departments,
    personeData: state.User.persone,
  };
};
export default connect(mapStateToProps, null)(EditableTables);
