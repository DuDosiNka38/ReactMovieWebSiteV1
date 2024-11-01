import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  CardHeader,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import Calendar from "./../../components/Calendar";
import Documents from "./../../components/Document/Documents";
import CreateEvent from "../../components/Events/CreateEvent";
import AddDocument from "../../components/Document/AddDocument";
import PRIVILEGE from "../../services/privileges";
import CloseCase from "../../components/Cases/CloseCase";
import SlideToggle from "react-slide-toggle";
import Event from "../../components/Events/Event";
import AddEventFromCalendar from "../../components/Calendar/AddEventFromCalendar";
import classnames from "classnames";

class SingleCaseView extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "All Cases", link: "/allcases" },
      // { title: `${CC}`, link: "#" },
    ],
    modal: false,
    doc_modal: false,
    mounted: false,
    isTogled: false,
    currentCase: "",
    activeTabJustify: "1",
  };
  toggleCustomJustified = this.toggleCustomJustified.bind(this);
  setCaseName = this.setCaseName.bind(this);
  toggleCustomJustified(tab) {
    if (this.state.activeTabJustify !== tab) {
      this.setState({
        activeTabJustify: tab,
      });
    }
  }
  onToggle = () => {
    this.setState({ toggleEvent: Date.now(), isTogled: !this.state.isTogled });
  };

  switch_modal = (e) => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  switch_doc_modal = (e) => {
    this.setState((prevState) => ({
      doc_modal: !prevState.doc_modal,
    }));
  };
  switch_close_case_modal = (e) => {
    this.setState((prevState) => ({
      close_case_modal: !prevState.close_case_modal,
    }));
  };

  componentDidUpdate(prevProps, prevState) {}

  componentDidMount() {
    this.props.onKeywordsLoad();
    this.setCaseName();
    this.setState({ toggleEvent: Date.now() });
  }

  setCaseName() {
    const caseId = this.props.match.params.caseId;
    const { cases } = this.props;
    const curCase = cases.find((x) => x.Case_Short_NAME === caseId);
    if (curCase === undefined) {
      setTimeout(this.setCaseName, 500);
    } else {
      const bi = this.state.breadcrumbItems;
      bi.push({ title: curCase.Case_Full_NAME, link: "#" });
      this.setState({ mounted: true, breadcrumbItems: bi });
    }
  }

  render() {
    // this.props.docs = caseId
    const { calendars, cases, persone, previliges } = this.props;
    const { caseId } = this.props.match.params;
    const currentCase = cases.find((x) => x.Case_Short_NAME == caseId);


    if (currentCase === undefined) return <></>;
    const pData = persone;
    const cCaseName = currentCase.Case_Short_NAME;
    if (persone == undefined || persone.length == 0) return <></>;
    if (currentCase == undefined || currentCase.length == 0) return <></>;
    if (previliges == undefined || previliges.length == 0) return <></>;

    if (persone.Person_id != "ROOT")
      pData.Privileges = pData.Privileges.filter(
        (x) =>
          previliges.single.find(
            (y) => y.Privilege == x.Privilege && y.Priv_Type != "case"
          ) != undefined
      ).concat(
        currentCase.Case_Participants.find(
          (x) => x.Person_id == persone.Person_id
        ).Privileges
      );

    if (!PRIVILEGE.check("SHOW_CASES", pData))
      return (
        <>
          <div className="">
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <h2>You don't have permissions to see this page!</h2>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      );

    // const { events } = this.props;
    let cEvents = [];
    let caseDocs = [];
    let caseEvents = [];
    if (currentCase.hasOwnProperty("Case_Documents")) {
      caseDocs = currentCase.Case_Documents;
    }
    if (currentCase.hasOwnProperty("Case_Events")) {
      caseEvents = currentCase.Case_Events;
    }

    const calendarName = "DEFAULT_CALENDAR";
    if (PRIVILEGE.check("SHOW_CASE_EVENTS", pData)) {
      if (calendars.hasOwnProperty(calendarName)) {
        // let calendar = calendars[calendarName];
        caseEvents.forEach(function (v, i, a) {
          if (v.Case_NAME == caseId) {
            cEvents.push({
              event: v,
              title: v.Activity_Title,
              start: new Date(parseInt(v.Tentative_date + "000")),
              url: `/app/case-explorer/case/${v.Case_NAME}/event/${v.Activity_Name}`,
              backgroundColor: currentCase.CaseBg,
            });
          }
        });
      }
    }
    let calendarLoc;
    if (this.props.location.pathname.includes("single-case")) {
      calendarLoc = "single_case";
    }

    return (
      <>
        <div className="">
          <Container fluid>
            {/* <Breadcrumbs
              title={currentCase.Case_Full_NAME}
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}

            <Row>
              <div className="d-flex align-items-center w-100">
                <Col lg={4}>
                  <h5 className="mb-3">{currentCase.Case_Full_NAME}</h5>
                </Col>
                <Col lg={8}>
                  <Card className="case-toolbar">
                    <CardBody
                      className="d-flex"
                      style={{
                        borderLeft: `4px solid ${currentCase.CaseBg}`,
                        borderRadius: "3px 0 0 3px",
                      }}
                    >
                      <CloseCase
                        modal={this.state.close_case_modal}
                        switch_modal={this.switch_close_case_modal}
                        caseId={caseId}
                      />
                      <Link
                        to={`/app/case-explorer/caseinfo/${currentCase.Case_Short_NAME}`}
                      >
                        <Button
                          color="success"
                          className="d-flex align-items-center"
                        >
                          {" "}
                          <i className=" ri-information-line font-size-20 mr-1  auti-custom-input-icon "></i>{" "}
                          Case information{" "}
                        </Button>
                      </Link>
                      {PRIVILEGE.check("ADD_DOCUMENT", pData) && (
                        <>
                          <Button
                            color="primary"
                            className="ml-3 d-flex align-items-center"
                            onClick={() =>
                              this.setState((prevState) => ({
                                doc_modal: !prevState.doc_modal,
                              }))
                            }
                          >
                            <i className="ri-file-add-line font-size-20 mr-1  auti-custom-input-icon "></i>
                            Add Document
                          </Button>
                        </>
                      )}
                      {PRIVILEGE.check("ADD_CASE_EVENTS", pData) && (
                        <>
                          <Button
                            color="primary"
                            className="ml-3 d-flex align-items-center"
                            onClick={() =>
                              this.setState((prevState) => ({
                                modal: !prevState.modal,
                              }))
                            }
                          >
                            <i className="ri-calendar-event-line font-size-20 mr-1  auti-custom-input-icon"></i>
                            Add Event
                          </Button>
                        </>
                      )}

                      {PRIVILEGE.check("EDIT_CASE", pData) && (
                        <>
                          <Button
                            color="danger"
                            className="ml-3 d-flex align-items-center"
                            onClick={() =>
                              this.setState((prevState) => ({
                                close_case_modal: !prevState.close_case_modal,
                              }))
                            }
                          >
                            <i className="ri-file-lock-line font-size-20 mr-1  auti-custom-input-icon"></i>
                            Close case
                          </Button>
                        </>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </div>
              <Col lg={12}>
                <Row>
                  <Col lg={12}>
                    <Card>
                      <CardHeader onClick={(e) => this.onToggle()}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <h5 style={{ margin: "0px" }}>Documents</h5>
                            <span
                              className="toggle toggle-icon ml-1"
                              color="info"
                              color="info"
                              onClick={(e) => this.onToggle()}
                              style={{
                                position: "relative",
                                top: "2px",
                              }}
                            >
                              <i
                                className={
                                  this.state.isTogled === false
                                    ? " ri-arrow-drop-down-fill"
                                    : " ri-arrow-drop-up-fill"
                                }
                              ></i>
                            </span>
                          </div>
                          {PRIVILEGE.check("SHOW_CASE_DOCUMENTS", pData) && (
                            <>
                              <Link
                                to={`/app/case-explorer/case/${caseId}/documents`}
                              >
                                <Button color="primary">View All</Button>
                              </Link>
                            </>
                          )}
                        </div>
                      </CardHeader>

                      <SlideToggle
                        toggleEvent={this.state.toggleEvent}
                        collapsed
                      >
                        {({ setCollapsibleElement }) => (
                          <div className="my-collapsible">
                            <div
                              className="my-collapsible__content"
                              ref={setCollapsibleElement}
                            >
                              <div className="my-collapsible__content-inner">
                                <CardBody className="py-0 pb-3">
                                  <AddDocument
                                    modal={this.state.doc_modal}
                                    switch_modal={this.switch_doc_modal}
                                    case={caseId}
                                    caseDocs={caseDocs}
                                    keywords={this.props.keywords}
                                    whereopen = "inside_case"

                                  />
                                  {PRIVILEGE.check(
                                    "SHOW_CASE_DOCUMENTS",
                                    pData
                                  ) ? (
                                    <>
                                      <Row>
                                        {Array.isArray(caseDocs) &&
                                        caseDocs.length !== 0 ? (
                                          <>
                                            {caseDocs.map(
                                              ({ DOCUMENT_NAME, DOC_ID }) => (
                                                <Documents
                                                  CaseId={caseId}
                                                  docName={DOCUMENT_NAME}
                                                  DocimentView={DOC_ID}
                                                  caeId={caseId}
                                                />
                                              )
                                            )}
                                          </>
                                        ) : (
                                          <h5>No documents yet</h5>
                                        )}
                                      </Row>
                                    </>
                                  ) : (
                                    <>
                                      <h5 className="my-3">
                                        You don't have permissions to see
                                        documents
                                      </h5>
                                    </>
                                  )}
                                </CardBody>
                              </div>
                            </div>
                          </div>
                        )}
                      </SlideToggle>
                      {/* <CardBody className="d-flex flex-wrap justify-content-start ">
                       
                      </CardBody> */}
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg={4}>
                <Card>
                  <div className="d-flex bb-1 align-items-center pt-2 justify-content-between">
                    <h4 className="events-title border-0">
                      Case events
   
                    </h4>
                    <Nav className="nav-tabs-custom nav-justified" tabs>
                         
                         <NavItem>
                           <NavLink
													style={{ cursor: "pointer" }}
                          
                          className={classnames({
														active: this.state.activeTabJustify === "1"
													})}
													onClick={() => {
														this.toggleCustomJustified("1");
													}}
												>
													<span className="d-none d-sm-block inIv">Upcoming</span>
                           </NavLink>
                         </NavItem>
            
                         <NavItem>
                         <NavLink
													style={{ cursor: "pointer" }}
													className={classnames({
														active: this.state.activeTabJustify === "2"
													})}
													onClick={() => {
														this.toggleCustomJustified("2");
													}}
												>
													<span className="d-none d-sm-block inIv">Past</span>
                           </NavLink>
                         </NavItem>
                 
                     </Nav>
                  </div>
                  <CardBody className="d-flex flex-column caseEvents">
                    {/*                    
                    <CreateEvent
                      modal={this.state.modal}
                      switch_modal={this.switch_modal}
                      case={caseId}
                      docs={caseDocs}
                      events={caseEvents}
                    /> */}
                    <AddEventFromCalendar
                      modal={this.state.modal}
                      switch_modal={this.switch_modal}
                      frombtn={true}
                      currentCase={cCaseName}
                    />
                    {PRIVILEGE.check("SHOW_CASE_EVENTS", pData) ? (
                      <>
                        <div>
                          {caseEvents.length > 0 ? (
                            <>
                              <TabContent activeTab={this.state.activeTabJustify}>
                                <TabPane tabId="1">
                                { caseEvents.
                                  filter((event) => Date.parse(event.Tentative_date_human) >= new Date(Date.now()).setHours(0, 0, 0, 0)).length > 0 
                                  ?
                                  caseEvents.filter((event) => Date.parse(event.Tentative_date_human) >= new Date(Date.now()).setHours(0, 0, 0, 0)).map((event) => (
                                    <>
                                      <Event
                                        EventTitle={event.Activity_Title}
                                        EventName={event.Activity_Name}
                                        ActivityType={event.Activity_type}
                                        ActivityTypeTitle={
                                          this.props.activityTypes.find(
                                            (x) =>
                                              x.Activity_type ===
                                              event.Activity_type
                                          ).Description
                                        }
                                        Owner={event.Owner}
                                        Tentative_date_human={
                                          event.Tentative_date_human
                                        }
                                        Tentative_date={event.Tentative_date}
                                        CurrentCase={
                                          this.props.match.params.caseId
                                        }
                                        Responsible_Person_id={
                                          event.Responsible_Person_id
                                        }
                                        Responsible_Person_Name={
                                          this.props.staff.find(
                                            (x) =>
                                              x.Person_id ===
                                              event.Responsible_Person_id
                                          ).NAME
                                        }
                                      />
                                    </>
                                  ))
                                  :
                                  <>
                                    <h5 className="h5">Events list is empty</h5>
                                  </>
                                }
                                </TabPane>
                                <TabPane tabId="2">
                                  {caseEvents.
                                  filter((event) => Date.parse(event.Tentative_date_human) < new Date(Date.now()).setHours(0, 0, 0, 0)).length > 0 ?
                                  caseEvents.
                                  filter((event) => Date.parse(event.Tentative_date_human) < new Date(Date.now()).setHours(0, 0, 0, 0)).map((event) => (
                                    <>
                                      <Event
                                        EventTitle={event.Activity_Title}
                                        EventName={event.Activity_Name}
                                        ActivityType={event.Activity_type}
                                        ActivityTypeTitle={
                                          this.props.activityTypes.find(
                                            (x) =>
                                              x.Activity_type ===
                                              event.Activity_type
                                          ).Description
                                        }
                                        Owner={event.Owner}
                                        Tentative_date_human={
                                          event.Tentative_date_human
                                        }
                                        Tentative_date={event.Tentative_date}
                                        CurrentCase={
                                          this.props.match.params.caseId
                                        }
                                        Responsible_Person_id={
                                          event.Responsible_Person_id
                                        }
                                        Responsible_Person_Name={
                                          this.props.staff.find(
                                            (x) =>
                                              x.Person_id ===
                                              event.Responsible_Person_id
                                          ).NAME
                                        }
                                      />
                                    </>
                                  ))
                                  :
                                    <>
                                      <h5 className="h5">Events list is empty</h5>
                                    </>
                                  }
                                </TabPane>
                              </TabContent>
                            </>
                          ) : (
                            <>
                              <h5 className="mb-4"> No events yet</h5>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <h5 className=" ">
                          You don't have permissions to see events
                        </h5>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
              <Col lg={8}>
                <Calendar
                  calendarEvents={cEvents}
                  calendarType={calendarLoc}
                  currentCase={cCaseName}
                />
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
    cases: state.User.caseData.cases,
    events: state.User.localEvents,
    docs: state.User.localDocument,
    calendars: state.User.calendars,
    persone: state.User.persone,
    keywords: state.User.globalKeywords,
    previliges: state.User.previliges,
    activityTypes: state.User.activityTypes,
    staff: state.User.staff,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onCaseLoad: () => dispatch(actions.getCase()),
    onKeywordsLoad: () => dispatch(actions.getGKeywords()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleCaseView);
