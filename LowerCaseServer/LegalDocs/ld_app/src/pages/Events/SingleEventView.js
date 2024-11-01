import React, { Component } from "react";
import PageHeader from "../../components/PageHader/PageHeader";
import { connect } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Media,
  Button,
  Input,
  CardHeader,
  FormGroup,
  Label,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "reactstrap";
import EventsApi from "./../../api/EventsApi";
import AvCheckboxGroup from "availity-reactstrap-validation/lib/AvCheckboxGroup";
import AvCheckbox from "availity-reactstrap-validation/lib/AvCheckbox";
import notification from "../../services/notification";
import { AvForm } from "availity-reactstrap-validation";
import * as ModalActions from "../../store/modal/actions";
import Case from "../../store/case/reducer";
import { NavLink } from "react-router-dom";
import combine from "../../routes/combine";
import EventNotes from './EventNotes'
import EventLog from './EventLog'
import * as PreloaderActions from "../../store/preloader/actions";
import Icofont  from "react-icofont";

class SingleEventView extends Component {
  state = {
    // eventName:
    isMainChecked: false,
    EventDocuments: [],
    ChildEvents: [],
    isInit: false,
  };

  disattachDocument = async (DOC_ID) => {
    const { Activity_Name } = this.state;
    this.props.showModal("CONFIRM_DISATTACH", {
      onSubmit: async () => {
        const response = await EventsApi.deleteEventDocument(
          Activity_Name,
          DOC_ID
        );
        this.loadEventDocuments();
      },
    });
  };

  toggleOne = (e) => {
    let { chkBoxModel } = this.state;
    const { Cases, Case_Short_NAME, Personnel } = this.props;
    const { value, checked, name } = e.currentTarget;
    const Case = Cases.find((x) => x.Case_Short_NAME === Case_Short_NAME) || {};
    const Case_Participants = Case.Case_Participants || [];
    const availablePersons = Personnel.filter(
      (x) => !Case_Participants.map((y) => y.Person_id).includes(x.Person_id)
    );

    if (checked === false && chkBoxModel.indexOf(value) >= 0)
      chkBoxModel.splice(chkBoxModel.indexOf(value), 1);
    if (checked === true) chkBoxModel.push(value);
    this.setState({
      chkBoxModel: chkBoxModel,
      isMainChecked: chkBoxModel.length === availablePersons.length,
    });
  };

  toggleAll = (e) => {
    let { chkBoxModel } = this.state;
    const { Cases, Case_Short_NAME, Personnel } = this.props;
    const Case = Cases.find((x) => x.Case_Short_NAME === Case_Short_NAME) || {};
    const Case_Participants = Case.Case_Participants || [];
    const availablePersons = Personnel.filter(
      (x) => !Case_Participants.map((y) => y.Person_id).includes(x.Person_id)
    );
    const { checked } = e.currentTarget || e;
    chkBoxModel = [];
    if (checked === true) {
      availablePersons.map((x) => {
        chkBoxModel.push(x.Person_id);
      });
    }
    this.setState({ chkBoxModel: chkBoxModel, isMainChecked: checked });
  };

  getChildEvents = async () => {
    const CE = this.props.match.params.Activity_Name;
    const AllEvents = await EventsApi.fetchEvents();
    let ChildEvents = AllEvents.filter((x) => x.Parent_Activity_Name === CE);
    this.setState({ ChildEvents });
  };

  loadEvent = async () => {
    const eventData = await EventsApi.fetchEvent(
      this.props.match.params.Activity_Name
    );
    eventData.Parent_Activity_type = await this.getParrentType(eventData);
    this.setState({ ...eventData });
  }

  componentDidMount = async () => {
    await this.loadEvent();
    await this.loadEventDocuments();

    this.setState({ isInit: true });
    this.getChildEvents();
  };

  loadEventDocuments = async () => {
    const { Activity_Name } = this.props.match.params;
    const EventDocuments = await EventsApi.fetchEventDocuments(Activity_Name);

    this.setState({ EventDocuments });
  };

  getParrentType = async ({ Parent_Activity_Name, Case_NAME }) => {
    const events = await EventsApi.fetchCaseEvents(Case_NAME);
    const Event = events.find(
      (x) => x.Activity_Name === Parent_Activity_Name
    );
    // console.log(Event.Activity_type_Description );
    // return Event.Activity_type_Description ? Event.Activity_type_Description : null;
    if (Event) {
      return Event.Activity_type_Description ;
    }
    // else (console.log(2))
  };

  async componentDidUpdate(prevProps, prevState) {
    if(this.props.location.pathname !== prevProps.location.pathname){
      this.props.Preloader.show();
      await this.componentDidMount();
      this.props.Preloader.hide();
    }
  }

  render() {
    const { showModal } = this.props;
    const {
      Activity_Title,
      Activity_Name,
      Activity_type,
      Activity_type_Description,
      CaseBg,
      Case_NAME,
      Case_Full_NAME,
      Comments,
      Owner,
      Parent_Activity_Name,
      Parent_Activity_type,
      Responsible_Person_id,
      Tentative_Calendar_name,
      Tentative_date,
      Time_estimate_days,
      isMainChecked,
      EventDocuments,
      isInit,
      ChildEvents,
    } = this.state;
    // console.log(this.state);

    // if(ChildEvents.length < 0 ) return (<></>)
    return (
      <>
        <div className="page-content">
          <Container fluid>
            <PageHeader>
              <span
                style={{ color: CaseBg, fontWeight: "400", opacity: ".8" }}
                className="font-size-18"
              >
                Event:  {Activity_Name} / Case: {Case_Full_NAME}
              </span>
            </PageHeader>

            <Row>
              <Col lg={9}>
                <Card>
                  <CardHeader
                    className="d-flex align-items-center justify-content-between"
                    style={{ padding: "12px" }}
                  >
                    <div className="d-flex align-items-center AccentFont font-size-16">
                      Attached Documents
                    </div>

                    <div className="btns-block d-flex align-items-center">
                      <Button
                        className="d-flex align-items-center ld-button-info text-uppercase ml-2"
                        onClick={() =>
                          showModal("ADD_CHILD_EVENT", {
                            Activity_Name: this.props.match.params.Activity_Name,
                            eventTime: this.state.Tentative_date,
                            onSuccess: this.getChildEvents
                          })
                        }
                      >
                        <i className="ri-add-line mr-2"></i> Add Child Event
                      </Button>
                      <Button
                        className="d-flex align-items-center ld-button-warning text-uppercase ml-2"
                        onClick={() =>
                          this.props.showModal("ATTACH_DOCUMENT", {
                            Activity_Name,
                            Case_NAME,
                            Attached: EventDocuments.map((x) => x.DOC_ID),
                            onSuccess: this.loadEventDocuments,
                          })
                        }
                      >
                        <i className="ri-add-line mr-2"></i> Attach
                      </Button>
                      <Button
                        className="d-flex align-items-center ld-button-success text-uppercase ml-2"
                        onClick={() => this.props.showModal(null)}
                      >
                        <i className="ri-file-upload-line mr-2"></i> Prepare To
                        Event
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                    <AvForm className="mb-0">
                      <AvCheckboxGroup name="existingPersons" className="mb-0">
                        <Table className="customTable mb-0">
                          <thead>
                            <tr>
                              {/* <td>
                                <AvCheckbox customInput onChange={this.toggleAll} checked={isMainChecked} />
                              </td> */}
                              <td></td>
                              <td>Document Name</td>
                              <td>Created Date</td>
                              <td>Relation Type</td>
                              <td>Owner</td>
                            </tr>
                          </thead>
                          <tbody>
                            {isInit ? (
                              <>
                                {EventDocuments.length ? (
                                  <>
                                    {EventDocuments.map((Doc) => (
                                      <>
                                        <tr className="cursor-pointer">
                                          <td>
                                            <i
                                              className="ri-close-line cursor-pointer"
                                              onClick={() =>
                                                this.disattachDocument(
                                                  Doc.DOC_ID
                                                )
                                              }
                                            ></i>
                                          </td>
                                          <td>
                                            <NavLink
                                              to={combine("SINGLE_DOCUMENT", {
                                                DOC_ID: Doc.DOC_ID,
                                              })}
                                            >
                                              {Doc.DOCUMENT_NAME}
                                            </NavLink>
                                          </td>
                                          <td>{Doc.CREATED_DATE}</td>
                                          <td>{Doc.Relation_type}</td>
                                          <td>{Doc.Person_id}</td>
                                        </tr>
                                      </>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    <tr>
                                      <td colSpan={5}>
                                        Attachments list is empty.
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <tr>
                                  <td colSpan={5}>
                                    <div className="w-100 d-flex justify-content-center align-items-center p-3">
                                      <Spinner size="m" />
                                    </div>
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </Table>
                      </AvCheckboxGroup>
                    </AvForm>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader  className="d-flex align-items-center justify-content-between"
                    style={{ padding: "12px" }}
                  >
                    <div className="d-flex align-items-center AccentFont font-size-16">
                      Child Events
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                  <Table className="customTable mb-0">
                          <thead>
                            <tr>
                              {/* <td>
                                <AvCheckbox customInput onChange={this.toggleAll} checked={isMainChecked} />
                              </td> */}
                              <td>Activity Name</td>
                              <td>Activity Type</td>
                              <td>Owner</td>
                              <td>Tentative Date</td>
                              <td>Time Estimate Days</td>
                            </tr>
                          </thead>
                          <tbody>
                            {isInit ? (
                              <>
                                {ChildEvents.length ? (
                                  <>
                                    {ChildEvents.map((e) => (
                                      <>
                                        <tr className="cursor-pointer">
                                          
                                          <td>
                                              <NavLink
                                              to={combine("SINGLE_EVENT", { Activity_Name: e.Activity_Name })}>
                                                {e.Activity_Title}
                                              </NavLink>
                                       
                                          </td>
                                          <td>{e.Activity_type_Description}</td>
                                          <td>{e.Owner}</td>
                                          <td>{e.Tentative_date}</td>
                                          <td>{e.Time_estimate_days}</td>
                                        </tr>
                                      </>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    <tr>
                                      <td colSpan={5}>
                                        No Child Events, Yet.
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <tr>
                                  <td colSpan={5}>
                                    <div className="w-100 d-flex justify-content-center align-items-center p-3">
                                      <Spinner size="m" />
                                    </div>
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </Table>
                  </CardBody>
                </Card>
                <Card>
              <CardBody>
                <Row>
                  <Col lg={8} style={{ borderRight: "1px solid #dadada" }}>
                    <EventNotes description={Comments} Activity_Name = {Activity_Name} loadEvent={this.loadEvent}/>
                  </Col>
                  <Col lg={4}>
                    <EventLog />
                  </Col>
                </Row>
              </CardBody>
            </Card>
              </Col>

              <Col lg={3}>
                <Card>
                  <CardBody>
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="AccentFont mb-0">About</h5>
                        <Dropdown
                          isOpen={this.state.contextMenu}
                          direction="left"
                          toggle={() =>
                            this.setState({
                              contextMenu: !this.state.contextMenu,
                            })
                          }
                          className="contextMenuDrop"
                        >
                          <DropdownToggle tag="span">
                            <span className="" style={{ cursor: "pointer" }}>
                              <i className="font-size-22   ri-settings-5-line"></i>
                            </span>
                          </DropdownToggle>
                          <DropdownMenu>
                          <DropdownItem
                              className="editDD d-flex align-items-center"
                              
                            >
                              <Icofont icon = "icofont-chart-flow" className="font-size-16"> </Icofont>
                            <NavLink to = {combine("EVENT_CHAIN", {Activity_Name:Activity_Name })}>  Event Chain </NavLink>
                            </DropdownItem>
                            <DropdownItem
                              className="editDD d-flex align-items-center"
                              onClick={() => {
                                this.props.showModal("EDIT_EVENT", {
                                  // eventData: this.state,
                                  Activity_Name:
                                    this.props.match.params.Activity_Name,
                                  eventTime: this.state.Tentative_date,
                                });
                              }}
                            >
                              <i className="font-size-16    ri-pencil-line"></i>
                              Edit
                            </DropdownItem>
                            <DropdownItem className="deleteDD d-flex align-items-center"
                            onClick={() => {
                              this.props.showModal("DELETE_EVENT", {
                                // eventData: this.state,
                                Activity_Name:
                                  this.props.match.params.Activity_Name,
                               
                              });
                            }}
                          >
                              <i className="font-size-16   ri-delete-bin-line"></i>
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                      <span className="AccentFont">{Activity_Name}</span>
                      {/* <div className="">{Comments}</div> */}
                      <div className="mt-2">
                        <div className="AccentFont">Activity Type</div>
                        <span>{Activity_type_Description}</span>
                      </div>

                      <div className="mt-2">
                        <div className="AccentFont">Parent Activity Name</div>
                        <span>{Parent_Activity_Name ? (
                          <NavLink to = {combine("SINGLE_EVENT", {Activity_Name: Parent_Activity_Name})}>
                            {Parent_Activity_Name}
                          </NavLink>
                        )
                      : 
                      "-"}</span>
                      {/* {console.log(combine("SINGLE_EVENT", {Activity_Name: Parent_Activity_Name}))} */}
                      </div>
                      <div className="mt-2">
                        <div className="AccentFont">Parent Activity Type</div>
                        <span>{Parent_Activity_type || "-"}</span>
                      </div>
                      <div className="mt-2">
                        <div className="AccentFont">Time estimate days</div>
                        <span>{Time_estimate_days}</span>
                      </div>

                      <div className="mt-2">
                        <div className="AccentFont">Case</div>
                       <NavLink to = {combine("SINGLE_CASE", {Case_Short_NAME:Case_NAME})}> <span>{Case_Full_NAME}</span></NavLink>
                      </div>

                      <div className="mt-2">
                        <div className="AccentFont">Owner</div>
                        <span>{Owner}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("NEW_PERSON_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NEW_PERSON_MODAL")),
  },
});

export default connect(null, mapDispatchToProps)(SingleEventView);
