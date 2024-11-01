import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Input,
} from "reactstrap";
// import {  } from "react-router-dom";
import { connect } from "react-redux";
import Event from "./../../components/Events/Event";
import classnames from "classnames";
import AddEventFromCalendar from "./../../components/Calendar/AddEventFromCalendar";
import Pagination from "./../../services/pagination";

class AllEvents extends Component {
  state = {
    activeTabJustify: "1",
    modal: false,

    tableSearch: "",
    searchFields: [],
    tablePagination: {},
  };
  toggleCustomJustified = this.toggleCustomJustified.bind(this);
  switch_modal = this.switch_modal.bind(this);

  switch_modal() {
    this.setState({ modal: !this.state.modal });
  }

  toggleCustomJustified(tab) {
    if (this.state.activeTabJustify !== tab) {
      this.setState({
        activeTabJustify: tab,
      });
    }

    this.clearSearch();
  }

  //SEARCH ANG PAG
  tableSearch = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ tableSearch: value });
  };

  clearSearch = () => {
    this.setState({ tableSearch: "" });
  };

  searchFilter = (data) => {
    const { tableSearch, searchFields } = this.state;

    if (tableSearch === "") return data;

    const needle = tableSearch.toLowerCase();

    return data.filter((x) => {
      let result = false;

      for (let k in x) {
        if (
          typeof x[k] === "string" &&
          (searchFields.length > 0 ? searchFields.includes(k) : true)
        ) {
          const tmp = x[k].toLowerCase();
          if (tmp.indexOf(needle) !== -1) {
            result = true;
          }
        }
      }

      return result;
    });
  };

  getPageRows = (name, data) => {
    let { tablePagination, order } = this.state;
    let RESULT = data;

    if (
      tablePagination.hasOwnProperty(name) &&
      data.length > tablePagination[name].pageLimit
    ) {
      const { offset, pageLimit } = tablePagination[name];

      RESULT = RESULT.slice(offset, offset + pageLimit);
    }

    return RESULT;
  };

  onPageChanged = (data) => {
    let { tablePagination } = this.state;
    const { currentPage, totalPages, pageLimit, name } = data;
    let offset = (currentPage - 1) * pageLimit;
    if (offset < 0) offset = 0;

    tablePagination[name] = {
      currentPage: currentPage,
      offset: offset,
      totalPages: totalPages,
      pageLimit: pageLimit,
    };

    this.setState({ tablePagination: tablePagination });
  };
  //SEARCH ANG PAG ENDS

  render() {
    const { cases, activityTypes, staff } = this.props;
    let events = [];
    cases.map((x) => {
      events = events.concat(x.Case_Events.map((e) => {
        e.Case_Full_NAME = cases.find((c) => c.Case_Short_NAME === e.Case_NAME).Case_Full_NAME;
        return e;
      }));
    });

    const upcomingEvents = events
    .filter(
      (event) =>
        Date.parse(event.Tentative_date_human) >=
        new Date(Date.now()).setHours(0, 0, 0, 0)
    );

    const pastEvents = events
    .filter(
      (event) =>
        Date.parse(event.Tentative_date_human) <
        new Date(Date.now()).setHours(0, 0, 0, 0)
    )
    ;
    // console.log(activityTypes);
    return (
      <>
        <div className="page-content">
          <Container fluid className="pageWithSearchTable">
            <div className="d-flex justify-content-between mb-3 align-items-center">
              <h5 className="d-flex justify-content-between">All Events </h5>
              <div className="toolbar d-flex case-toolbar ">
                
              </div>
            </div>

            <Row>
              <Col lg={4} className="offset-8">
                <div className="sub-toolbar">
                  <Nav className="nav-tabs-custom nav-justified" tabs>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: this.state.activeTabJustify === "1",
                        })}
                        onClick={() => {
                          this.toggleCustomJustified("1");
                        }}
                      >
                        <span className="d-none d-sm-block">Upcoming</span>
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: this.state.activeTabJustify === "2",
                        })}
                        onClick={() => {
                          this.toggleCustomJustified("2");
                        }}
                      >
                        <span className="d-none d-sm-block">Past</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </Col>
            </Row>

            <Card>
              <CardBody>
                <TabContent activeTab={this.state.activeTabJustify}>
                  <TabPane tabId="1" className="">
                    <Row className="d-flex justify-content-between  toolbar case-toolbar">
             <Col>
             <Button
                  color="success"
                  className="d-flex align-items-center d-flex w-100 text-center btn btn-success h-38"
                  onClick={() =>
                    this.setState((prevState) => ({
                      modal: !prevState.modal,
                    }))
                  }
                >
                  <i className="ri-calendar-event-line font-size-20 mr-1  auti-custom-input-icon "></i>
                  Add Event
                </Button>
             </Col>
                      <Col lg={10}>
                        <div className="search-row mb-3">
                          <Input
                            className="table-search"
                            onChange={this.tableSearch}
                            type="text"
                            value={this.state.tableSearch}
                            placeholder="Click to Search"
                          />
                          <i
                            class="ri-close-line"
                            onClick={this.clearSearch}
                          ></i>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {this.getPageRows("Upcoming_events", this.searchFilter(upcomingEvents))
                        .map((event) => (
                          <>
                            <Col lg={3}>
                              {(() => {
                                let actType = activityTypes.find(
                                  (x) => x.Activity_type === event.Activity_type
                                );
                                let stF = staff.find(
                                  (x) =>
                                    x.Person_id === event.Responsible_Person_id
                                );
                                // let responsPers =

                                return (
                                  <>
                                    <Event
                                      EventTitle={event.Activity_Title}
                                      EventName={event.Activity_Name}
                                      ActivityType={event.Activity_type}
                                      ActivityTypeTitle={
                                        actType !== undefined
                                          ? actType.Description
                                          : ""
                                      }
                                      Owner={event.Owner}
                                      Tentative_date_human={
                                        event.Tentative_date_human
                                      }
                                      Tentative_date={event.Tentative_date}
                                      CurrentCase={event.Case_NAME}
                                      CaseInfo={
                                        cases.find(
                                          (y) =>
                                            y.Case_Short_NAME ===
                                            event.Case_NAME
                                        ).Case_Full_NAME
                                      }
                                      Responsible_Person_id={
                                        event.Responsible_Person_id
                                      }
                                      style={{
                                        backgroundColor: "#fff",
                                        borderLeftColor: cases.find(
                                          (y) =>
                                            y.Case_Short_NAME ===
                                            event.Case_NAME
                                        ).CaseBg,
                                        borderLeftStyle: "solid",
                                        borderLeftWidth: "3px",
                                      }}
                                      Responsible_Person_Name={
                                        stF !== undefined ? stF.NAME : ""
                                      }
                                    />
                                  </>
                                );
                              })()}
                            </Col>
                          </>
                        ))}
                    </Row>

                    <Row>
                      <Col>
                        <Pagination
                          name="Upcoming_events"
                          totalRecords={this.searchFilter(upcomingEvents).length}
                          pageNeighbours={1}
                          pageLimit={12}
                          onPageChanged={this.onPageChanged}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                  <Row className="d-flex justify-content-between  toolbar case-toolbar">
             <Col>
             <Button
                  color="success"
                  className="d-flex align-items-center d-flex w-100 text-center btn btn-success h-38"
                  onClick={() =>
                    this.setState((prevState) => ({
                      modal: !prevState.modal,
                    }))
                  }
                >
                  <i className="ri-calendar-event-line font-size-20 mr-1  auti-custom-input-icon "></i>
                  Add Event
                </Button>
             </Col>
                      <Col lg={10}>
                        <div className="search-row mb-3">
                          <Input
                            className="table-search"
                            onChange={this.tableSearch}
                            type="text"
                            value={this.state.tableSearch}
                            placeholder="Click to Search"
                          />
                          <i
                            class="ri-close-line"
                            onClick={this.clearSearch}
                          ></i>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {this.getPageRows("Past_events", this.searchFilter(pastEvents)).map((event) => (
                          <>
                            <Col lg={3}>
                              {(() => {
                                let actType = activityTypes.find(
                                  (x) => x.Activity_type === event.Activity_type
                                );
                                let stF = staff.find(
                                  (x) =>
                                    x.Person_id === event.Responsible_Person_id
                                );
                                // let responsPers =

                                return (
                                  <>
                                    <Event
                                      EventTitle={event.Activity_Title}
                                      EventName={event.Activity_Name}
                                      ActivityType={event.Activity_type}
                                      ActivityTypeTitle={
                                        actType !== undefined
                                          ? actType.Description
                                          : ""
                                      }
                                      Owner={event.Owner}
                                      Tentative_date_human={
                                        event.Tentative_date_human
                                      }
                                      Tentative_date={event.Tentative_date}
                                      CurrentCase={event.Case_NAME}
                                      CaseInfo={
                                        cases.find(
                                          (y) =>
                                            y.Case_Short_NAME ===
                                            event.Case_NAME
                                        ).Case_Full_NAME
                                      }
                                      Responsible_Person_id={
                                        event.Responsible_Person_id
                                      }
                                      style={{
                                        backgroundColor: "#fff",
                                        borderLeftColor: cases.find(
                                          (y) =>
                                            y.Case_Short_NAME ===
                                            event.Case_NAME
                                        ).CaseBg,
                                        borderLeftStyle: "solid",
                                        borderLeftWidth: "3px",
                                      }}
                                      Responsible_Person_Name={
                                        stF !== undefined ? stF.NAME : ""
                                      }
                                    />
                                  </>
                                );
                              })()}
                            </Col>
                          </>
                        ))}
                    </Row>
                    <Row>
                      <Col>
                        <Pagination
                          name="Past_events"
                          totalRecords={this.searchFilter(pastEvents).length}
                          pageNeighbours={1}
                          pageLimit={12}
                          onPageChanged={this.onPageChanged}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
            <AddEventFromCalendar
              modal={this.state.modal}
              switch_modal={this.switch_modal}
              frombtn={true}
              calendarType="home_calendar"
            />
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    activityTypes: state.User.activityTypes,
    staff: state.User.staff,
  };
};
// const mapDispatchToProps = (dispatch) => {
//   return {
//     setCaseId: () => dispatch(actions.setLocalDocuments (idC)),
//   };
// };

export default connect(mapStateToProps, null)(AllEvents);
