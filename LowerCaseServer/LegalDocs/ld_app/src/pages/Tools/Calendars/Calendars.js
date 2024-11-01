import React, { Component } from "react";
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
} from "reactstrap";
import PageHeader from "../../../components/PageHader/PageHeader";
import * as ModalActions from "./../../../store/modal/actions";
import * as CaseActions from "./../../../store/case/actions";
import { connect } from "react-redux";

class Calendars extends Component {
  state = {};
  componentDidMount() {
    this.props.requestCalendars();
   
  }
  render() {
    const { calendars } = this.props;

    return (
      <>
        <div className="page-content">
          <Container fluid>
            <PageHeader>Calendars</PageHeader>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardHeader className="d-flex justify-content-end align-items-center">
                    <Button
                      onClick={() => this.props.showModal("ADD_CALENDAR")}
                      className="d-flex align-items-center text-center ld-button-warning"
                    >
                      <i className=" ri-add-line font-size-14 mr-1  auti-custom-input-icon "></i>
                      Add Calendar
                    </Button>
                  </CardHeader>
                  <CardBody className="p-0">
                    <Table className="customTable p-0 mb-0">
                      <thead>
                        <tr>
                          <td>Calendar Name</td>
                          <td>Description</td>

                          <td>Actions</td>
                        </tr>
                      </thead>
                      <tbody>
                        {calendars.map((x) => (
                          <tr key={x.Calendar_name}>
                            <td>{x.Calendar_name}</td>
                            <td>{x.Description}</td>

                            <td className="d-flex">
                              <span
                                className="flat-icon user-del font-size-20  d-flex justify-content-center align-items-center"
                                title="Edit"
                                onClick={() => this.props.showModal("UPDATE_CALENDAR", {CalendarData : x})}
                              >
                                <i className="ri-settings-5-line"></i>
                              </span>
                              <span
                                className="flat-icon user-del font-size-20  d-flex justify-content-center align-items-center"
                                title="Delete"
                                onClick={() => this.props.showModal("DELESTE_CALENDAR", {Calendar_name : x.Calendar_name})}
                              >
                                <i className="ri-close-line"></i>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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

const mapStateToProps = (state) => ({
  calendars: state.Case.calendars,
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),

  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  requestCalendars: () => dispatch(CaseActions.calendarsFetchRequested()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendars);
