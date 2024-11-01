import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  Row,
  CardBody,
  FormGroup,
  Label,
  Col,
  Input,
  Table,
} from "reactstrap";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import axios from "./../../services/axios";
import noteWindow from "../../services/notifications";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Select from "react-select";
import logger from "redux-logger";
import fn from "./../../services/functions";
class AddEventFromCalendar extends Component {
  state = {
    warningModal: false,
    toggleSwitch: true,
    toggleDocs: false,
    selectedDocs: [],
    Case_NAME: this.props.currentCase,
    Activity_Name: "",
    Activity_type: "",
    Owner: "",
    Comments: "",
    Tentative_Calendar_name: "DEFAULT_CALENDAR",
    Tentative_date: "",
    Event_Time: `${`${new Date().getHours()}`.padStart(
      2,
      0
    )}:${`${new Date().getMinutes()}`.padStart(2, 0)}:00`,
    Parent_Activity_Name: "",
    Parent_Activity_type: "",
    Time_estimate_days: "",
    Responsible_Person_id: "",
    Responsible_person_Role: "",
    selectedDocs: [],
    notify: true,
    caseType: "",
    pActName: "",
    checkActReq: {
      startDate: null,
      endDate: null
    },
    isLoad: false,
    counter: 0,
  };

  deleteRow = this.deleteRow.bind(this);
  clearField = this.clearField.bind(this);
  addRow = this.addRow.bind(this);

  // warning_modal = this.warning_modal.bind(this);

  setSelectedDate = () => {
    if(this.props.modal === true){
      console.log(this.props)
      if (this.props.frombtn === true) {
        this.setState({
          Tentative_date: `${new Date().getFullYear()}-${`${
            new Date().getMonth() + 1
          }`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(
            2,
            0
          )}T${`${new Date().getHours()}`.padStart(
            2,
            0
          )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
          isLoad: true
        });
      } else {
        const eventDate = this.props.actualdata;

        if(eventDate === undefined || eventDate === null){
          setTimeout(this.setSelectedDate, 200);
        } else {
          const date = new Date(eventDate);
         
          this.setState({
            Tentative_date: `${date.getFullYear()}-${`${
              date.getMonth() + 1
            }`.padStart(2, 0)}-${`${date.getDate()}`.padStart(
              2,
              0
            )}T${`${new Date().getHours()}`.padStart(
              2,
              0
            )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
            isLoad: true
          });
        }
      } 
    }
  }

  componentDidMount() {
    if (this.state.selectedDocs.length === 0) this.addRow();
    this.setSelectedDate();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.modal !== this.props.modal){
      this.setSelectedDate();
    }
  }

  warning_modal = (e) => {
    this.setState((prevState) => ({
      warningModal: !prevState.warningModal,
    }));
  };

  checkAvailability = () => {
    const { actualdata, cases, activityTypes, events, frombtn, currentCase, calendarType } = this.props;
    const {
      Parent_Activity_Name,
      Tentative_date,
      Event_Time,
      Activity_type,
      Case_NAME
    } = this.state;
    const eventDate = actualdata;

    const Case = calendarType !== "home_calendar" ? currentCase : Case_NAME;
    const caseData = cases.find((x) => x.Case_Short_NAME === Case);

    const caseType = caseData !== undefined ? caseData.Case_Type : "DEFAULT";

    let date = new Date(Tentative_date);
    let actReq = null;
    let ParentActivityType = null;

    const ParentActivity = events.find(
      (x) => x.Activity_Name === Parent_Activity_Name
    );

    if (ParentActivity !== undefined) {
      ParentActivityType = ParentActivity.Activity_type;

      let parentDate = new Date(ParentActivity.Tentative_date);

      
      const Activity = activityTypes.find(
        (x) => x.Activity_type === ParentActivityType
      );
      if (Activity !== undefined) {
        actReq = Activity.Act_Requirements.find(
          (x) =>
            x.Case_Type === caseType && x.Child_Activity_type === Activity_type
        );
        
        if (actReq !== undefined) {
          const DAYS_BETWEEN =
            actReq.Calendar_type === "CALENDAR_DAYS"
              ? fn.countDays(
                  `${parentDate.getFullYear()}-${
                    parentDate.getMonth() + 1
                  }-${parentDate.getDate()}`,
                  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                )
              : fn.countWorkDays(
                  `${parentDate.getFullYear()}-${
                    parentDate.getMonth() + 1
                  }-${parentDate.getDate()}`,
                  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                );

          let Max_Days_after = actReq.Max_Days_after;
          let Max_Days_before = actReq.Max_Days_before;
          let Min_Days_after = actReq.Min_Days_after;
          let Min_Days_before = actReq.Min_days_before;

          //Compare dates
          if (ParentActivity.Tentative_date_stamp > Math.ceil(date.getTime() / 1000)) {
            if (Min_Days_before <= DAYS_BETWEEN && DAYS_BETWEEN <= Max_Days_before) {
              //date is between
            } else {
              // date is not between
              const startDate = new Date(parentDate.getTime() + Min_Days_before * 24 * 60 * 60 * 1000).toLocaleDateString("en-US");
              const endDate = new Date(parentDate.getTime() + Max_Days_before * 24 * 60 * 60 * 1000).toLocaleDateString("en-US");
              this.setState({
                checkActReq: {
                  startDate: startDate,
                  endDate: endDate
                }
              });
              setTimeout(() => this.warning_modal(), 0);
            }
          } else {
            if (Min_Days_after <= DAYS_BETWEEN && DAYS_BETWEEN <= Max_Days_after) {
              //date is between
            } else {
              const startDate = new Date(parentDate.getTime() + Min_Days_after * 24 * 60 * 60 * 1000).toLocaleDateString("en-US");
              const endDate = new Date(parentDate.getTime() + Max_Days_after * 24 * 60 * 60 * 1000).toLocaleDateString("en-US");
              this.setState({
                checkActReq: {
                  startDate: startDate,
                  endDate: endDate
                }
              });
              setTimeout(() => this.warning_modal(), 0);
            }
          }
        }
        // console.groupEnd()
      }
    }
  };

  onSelectChange = (el, e) => {
    let p = this.state.selectedDocs;
    switch (e.name) {
      case "document":
        p[e.name]["DOC_ID"] = el.value;
        this.setState({ selectedDocs: p });
        break;

      case "rTypes":
        p[e.name]["Relation_type"] = el.value;
        this.setState({ selectedDocs: p });
        break;

      case "Parent_Activity_Name":
        if (e.action === "clear") {
          this.setState({ [e.name]: null, Parent_Activity_type: null });
        } else {
          const aType = this.props.events.find(
            (x) => x.Activity_Name === el.value
          );

          if (aType !== undefined) {
            this.setState({ Parent_Activity_type: aType.Activity_type });
          }
          this.setState({ [el.name]: el.value });

          setTimeout(() => this.checkAvailability(), 100);
        }

        break;

      case "Case":
        const { cases } = this.props;
        let curCase;
        if (e.action === "clear") {
          this.setState({ Case_NAME: undefined });
        } else {
          curCase = cases.find((x) => x.Case_Short_NAME === el.value);
          this.setState({
            Case_NAME: el.value,
            bg: curCase.CaseBg,
            caseType: curCase.Case_Type,
          });
        }

        break;

      default:
        this.setState({ [el.name]: el.value });
        setTimeout(() => this.checkAvailability(), 100);
        break;
    }
  };

  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });

    console.log(name)
    if(name == "Tentative_date")
      setTimeout(() => this.checkAvailability(), 100);
  };

  addEvent = async () => {
    const eventDate = this.props.actualdata;
    let data;
    if (this.props.frombtn === true) {
      data = new Date(this.state.Tentative_date).getTime();
    } else {
      data = new Date(`${eventDate}T${this.state.Event_Time}`).getTime();
    }
    noteWindow.loading("Please wait," + `/n` + "we're creating an event ..." )

    const result = axios
      .post("/api/event/add", {
        Case_NAME: this.state.Case_NAME,
        Activity_Name: this.state.Activity_Name,
        Activity_type: this.state.Activity_type,
        Owner: this.state.Owner,
        Comments: this.state.Comments,
        Tentative_Calendar_name: this.state.Tentative_Calendar_name,
        Tentative_date: data.toString().slice(0, -3),
        Parent_Activity_Name: this.state.Parent_Activity_Name,
        Parent_Activity_type: this.state.Parent_Activity_type,
        Time_estimate_days: this.state.Time_estimate_days,
        Responsible_Person_id: this.props.personeData.Person_id,
        docs: this.state.selectedDocs,
        ADD_ALERT: this.state.notify,
      })
      .then((response) => {
        if (response.data.result) {
          noteWindow.isSuck("Event Added!");
          this.clearField();
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
      noteWindow.clear()
      this.props.onGlobalLoad();
    }
    this.props.switch_modal();
  };

  handleTableChange = (e) => {
    const rID = e.currentTarget.getAttribute("row");
    const { name, value } = e.currentTarget;
    let p = this.state.selectedDocs;
    p[rID][name] = value;
    this.setState({ selectedDocs: p });
  };

  addRow() {
    const docs = this.state.selectedDocs;
    docs.push({
      DOC_ID: "",
      Relation_type: "",
    });
    this.setState({ selectedDocs: docs });
  }

  deleteRow(e) {
    const delRow = e.currentTarget.getAttribute("row");
    this.state.selectedDocs.splice(delRow, 1);
    let state = this.state.selectedDocs.map((st) => st);
    this.setState({ selectedDocs: state });
  }

  clearField() {
    this.setState({
      Activity_Name: "",
      Activity_type: "",
      Owner: "",
      Comments: "",
      Tentative_Calendar_name: "",
      Parent_Activity_Name: "",
      Parent_Activity_type: "",
      Time_estimate_days: "",
    });
  }

  render() {
    const { actualdata, cases, activityTypes, events } = this.props;
    const { caseType, Parent_Activity_Name, checkActReq, isLoad } = this.state;

    if(!isLoad) return null;

    const caseToSelect = cases.filter((y)=> y.visible !== false).map((x) => ({
      name: "Case",
      value: x.Case_Short_NAME,
      label: x.Case_Full_NAME,
    }));

    const ativityType = activityTypes.filter((y)=> y.visible !== false).map((o) => ({
      name: "Activity_type",
      value: o.Activity_type,
      label: o.Description,
    }));

    const owner = [
      { name: "Owner", value: "OFFICE", label: "Office" },
      { name: "Owner", value: "OPPOSITE", label: "Opposite" },
    ];

    const pan = events
      .filter((x) => x.Case_NAME === this.state.Case_NAME)
      .map((o) => ({
        name: "Parent_Activity_Name",
        value: o.Activity_Name,
        label: o.Activity_Title,
      }));

    const rTypes = this.props.reltype.map((x) => ({
      name: "rTypes",
      value: x.RELATION_TYPE,
      label: x.DESCRIPTION,
    }));
    let documents = [];
    let CCase = [];

    const Case_NAME =
      this.props.calendarType !== "home_calendar"
        ? this.props.currentCase
        : this.state.Case_NAME;
    if (Case_NAME !== undefined) {
      CCase = cases.find((x) => x.Case_Short_NAME === Case_NAME).Case_Documents;
      documents = CCase.map((x) => ({
        name: "document",
        value: x.DOC_ID,
        label: x.DOCUMENT_NAME,
      }));
    }
    let FullCaseName = "";
    if (this.props.calendarType !== "home_calendar") {
      FullCaseName = cases.find(
        (x) => x.Case_Short_NAME === this.state.Case_NAME
      ).Case_Full_NAME;
    }

    return (
      <>
        <Modal
          size="xl"
          isOpen={this.props.modal}
          switch={this.props.switch_modal}
          centered={true}
          style={{ boxShadow: ` 0px 0px 15px 1px ${this.state.bg}` }}
        >
          <ModalHeader toggle={this.props.switch_modal} className="text-center">
            Add New Event for {this.state.Tentative_date.split("T")[0]}
          </ModalHeader>

          <ModalBody>
            <AvForm>
              <Row>
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <FormGroup className="auth-form-group-custom mb-4">
                        <i className=" ri-hashtag auti-custom-input-icon"></i>
                        <Label htmlFor="username">Activity name</Label>
                        <AvField
                          name="Activity_Name"
                          // value={this.props.Activity_Name}
                          type="text"
                          className="form-control"
                          id="Activity_Name"
                          onChange={this.handleChange}
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "Please enter Activity Name",
                            },
                          }}
                          placeholder="Event Name"
                        />
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                {this.props.calendarType === "home_calendar" ? (
                  <>
                    <Col lg="12">
                      <Card>
                        <CardBody>
                          <FormGroup>
                            <Label>Attach event to case? </Label>
                            <div className="d-flex align-items-center">
                              <Label className="mr-2">No</Label>
                              <div
                                className="custom-control custom-switch mb-2 d-flex "
                                // dir="ltr"
                              >
                                <Input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="customSwitch1"
                                  defaultChecked
                                />
                                <Label
                                  className="custom-control-label"
                                  htmlFor="customSwitch1"
                                  onClick={(e) => {
                                    this.setState({
                                      toggleSwitch: !this.state.toggleSwitch,
                                    });
                                  }}
                                >
                                  Yes
                                </Label>
                              </div>
                            </div>
                          </FormGroup>

                          {this.state.toggleSwitch === true && (
                            <>
                              <FormGroup>
                                <Label>Select Case</Label>
                                <Select
                                  options={caseToSelect}
                                  name="Case"
                                  onChange={this.onSelectChange}
                                  isClearable={true}
                                />
                              </FormGroup>
                            </>
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col lg={12}>
                      <Card>
                        <CardBody>
                          <FormGroup>
                            <Label>Add event to Case</Label>
                            <Input type="text" disabled value={FullCaseName} />
                          </FormGroup>
                        </CardBody>
                      </Card>
                    </Col>
                  </>
                )}
                <Col lg={6}>
                  <Card>
                    <CardBody>
                      <Label htmlFor="">Activity type</Label>
                      <Select
                        options={ativityType}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.onSelectChange}
                        value={ativityType.find(
                          (x) => x.value === this.props.Activity_type
                        )}
                      />
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card>
                    <CardBody>
                      <Label htmlFor="">Owner</Label>
                      <Select
                        // attr-case-name={this.props.caseName}
                        options={owner}
                        // defaultValue = {options[0]}
                        className="basic-multi-select"
                        name="Owner"
                        classNamePrefix="select"
                        onChange={this.onSelectChange}
                        value={owner.find((x) => x.value === this.props.Owner)}
                      />
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <FormGroup className="mb-4 mt-2">
                        <Label htmlFor="billing-address">Comments</Label>
                        <textarea
                          className="form-control custom-textarea"
                          id="billing-address"
                          rows="3"
                          name="Comments"
                          value={this.Comments}
                          placeholder="Enter Comments"
                          onChange={this.handleChange}
                        ></textarea>
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card>
                    <CardBody>
                      <FormGroup className="mb-4 mt-2">
                        <FormGroup>
                          <Label htmlFor="example-time-input">Event Time</Label>
                          <AvField
                                name="Tentative_date"
                                value={this.state.Tentative_date}
                                type="datetime-local"
                                id="Tentative_date"
                                onChange={this.handleChange}
                                placeholder="Event Name"
                              />
                          {/* {this.props.frombtn === true ? (
                            <>
                             
                            </>
                          ) : (
                            <>
                              <Input
                                className="form-control"
                                type="time"
                                defaultValue={`${`${new Date().getHours()}`.padStart(
                                  2,
                                  0
                                )}:${`${new Date().getMinutes()}`.padStart(
                                  2,
                                  0
                                )}:00`}
                                id="example-time-input"
                                name="Event_Time"
                                onChange={this.handleChange}
                              />
                            </>
                          )} */}
                        </FormGroup>
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={6}>
                  <Card>
                    <CardBody>
                      <FormGroup className="mb-4 mt-2">
                        <Label htmlFor="Time_estimate_days">
                          Time estimate days
                        </Label>
                        <AvField
                          name="Time_estimate_days"
                          value={this.Time_estimate_days}
                          type="number"
                          className="form-control"
                          id="case_namber"
                          onChange={this.handleChange}
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "Please enter estimate days",
                            },
                          }}
                          placeholder="Time estimate days"
                        />
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <FormGroup className="mb-4 mt-2">
                        <Label htmlFor=""> Parent Activity Name</Label>
                        <Select
                          options={pan}
                          className="basic-multi-select"
                          name="Parent_Activity_Name"
                          classNamePrefix="select"
                          onChange={this.onSelectChange}
                          isClearable={true}
                          // noOptionsMessage={"Please Select Case"}
                          value={pan.find(
                            (x) => x.value === this.props.Parent_Activity_Name
                          )}
                        />
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <FormGroup>
                        <Label>Notify you about this activity ? </Label>
                        <div className="d-flex align-items-center">
                          <Label className="mr-2">No</Label>
                          <div
                            className="custom-control custom-switch mb-2 d-flex "
                            // dir="ltr"
                          >
                            <Input
                              type="checkbox"
                              className="custom-control-input"
                              id="customSwitch3"
                              defaultChecked
                            />
                            <Label
                              className="custom-control-label"
                              htmlFor="customSwitch3"
                              onClick={(e) => {
                                this.setState({
                                  notify: !this.state.notify,
                                });
                              }}
                            >
                              Yes
                            </Label>
                          </div>
                        </div>
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                {this.state.toggleSwitch === true && (
                  <>
                    <Col lg="12">
                      <Card>
                        <CardBody>
                          <FormGroup>
                            <Label>Attach documents to case? </Label>
                            <div className="d-flex align-items-center">
                              <Label className="mr-2">No</Label>
                              <div
                                className="custom-control custom-switch mb-2 d-flex "
                                // dir="ltr"
                              >
                                <Input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="customSwitch2"
                                  // defaultChecked = {}
                                />
                                <Label
                                  className="custom-control-label"
                                  htmlFor="customSwitch2"
                                  onClick={(e) => {
                                    this.setState({
                                      toggleDocs: !this.state.toggleDocs,
                                    });
                                  }}
                                >
                                  Yes
                                </Label>
                              </div>
                            </div>
                          </FormGroup>

                          {this.state.toggleDocs === true && (
                            <>
                              <FormGroup>
                                <Label>Select Documents</Label>
                                <div className="table-responsive mb-5">
                                  {documents.length <= 0 ? (
                                    <>
                                      <div className="bg-gray">
                                        <h5>
                                          Documents list is empty. Please select
                                          some Case, or add any document to Case
                                        </h5>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <Table className="mb-0 table-sm custom-table" >
                                        <thead>
                                          <tr>
                                          <th className="text-center small-w"><i class="ri-close-line font-size-16"></i></th>
                                            <th>Document</th>
                                            <th>Relation type</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {this.state.selectedDocs.map(
                                            (item, index) => (
                                              <tr key={index} id={`id${index}`}>
                                                <td className="text-center ">
                                                  <Button
                                                    row={index}
                                                    onClick={
                                                      this.props.deleteRow
                                                    }
                                                    color="light"
                                                    type="button"
                                                  >
                                                    <i className="ri-close-line font-size-16"></i>
                                                  </Button>
                                                </td>

                                                <td>
                                                  <Select
                                                    options={documents}
                                                    name={index}
                                                    className="basic-multi-select posrel"
                                                    classNamePrefix="select"
                                                    menuPosition="relative"
                                                    menuPlacement="top"
                                                    onChange={
                                                      this.onSelectChange
                                                    }
                                                    value={documents.find(
                                                      (x) =>
                                                        x.value ===
                                                        this.state.selectedDocs[
                                                          index
                                                        ]["DOC_ID"]
                                                    )}
                                                  />
                                                </td>
                                                <td>
                                                  <Select
                                                    options={rTypes}
                                                    name={index}
                                                    menuPosition="relative"
                                                    menuPlacement="top"
                                                    className="basic-multi-select posrel"
                                                    classNamePrefix="select"
                                                    onChange={
                                                      this.onSelectChange
                                                    }
                                                    value={rTypes.find(
                                                      (x) =>
                                                        x.value ===
                                                        this.state.selectedDocs[
                                                          index
                                                        ]["Relation_type"]
                                                    )}
                                                  />
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                        <Button
                                          color="success"
                                          onClick={this.addRow}
                                          className="mt-3 ml-1"
                                        >
                                          {" "}
                                          Add more{" "}
                                        </Button>
                                      </Table>
                                    </>
                                  )}
                                </div>
                              </FormGroup>
                            </>
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  </>
                )}
              </Row>
              <Button
                onClick={this.addEvent}
                className="posAButton"
                color="success"
              >
                Add <br /> Event
              </Button>
            </AvForm>
          </ModalBody>

          <ModalFooter>
            <Button onClick={this.props.switch_modal} color="danger">
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.warningModal}
          switch={this.warning_modal}
          centered={true}
          size="l"
          className="warning_modal"
        >
          <ModalHeader toggle={this.warning_modal} className="text-center">
            Warning!!!
          </ModalHeader>
          <ModalBody toggle={this.warning_modal}>
       
              <p>
                We do not recommend creating an event of this type on the day of your
                choice. Since there are restrictions indicated in the setting of
                Activity types.
              </p>
                 <p>
                 It would be better to create an event in this 
                <br/>
                <span className="time_interval">
                  {checkActReq.startDate} - {checkActReq.endDate}
                 </span> {""} interval of days.
                 </p>
               
          </ModalBody>
             
               
            
          <ModalFooter>
            <Button onClick={this.warning_modal} color="success">
              OK
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    global: state.User.globalData,
    cases: state.User.caseData.cases,
    personeData: state.User.persone,
    activityTypes: state.User.activityTypes,
    events: state.User.AllEvents,
    reltype: state.User.relationType,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEventFromCalendar);
