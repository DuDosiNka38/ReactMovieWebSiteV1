import React, { Component, Suspense, lazy } from "react";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Table } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import notification from "../../services/notification";
import * as PreloaderActions from "./../../store/preloader/actions";
import EventsApi from "../../api/EventsApi";
import CaseApi from "../../api/CaseApi";
import CalendarsApi from "../../api/CalendarsApi";

class ActivityTypeRequirementsModal extends Component {
  state = {
    Requirements: [],
    CaseTypes: [],
    CalendarTypes: [],

    isInit: false,
  };

  submit = async () => {
    const { onSubmit, hideModal, type, Preloader } = this.props;

    Preloader.show();

    if (onSubmit && typeof onSubmit === "function") {
      await onSubmit();
    }

    hideModal(type);
    Preloader.hide();
  };

  getActivityType = (key) => {
    const { ActivityTypes } = this.props;
    const search = ActivityTypes.find((x) => x.Activity_type === key);

    return search.Description || "-";
  };

  getCaseType = (key) => {
    const { CaseTypes } = this.state;
    const search = CaseTypes.find((x) => x.Case_Type === key);

    return search ? search.Description : "-";
  };

  getCaseTypeColor = (key) => {
    const { CaseTypes } = this.state;
    const search = CaseTypes.find((x) => x.Case_Type === key);

    return search ? search.Type_Color : "-";
  };

  getCalendarType = (key) => {
    const { CalendarTypes } = this.state;
    const search = CalendarTypes.find((x) => x.Calendar_Type === key);

    return search ? search.Description : "-";
  };

  increase = (field, data) => {
    const { Requirements } = this.state;
    const i = Requirements.findIndex((x) => x === data);

    if (i === -1) return;

    Requirements[i][field] = parseInt(Requirements[i][field]) + 1;

    this.setState({ Requirements });
  };

  decrease = (field, data) => {
    const { Requirements } = this.state;
    const i = Requirements.findIndex((x) => x === data);

    if (i === -1) return;

    Requirements[i][field] = parseInt(Requirements[i][field]) - 1;

    if (Requirements[i][field] < 0) Requirements[i][field] = 0;

    this.setState({ Requirements });
  };

  onHandleChange = (field, data, e) => {
    const { value } = e.currentTarget;
    const { Requirements } = this.state;
    const i = Requirements.findIndex((x) => x === data);

    if (i === -1) return;

    Requirements[i][field] = parseInt(value);

    this.setState({ Requirements });
  };

  addNewActivityRequirement = () => {
    const { Activity_type } = this.props;
    const { Requirements, isInit, CaseTypes, ActivityTypes, CalendarTypes } = this.state;
    this.props.showModal("ADD_NEW_ACTIVITY_REQUIREMENT", {
      Parent_Activity_type: Activity_type,
      Parent_Activity_type_Desc: this.getActivityType(Activity_type),
      CaseTypes,
      ActivityTypes,
      CalendarTypes,
      Requirements,
      onSubmit: async () => {
        this.loadActivityRequirements();
      },
    });
  };

  editActivityRequirement = (data) => {
    const { showModal, Activity_type } = this.props;
    const { Requirements, isInit, CaseTypes, ActivityTypes, CalendarTypes } = this.state;

    showModal("EDIT_ACTIVITY_REQUIREMENT", {
      CaseTypes,
      ActivityTypes,
      CalendarTypes,
      Requirements,
      data: {
        ...data,
        Parent_Activity_type: Activity_type,
        Parent_Activity_type_Desc: this.getActivityType(Activity_type),
      },
      onSubmit: async () => {
        this.loadActivityRequirements();
      },
    });
  };

  deleteActivityRequirement = (data) => {
    const { showModal } = this.props;

    showModal("DELETE_ACTIVITY_REQUIREMENT", {
      data,
      onSubmit: async () => {
        const response = await EventsApi.deleteActivityRequirement(
          data.Parent_Activity_type,
          data.Child_Activity_type,
          data.Case_Type
        );
        await this.loadActivityRequirements();

        //Update data
      },
    });
  };

  loadActivityRequirements = async () => {
    const { Activity_type } = this.props;
    const Requirements = await EventsApi.fetchActivityRequirements();
    this.setState({ Requirements: Requirements.filter((x) => x.Parent_Activity_type === Activity_type) });
  };

  async componentDidMount() {
    const { ActivityTypes } = this.props;
    await this.loadActivityRequirements();
    const CaseTypes = await CaseApi.fetchCaseTypes();

    const CalendarTypes = await CalendarsApi.fetchCalendarTypes();

    this.setState({
      CaseTypes,
      ActivityTypes,
      CalendarTypes,
      isInit: true,
    });
  }

  render() {
    const { Activity_type } = this.props;
    const { Requirements, isInit, CaseTypes, ActivityTypes, CalendarTypes } = this.state;

    return (
      <>
        <>
          <Modal
            isOpen={true}
            centered={true}
            className="delete-case-modal"
            size="xl"
            // style={{ minWidth: "60vw" }}
          >
            <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
              Edit Activity Requirements: {this.getActivityType(Activity_type)}
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal">
              {isInit ? (
                <>
                  <div className="add-new-requirement">
                    <Button
                      className="ld-button-warning w-100 mb-2"
                      type="submit"
                      onClick={this.addNewActivityRequirement}
                    >
                      Add New Requirement
                    </Button>
                  </div>
                  <Table className="customTable mb-0 hovered">
                    <thead>
                      <tr>
                        {/* <td>Parent Activity Type</td> */}
                        <td>Case Type</td>
                        <td>Requirement</td>
                        <td className="text-center">Min Days Before</td>
                        <td className="text-center">Max Days Before</td>
                        <td className="text-center">Min Days After</td>
                        <td className="text-center">Max Days After</td>
                        <td className="text-right">Calendar Type</td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {Requirements.length ? (
                        <>
                          {(() => {
                            let currentCaseType = null;
                            let caseTypeFirstInd = null;

                            return Requirements.map((r, i) => {
                              if (currentCaseType !== r.Case_Type) {
                                currentCaseType = r.Case_Type;
                                caseTypeFirstInd = i;
                              }

                              return (
                                <>
                                  {caseTypeFirstInd === i && i !== 0 && (
                                    <>
                                      <tr>
                                        <td colSpan={8}></td>
                                      </tr>
                                    </>
                                  )}
                                  <tr>
                                    {/* {i === 0 && (
                                  <>
                                    <td rowSpan={Requirements.length}>
                                      {Activity_type}
                                    </td>
                                  </>
                                )} */}
                                    {caseTypeFirstInd === i && (
                                      <>
                                        <td
                                          rowSpan={Requirements.filter((ar) => ar.Case_Type === currentCaseType).length}
                                          style={{
                                            background: this.getCaseTypeColor(currentCaseType),
                                            color: "#fff",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                          }}
                                        >
                                          {this.getCaseType(r.Case_Type)}
                                        </td>
                                      </>
                                    )}

                                    <td>
                                      {this.getActivityType(Activity_type)}
                                      {" -> "}
                                      {this.getActivityType(r.Child_Activity_type)}
                                    </td>
                                    <td className="text-center">
                                      {r.Min_days_before || "-"}
                                      {/* <div className="d-flex align-items-center justify-content-center change-activity-req-dates">
                                    <div className="decrease" onClick={() => this.decrease("Max_Days_before", r)}>
                                      <i class="ri-subtract-line"></i>
                                    </div>
                                    <Input
                                      value={r.Max_Days_before || "-"}
                                      type="text"
                                      onChange={(e) => this.onHandleChange("Max_Days_before", r, e)}
                                      // readOnly={true}
                                    />
                                    <div className="increase" onClick={() => this.increase("Max_Days_before", r)}>
                                      <i class="ri-add-line"></i>
                                    </div>
                                  </div> */}
                                    </td>

                                    <td className="text-center">
                                      {r.Max_Days_before || "-"}
                                      {/* <div className="d-flex align-items-center justify-content-center change-activity-req-dates">
                                    <div className="decrease" onClick={() => this.decrease("Min_days_before", r)}>
                                      <i class="ri-subtract-line"></i>
                                    </div>
                                    <Input
                                      value={r.Max_Days_before || "-"}
                                      type="text"
                                      onChange={(e) => this.onHandleChange("Max_Days_before", r, e)}
                                      // readOnly={true}
                                    />
                                    <div className="increase" onClick={() => this.increase("Max_Days_before", r)}>
                                      <i class="ri-add-line"></i>
                                    </div>
                                  </div> */}
                                    </td>

                                    <td className="text-center">
                                      {r.Min_Days_after || "-"}
                                      {/* <div className="d-flex align-items-center justify-content-center change-activity-req-dates">
                                    <div className="decrease" onClick={() => this.decrease("Max_Days_after", r)}>
                                      <i class="ri-subtract-line"></i>
                                    </div>
                                    <Input
                                      value={r.Max_Days_before || "-"}
                                      type="text"
                                      onChange={(e) => this.onHandleChange("Max_Days_before", r, e)}
                                      // readOnly={true}
                                    />
                                    <div className="increase" onClick={() => this.increase("Max_Days_before", r)}>
                                      <i class="ri-add-line"></i>
                                    </div>
                                  </div> */}
                                    </td>

                                    <td className="text-center">
                                      {r.Max_Days_after || "-"}
                                      {/* <div className="d-flex align-items-center justify-content-center change-activity-req-dates">
                                    <div className="decrease" onClick={() => this.decrease("Min_Days_after", r)}>
                                      <i class="ri-subtract-line"></i>
                                    </div>
                                    <Input
                                      value={r.Max_Days_before || "-"}
                                      type="text"
                                      onChange={(e) => this.onHandleChange("Max_Days_before", r, e)}
                                      // readOnly={true}
                                    />
                                    <div className="increase" onClick={() => this.increase("Max_Days_before", r)}>
                                      <i class="ri-add-line"></i>
                                    </div>
                                  </div> */}
                                    </td>
                                    <td className="text-right">{this.getCalendarType(r.Calendar_type)}</td>
                                    <td>
                                      <i
                                        className="ri-settings-5-line cursor-pointer mr-2"
                                        title="Edit Activity Requirement"
                                        onClick={() => this.editActivityRequirement(r)}
                                      ></i>
                                      <i
                                        class="ri-close-line cursor-pointer"
                                        title="Remove Activity Requirement"
                                        onClick={() => this.deleteActivityRequirement(r)}
                                      ></i>
                                    </td>
                                  </tr>
                                </>
                              );
                            });
                          })()}
                        </>
                      ) : (
                        <>
                          <tr>
                            <td colSpan={8}>Requirements is missing!</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </Table>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-center p-3">
                    <Spinner size="m" />
                  </div>
                </>
              )}
            </ModalBody>
            <ModalFooter className="mfooterGTO">
              <Button className="ld-button-success" type="submit" onClick={this.submit}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("ACTIVITY_TYPE_REQUIREMENTS")),
    hide: () => dispatch(PreloaderActions.hidePreloader("ACTIVITY_TYPE_REQUIREMENTS")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityTypeRequirementsModal);
