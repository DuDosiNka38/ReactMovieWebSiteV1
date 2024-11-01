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

import notification from "../../../services/notification";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Select from "react-select";
import fn from "../services/functions";
import { connect } from "react-redux";
import * as ModalActions from "../../../store/modal/actions";
import * as PreloaderActions from "../../../store/preloader/actions";
import Textarea from "../../FormComponents/Textarea/Textarea";
import CaseApi from "../../../api/CaseApi";
import EventsApi from "../../../api/EventsApi";
import * as CaseActions from "../../../store/case/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { filterObj } from "../../../services/Functions";



class AddChildEvent extends Component {
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
    // Event_Time: `${`${new Date().getHours()}`.padStart(
    //   2,
    //   0
    // )}:${`${new Date().getMinutes()}`.padStart(2, 0)}:00`,
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
  };
  
  setEventData = async () => {

    const eventData = await EventsApi.fetchEvent(
      this.props.Activity_Name
    );
    this.setState({ ...eventData, });
  }; 

  handleSelectChange = (el, e) => {
    const { value } = el;
    const { name } = e;
    this.setState({ [name]: value });

    if (name === "Case_NAME") {
      this.setCaseActivities(value);
    }
  };

  handleDateChange = (e, name) => {
    this.setState({ [name]: new Date(e) });
  };

  handleInputChange = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  setCaseActivities = async (Case_NAME) => {
    const parentActivities = await EventsApi.fetchCaseEvents(Case_NAME).then(
      (r) => r
    );

    this.setState({
      parentActivities: parentActivities.map((x) => ({
        value: x.Activity_Name,
        label: x.Activity_Title,
      })),
    });
  };

  componentDidMount = async () => {
    const { Person_id } = this.props.user;

    this.setEventData();

    this.props.fetchCaseSides();

    const CaseData = await CaseApi.fetchUserCases(Person_id);
    this.setState({ CaseData });
    const ActivityTypes = await EventsApi.fetchActivityTypes();
    this.setState({ ActivityTypes });
    this.setCaseActivities(this.state.Case_NAME);
    await this.setState({Parent_Activity_Name: this.props.Activity_Name })
  };

  addEvent = async () => {
    const { Preloader, onSuccess } = this.props;
    Preloader.show();

    const Tentative_date = new Date(this.state.Tentative_date);

    const postData = {
      Case_NAME: this.state.Case_NAME,
      Activity_Name: this.state.Activity_Name,
      Activity_Title: this.state.Activity_Title,
      Activity_type: this.state.Activity_type,
      Owner: this.state.Owner,
      Comments: this.state.Comments,
      Tentative_date: `${Tentative_date.getFullYear()}-${`${
        Tentative_date.getMonth() + 1
      }`.padStart(2, 0)}-${`${Tentative_date.getDate()}`.padStart(
        2,
        0
      )}T${`${Tentative_date.getHours()}`.padStart(
        2,
        0
      )}:${`${Tentative_date.getMinutes()}`.padStart(2, 0)}`,
      Parent_Activity_Name: this.state.Parent_Activity_Name,
      Parent_Activity_type: this.state.Parent_Activity_type,
      Time_estimate_days: this.state.Time_estimate_days,
      Responsible_Person_id: this.state.Responsible_Person_id,
    };

    let isValid = true;

    filterObj(postData, (v, i) => {
      const rules = ["", null, undefined];
      if(rules.includes(v)) isValid = false;
    })

    if(!isValid) {
      Preloader.hide();
      notification.isError("Form has empty fields!");
      return;
    }

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
      Activity_Name: this.state.Activity_Name
    });

    if(onSuccess && typeof onSuccess === "function"){
      onSuccess();
    }

    Preloader.hide();
  };

  render() {
    const { caseSides, Parent_Activity } = this.props;
    const { CaseData, ActivityTypes, Comments, parentActivities, Tentative_date, Activity_Name, Activity_Title, Parent_Activity_Name, Case_Full_NAME, Case_NAME, Activity_type, Time_estimate_days, Owner} = this.state;
    
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
            Edit Child Event to  {Activity_Title}
          </ModalHeader>

          <ModalBody>
            <AvForm>
              <Row>
                <Col lg={12}>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i className=" ri-hashtag auti-custom-input-icon"></i>
                    <Label htmlFor="username">Activity name</Label>
                    <AvField
                      name="Activity_Name"
                      // value={Activity_Name}
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
                          value={{
                            label: Case_Full_NAME,
                            value: Case_NAME,
                          }}
                          isDisabled="false"
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
                  
                    className="basic-multi-select"
                    name="Owner"
                    classNamePrefix="select"
                    onChange={this.handleSelectChange}
                  />
                </Col>
                <Col lg={12}>
                  <FormGroup className="mb-4 form-textarea">
                    <Textarea
                      maxLen={500}
                      label="Comments"
                      rows="3"
                      name="Comments"
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
                          selected={new Date(this.state.Tentative_date)}
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
                      Time estimate days
                    </Label>
                    <AvField
                      name="Time_estimate_days"
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
                      options={parentActivities}
                      className="basic-multi-select"
                      name="Parent_Activity_Name"
                      classNamePrefix="select"
                      onChange={this.handleSelectChange}
                      isClearable={true}
                      isDisabled={true}
                      value={parentActivities.map((x) => ({
                        label: x.label,
                        value: x.value,
                      })).find((x) => x.value === Parent_Activity_Name)}
  
                      
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label>Notify you about this activity ? </Label>
                    <div className="d-flex align-items-center">
                      <Label className="mr-2">No</Label>
                      <div
                        className="custom-control custom-switch mb-2 d-flex "
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
                </Col>
               
              </Row>
            </AvForm>
          </ModalBody>

          <ModalFooter className= "mfooterGT">
            <Button onClick={this.addEvent} className="ld-button-success">
              Submit
            </Button>
            <Button
              onClick={this.props.hideModal}
              className="ld-button-danger"
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* <Modal
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
              We do not recommend creating an event of this type on the day of
              your choice. Since there are restrictions indicated in the setting
              of Activity types.
            </p>
            <p>
              It would be better to create an event in this
              <br />
              <span className="time_interval">
                {checkActReq.startDate} - {checkActReq.endDate}
              </span>{" "}
              {""} interval of days.
            </p>
          </ModalBody>

          <ModalFooter>
            <Button onClick={this.warning_modal} color="success">
              OK
            </Button>
          </ModalFooter>
        </Modal> */}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    caseSides: state.Case.caseSides,
    cases: state.Case.cases,
    display: state.Modal.display,
    cases: state.Case.cases,
    user: state.User.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchCaseSides: () => dispatch(CaseActions.caseSidesFetchRequested()),
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("ADD_CHILD_EVENT")),
    hide: () => dispatch(PreloaderActions.hidePreloader("ADD_CHILD_EVENT"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddChildEvent);
