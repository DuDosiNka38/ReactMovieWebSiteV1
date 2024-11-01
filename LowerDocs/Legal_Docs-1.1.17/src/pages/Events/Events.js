import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Event from "../../components/Events/Event";
// import events from "./evets.json";
import { connect } from "react-redux";
import axios from "./../../services/axios";
import * as actions from "./../../store/user/actions";

class Events extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "Events", link: "/" },
    ],
  };
  render() {
    const { cases, events } = this.props;
    const CurrentCaseId = this.props.match.params.caseId;
    const CurrentCaseEvents = cases.find(
      (x) => x.Case_Short_NAME === CurrentCaseId
    ).Case_Events;
    const Case_Name = cases.find(
      (x) => x.Case_Short_NAME === CurrentCaseId
    ).Case_Full_NAME
    return (
      <>
        <div className="">
          <Container fluid>
            <h5 className="mb-3">{Case_Name} Events </h5>
            <Row>
              <Col md={12}>
                <Card>
                  <CardBody>
                    <Row>
                      {CurrentCaseEvents.map((event) => (
                      <Col lg="4" className="mb-3">
                        <Event
                          EventTitle={event.Activity_Title}
                          EventName={event.Activity_Name}
                          ActivityType={event.Activity_type}
                          ActivityTypeTitle={this.props.activityTypes.find((x) => x.Activity_type === event.Activity_type).Description}
                          Owner = {event.Owner}
                          Tentative_date_human = {event.Tentative_date_human}
                          Tentative_date = {event.Tentative_date}
                          CurrentCase={CurrentCaseId}
                          Responsible_Person_id={event.Responsible_Person_id}
                          Responsible_Person_Name={this.props.staff.find((x) => x.Person_id === event.Responsible_Person_id).NAME}
                        />
                        </Col>
                      ))}
                    </Row>
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

const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    events: state.User.localEvents,
    activityTypes: state.User.activityTypes,
    staff: state.User.staff,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);
