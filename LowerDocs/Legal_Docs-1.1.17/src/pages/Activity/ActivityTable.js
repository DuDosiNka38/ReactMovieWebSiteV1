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
  CardHeader,
  Row,
  Col,
  Table,
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
import AddActivityType from "./AddActivityType";
import Select from "react-select";

import PRIVILEGE from "../../services/privileges";
import * as actions from "../../store/user/actions";
import ConfigActivity from "../../components/Activity/ConfigActivity";
const { SearchBar, ClearSearchButton } = Search;

//Import Breadcrumb

class ActivityTable extends Component {
  state = {
    modal: false,
    iRow: null,
    userName: null,
    modalType: "",
    depId: "",
    selectedCaseType: null,
    Act_Requirements: {},
    update: false,
    Activity_type: "",
    Description: "",
  };

  deleteActType = this.deleteActType.bind(this);
  onSelectChange = this.onSelectChange.bind(this);

  switch_modal = (e) => {
    if(e !== undefined){
      this.setState({ modalType: e.currentTarget.name });
      const row = e.currentTarget.getAttribute("attr-row-id");
      this.setState({ iRow: row });

      const ct = this.props.caseTypes
        .filter((x) => x.visible == true)
        .map((x) => ({
          value: x.Case_Type,
          label: x.Description,
          name: "case_type",
        }));

      this.setState({ selectedCaseType: ct[0].value });

      const currentAct = this.props.activityTypes[row];
      const currentActReq = currentAct.Act_Requirements;

      this.setState({
        Act_Requirements: currentActReq,
        Activity_type: currentAct.Activity_type,
        Description: currentAct.Description,
      });
    }

    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  async deleteActType() {
    let act = this.props.activityTypes;
    let ind = this.state.iRow;

    const response = await axios.post("/api/event/deleteActivityType", {
      Activity_type: this.state.Activity_type,
    });

    if (response.data.result) {
      noteWindow.isSuck("Activity type delete!");
      this.props.onGlobalLoad();
    } else if (response.data.result_data.hasOwnProperty("result_error_text")) {
      noteWindow.isError(response.data.result_data.result_error_text);
    }

    this.setState({ modal: false });
  }

  onSelectChange(e) {
    if (e.name == "case_type") {
      this.setState({
        selectedCaseType: e.value,
        update: !this.state.update,
      });
    } else {
      const { Act_Requirements, selectedCaseType } = this.state;
      Act_Requirements[selectedCaseType].Parent_Activity_type = e.value;

      this.setState({
        Act_Requirements: Act_Requirements,
        update: !this.state.update,
      });
    }
  }

  handleInputChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };

  handleChange = (el) => {
    const { Act_Requirements, selectedCaseType } = this.state;
    const { name, value } = el.currentTarget;

    Act_Requirements[selectedCaseType][name] = value;

    this.setState({ Act_Requirements: Act_Requirements });
  };

  getValue(v) {
    const { Act_Requirements, selectedCaseType } = this.state;
    return selectedCaseType == null ? 0 : Act_Requirements[selectedCaseType][v];
  }

  getSelectedParent() {
    const { Act_Requirements, selectedCaseType } = this.state;

    return selectedCaseType == null
      ? "DEFAULT"
      : Act_Requirements[selectedCaseType].Parent_Activity_type;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.update !== prevState.update) {
      this.setState({ update: !prevState.update });
    }
  }
  render() {
    const activityTypes = this.props.activityTypes.filter((x) => x.visible === true);

    if (this.props.personeData == undefined) return <></>;

    const pData = this.props.personeData;

    if (this.props.activityTypes == undefined) return <></>;
    if (this.props.caseTypes == undefined) return <></>;

    return (
      <React.Fragment>
        <Card>
          <CardBody>
          <div className="d-flex justify-content-end w-100">
                <Modal
                  isOpen={this.state.modal}
                  switch={this.switch_modal}
                  centered={true}
                  size={this.state.modalType === "del" ? "" : "xl"}
                >
                  {this.state.modalType == "del" ? (
                    <>
                      <ModalHeader
                        toggle={() => this.setState({ modal: false })}
                        className="text-center"
                      >
                        Delete Activity type
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
                          onClick={this.deleteActType}
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
                        <p>Edit Activity type</p>
                      </ModalHeader>
                      <ModalBody toggle={() => this.setState({ modal: false })}>
                        <ConfigActivity switch_modal={this.switch_modal} succsess={this.state.succsess} type="EDIT" data={this.state}></ConfigActivity>
                        
                      </ModalBody>
                    </>
                  )}
                </Modal>
              </div>
            <div className="d-flex justify-content-between">
              <h4 className="mb-3 h4">Activity Types</h4>
              <AddActivityType />
            </div>
            <Table className="customTable">
              <thead>
                <tr>
                  <td>Type</td>
                  <td>Description</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {activityTypes.length > 0 
                  ?
                    activityTypes.map((x, rowIndex) => (
                      <>
                        <tr>
                          <td>{x.Activity_type}</td>
                          <td>{x.Description}</td>
                          <td>
                            {PRIVILEGE.check(
                              "EDIT_ACTIVITY_TYPE",
                              this.props.personeData
                            ) && (
                              <>
                                <Button
                                  onClick={this.switch_modal}
                                  name="add"
                                  type="button"
                                  className="btnToTable"
                                  color="primary"
                                  attr-row-id={rowIndex}
                                >
                                  <i className="ri-pencil-line iToTable"></i>
                                </Button>
                              </>
                            )}
                            {PRIVILEGE.check(
                              "DELETE_ACTIVITY_TYPE",
                              this.props.personeData
                            ) && (
                              <>
                                <Button
                                  className=" ml-2 btnToTable"
                                  type="button"
                                  color="danger"
                                  onClick={this.switch_modal}
                                  // value={cell}
                                  attr-row-id={rowIndex}
                                  name="del"
                                >
                                  <i className="ri-delete-bin-2-line iToTable"></i>
                                </Button>
                              </>
                            )}
                            {!PRIVILEGE.check(
                              "EDIT_ACTIVITY_TYPE",
                              this.props.personeData
                            ) &&
                              !PRIVILEGE.check(
                                "DELETE_ACTIVITY_TYPE",
                                this.props.personeData
                              ) && (
                                <>
                                  <p>-</p>
                                </>
                              )}
                          </td>
                        </tr>
                      </>                    
                    ))
                  :
                    <>
                      <tr>
                        <td colSpan={3}>Actvity types list is empty</td>
                      </tr>
                    </>
                  }
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    personeData: state.User.persone,
    activityTypes: state.User.activityTypes,
    caseTypes: state.User.casesTypes,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityTable);
