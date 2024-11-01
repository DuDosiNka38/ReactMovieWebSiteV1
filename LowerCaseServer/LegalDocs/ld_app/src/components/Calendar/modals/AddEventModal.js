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
// import * as actions from "./../../store/user/actions";
// import axios from "./../../services/axios";
import notification from "./../../../services/notification";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Select from "react-select";
import fn from "./../services/functions";
import { connect } from "react-redux";
import * as ModalActions from "./../../../store/modal/actions";
import * as PreloaderActions from "./../../../store/preloader/actions";
import Textarea from "./../../../components/FormComponents/Textarea/Textarea";
import CaseApi from "./../../../api/CaseApi";
import EventsApi from "./../../../api/EventsApi";
import * as CaseActions from "./../../../store/case/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "../Calendar";
import CalendarSelectDocs from ".././CalendarSelectDocs";
import AddEventSuccModal from "./AddEventSuccModal";
import { filterObj } from "../../../services/Functions";

class AddEvenModal extends Component {
  state = {
    CaseData: [],
    ActivityTypes: [],
    warningModal: false,
    toggleSwitch: true,
    toggleDocs: false,
    selectedDocs: [],
    parentActivities: [],
    Activity_Name: null,
    Activity_type: null,
    Owner: null,
    Comments: null,
    Tentative_Calendar_name: "DEFAULT_CALENDAR",
    Tentative_date: null,
    Parent_Activity_Name: null,
    Parent_Activity_type: null,
    Time_estimate_days: null,
    Responsible_Person_id: null,
    Responsible_person_Role: null,
    selectedDocs: [],
    notify: true,
    caseType: null,
    pActName: null,
    checkActReq: {
      startDate: null,
      endDate: null,
    },
    isLoad: false,
    counter: 0,
    Case_NAME: null,
    ActivityRequirements: [],
  };

  setActualData = () => {
    const { selectedDate } = this.props;
    this.setState({
      Tentative_date: selectedDate ? new Date(selectedDate) : new Date(),
    });
  };

  handleSelectChange = (el, e) => {
    const { value } = el;
    const { name } = e;
    this.setState({ [name]: value });

    if (name === "Case_NAME") {
      this.setCaseActivities(value);
    }

    if (name === "Parent_Activity_Name") {
      const { parentActivities } = this.state;
      const parent = parentActivities.find((x) => x.Activity_Name === value);
      this.setState({
        Parent_Activity_type: parent.Activity_type,
        Parent_Tentative_date: parent.Tentative_date,
      });
    }

    setTimeout(this.checkAvailability, 1);
  };

  handleDateChange = (e, name) => {
    this.setState({ [name]: new Date(e) });
    setTimeout(this.checkAvailability, 1);
  };

  handleInputChange = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  checkAvailability = () => {
    const { showModal } = this.props;
    const {
      CaseData,
      Case_NAME,
      Activity_type,
      Parent_Activity_type,
      Tentative_date,
      Parent_Tentative_date,
      ActivityRequirements,
    } = this.state;

    const SelectedCase = CaseData.find((x) => x.Case_Short_NAME === Case_NAME);

    if (!SelectedCase) return;
    if (!Parent_Activity_type) return;
    if (!Parent_Tentative_date) return;
    if (!Activity_type) return;
    if (!Tentative_date) return;

    const actReq = ActivityRequirements.find(
      (x) =>
        x.Child_Activity_type === Activity_type &&
        x.Parent_Activity_type === Parent_Activity_type &&
        x.Case_Type === SelectedCase.Case_Type
    );

    if (!actReq) return;

    const parentDate = new Date(Parent_Tentative_date);
    const childDate = new Date(Tentative_date);

    const DAYS_BETWEEN =
      actReq.Calendar_type === "CALENDAR_DAYS"
        ? fn.countDays(
            `${parentDate.getFullYear()}-${
              parentDate.getMonth() + 1
            }-${parentDate.getDate()}`,
            `${childDate.getFullYear()}-${
              childDate.getMonth() + 1
            }-${childDate.getDate()}`
          )
        : fn.countWorkDays(
            `${parentDate.getFullYear()}-${
              parentDate.getMonth() + 1
            }-${parentDate.getDate()}`,
            `${childDate.getFullYear()}-${
              childDate.getMonth() + 1
            }-${childDate.getDate()}`
          );

    let Max_Days_after = actReq.Max_Days_after;
    let Max_Days_before = actReq.Max_Days_before;
    let Min_Days_after = actReq.Min_Days_after;
    let Min_Days_before = actReq.Min_days_before;

    let showInfoModal = false;
    const args = {
      startDate: null,
      endDate: null,
    };

    if (parentDate.getTime() > childDate.getTime()) {
      if (Min_Days_before <= DAYS_BETWEEN && DAYS_BETWEEN <= Max_Days_before) {
        //date is between
      } else {
        // date is not between
        args.startDate = new Date(
          parentDate.getTime() + Min_Days_before * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-US");
        args.endDate = new Date(
          parentDate.getTime() + Max_Days_before * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-US");

        showInfoModal = true;
      }
    } else {
      if (Min_Days_after <= DAYS_BETWEEN && DAYS_BETWEEN <= Max_Days_after) {
        //date is between
      } else {
        args.startDate = new Date(
          parentDate.getTime() + Min_Days_after * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-US");
        args.endDate = new Date(
          parentDate.getTime() + Max_Days_after * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-US");
        showInfoModal = true;
      }
    }

    if (showInfoModal) showModal("CHECK_AVAILABILITY", { ...args });
  };

  setCaseActivities = async (Case_NAME) => {
    const parentActivities = await EventsApi.fetchCaseEvents(Case_NAME).then(
      (r) => r
    );

    this.setState({
      parentActivitiesOpt: parentActivities.map((x) => ({
        value: x.Activity_Name,
        label: x.Activity_Title,
      })),
      parentActivities,
    });
  };

  checkDays = () => {
    const thisMoment = Date.now();
    const EstD = this.state.Time_estimate_days * 24 * 60 * 60 * 1000;
    const EventTime = Date.parse(this.state.Tentative_date);
    const startNotify = EventTime - EstD;
    const isAvailable = thisMoment <= startNotify;
    // console.group();
    // console.log("now", thisMoment);
    // console.log("estimate", EstD);
    // console.log("event Time", EventTime);
    // console.log("ddd", thisMoment, startNotify, thisMoment <= startNotify);
    // console.groupEnd();
    return isAvailable;
  };


  addEvent = async () => {
    
    const { Preloader, onSuccess } = this.props;
    Preloader.show();

    const postData = {
      Case_NAME: this.state.Case_NAME,
      Activity_Name: this.state.Activity_Name,      
      Activity_type: this.state.Activity_type,
      Owner: this.state.Owner,
      Comments: this.state.Comments,
      Tentative_date: `${this.state.Tentative_date.getFullYear()}-${`${
        this.state.Tentative_date.getMonth() + 1
      }`.padStart(2, 0)}-${`${this.state.Tentative_date.getDate()}`.padStart(
        2,
        0
      )}T${`${this.state.Tentative_date.getHours()}`.padStart(
        2,
        0
      )}:${`${this.state.Tentative_date.getMinutes()}`.padStart(2, 0)}`,
      
      Time_estimate_days: this.state.Time_estimate_days,
      Responsible_Person_id: this.state.Responsible_Person_id,
    };

    let isValid = true;

    console.group("Check fields:");
    filterObj(postData, (v, i) => {
      const rules = ["", null, undefined];
      if(rules.includes(v)) {
        console.log({Field: i, Value: v});
        isValid = false;
      }
    })
    console.groupEnd();

    if(!isValid) {
      Preloader.hide();
      notification.isError("Form has empty fields!");
      return;
    }

    postData.Activity_Title = this.state.Activity_Title;
    postData.Parent_Activity_Name = this.state.Parent_Activity_Name;
    postData.Parent_Activity_type = this.state.Parent_Activity_type;

    const res = await EventsApi.postEvent(postData);

    if (!res.result) {
      notification.isError(res.data.error_message);
      Preloader.hide();
      return false;
    }
    notification.isSuck("Event successfully created");
    this.props.hideModal(this.props.type);
    this.props.showModal("ADD_EVENT_SUCC", {
      Case_NAME: this.state.Case_NAME,
      Activity_Name: this.state.Activity_Name,
    });

    if (onSuccess && typeof onSuccess === "function") {
      onSuccess();
    }

    Preloader.hide();
  };
  checkEvent = () => {
    if(!this.checkDays()) {
      this.props.showModal("ESTIMATE_WARNING",{addEvent: this.addEvent} )
    } 
    else {
      this.addEvent()
    }
  }
  componentDidMount = async () => {
    const { Person_id } = this.props.user;
    const { Preloader } = this.props;

    Preloader.show();

    if (this.props.Case_NAME) {
      this.setState({ Case_NAME: this.props.Case_NAME });

      if (this.props.Parent_Activity) {
        const { Parent_Activity } = this.props;
        this.setState({
          parentActivitiesOpt: [
            {
              value: Parent_Activity.Activity_Name,
              label: Parent_Activity.Activity_Title,
            },
          ],
        });
      } else {
        this.setCaseActivities(this.props.Case_NAME);
      }
    }

    const CaseData = await CaseApi.fetchUserCases(Person_id);
    const ActivityTypes = await EventsApi.fetchActivityTypes();
    const ActivityRequirements = await EventsApi.fetchActivityRequirements();

    this.setState({ CaseData, ActivityTypes, ActivityRequirements, Responsible_Person_id: Person_id });
    this.setActualData();

    this.props.fetchCaseSides();

    Preloader.hide();
  };

  render() {
    const { selectedDate, caseSides, Parent_Activity } = this.props;
    const { CaseData, ActivityTypes, parentActivitiesOpt, checkActReq } =
      this.state;

    return (
      <>
        <Modal
          size="xl"
          isOpen={true}
          scrollable
          switch={this.props.hideModal}
          centered={true}
          style={{
            boxShadow: ` 0px 0px 15px 1px ${this.state.bg}`,
            width: "800px",
          }}
        >
          <ModalHeader toggle={this.props.hideModal} className="text-center">
            Add New Event for{" "}
            {new Date(this.state.Tentative_date).toLocaleString()}
          </ModalHeader>

          <ModalBody toggle={this.props.hideModal}>
            <AvForm>
              <Row>
                <Col lg={12}>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i className=" ri-hashtag auti-custom-input-icon"></i>
                    <Label htmlFor="username">Activity name</Label>
                    <AvField
                      name="Activity_Name"
                      // value={this.props.Activity_Name}
                      type="text"
                      className="form-control"
                      id="Activity_Name"
                      onChange={this.handleInputChange}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: "Please enter Activity Name",
                        },
                      }}
                      placeholder="Event Name"
                    />
                  </FormGroup>
                </Col>

                <Col lg="12">
                  

                  {this.state.toggleSwitch === true && (
                    <>
                      <FormGroup>
                        <Label>Select Case</Label>
                        <Select
                          name="Case_NAME"
                          options={CaseData.map((x) => ({
                            label: x.Case_Full_NAME,
                            value: x.Case_Short_NAME,
                          }))}
                          defaultValue={{
                            label: this.props.Case_Full_NAME,
                            value: this.props.Case_NAME,
                          }}
                          isDisabled={this.props.Case_Full_NAME && "true"}
                          onChange={this.handleSelectChange}
                          isClearable={true}
                        />
                      </FormGroup>
                    </>
                  )}
                </Col>

                <Col lg={6}>
                  <Label htmlFor="">Activity type</Label>
                  <Select
                    options={ActivityTypes.map((x) => ({
                      label: x.Description,
                      value: x.Activity_type,
                    }))}
                    name="Activity_type"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={this.handleSelectChange}
                    // value={ativityType.find(
                    //   (x) => x.value === this.props.Activity_type
                    // )}
                  />
                </Col>

                <Col lg={6}>
                  <Label htmlFor="">Owner</Label>
                  <Select
                    // attr-case-name={this.props.caseName}
                    options={caseSides.map((x) => ({
                      label: x.Description,
                      value: x.Side,
                    }))}
                    // defaultValue = {caseSides[0]}
                    className="basic-multi-select"
                    name="Owner"
                    classNamePrefix="select"
                    onChange={this.handleSelectChange}
                    // value={owner.find((x) => x.value === this.props.Owner)}
                  />
                </Col>
                <Col lg={12}>
                  <FormGroup className="mb-4 form-textarea">
                    <Textarea
                      maxLen={500}
                      label="Comments"
                      rows="3"
                      name="Comments"
                      value={this.Comments}
                      placeholder=" Few words about this event"
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </Col>

                <Col lg={6}>
                  <FormGroup className="mb-4 mt-2 datepicker-form">
                    <FormGroup>
                      <Label htmlFor="example-time-input">Event Time</Label>
                      <div className="position-relative">
                        <i class="ri-calendar-2-line"></i>
                        <DatePicker
                          selected={this.state.Tentative_date}
                          onChange={(e) =>
                            this.handleDateChange(e, "Tentative_date")
                          } //only when value has changed
                          dateFormat="MMMM d, yyyy h:mm aa"
                          showTimeSelect
                          timeFormat="p"
                          timeIntervals={15}
                          name="Tentative_date"
                        />
                      </div>
                    </FormGroup>
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup className="mb-4 mt-2">
                    <Label htmlFor="Time_estimate_days">
                    Prepare time estimate (days)
                    </Label>
                    <AvField
                      name="Time_estimate_days"
                      value={this.Time_estimate_days}
                      type="number"
                      className="form-control"
                      id="case_namber"
                      onChange={this.handleInputChange}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: "Please enter estimate days",
                        },
                      }}
                      placeholder="Time estimate days"
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup className="mb-4 mt-2">
                    <Label htmlFor=""> Parent Activity Name</Label>
                    <Select
                      options={parentActivitiesOpt}
                      className="basic-multi-select"
                      name="Parent_Activity_Name"
                      classNamePrefix="select"
                      onChange={this.handleSelectChange}
                      isClearable={true}
                      defaultValue={null}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label>Notify you about this activity ? </Label>
                    <div className="d-flex align-items-center">
                      <Label className="mr-2">No</Label>
                      <div className="custom-control custom-switch mb-2 d-flex ">
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
                </Col>
              </Row>
            </AvForm>
          </ModalBody>

          <ModalFooter className="mfooterGT">
            <Button onClick={this.checkEvent} className="ld-button-success">
              Add
            </Button>
            <Button onClick={this.props.hideModal} className="ld-button-danger">
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    caseSides: state.Case.caseSides,
    cases: state.Case.cases,
    display: state.Modal.display,
    cases: state.Case.cases,
    user: state.User.data,
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchCaseSides: () => dispatch(CaseActions.caseSidesFetchRequested()),
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("ADD_EVENT")),
    hide: () => dispatch(PreloaderActions.hidePreloader("ADD_EVENT")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEvenModal);
