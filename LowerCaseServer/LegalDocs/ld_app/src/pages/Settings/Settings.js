import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from "reactstrap";
import EventNotification from "../../components/Settings/EventNotification";
import PageHeader from "./../../components/PageHader/PageHeader";
import { AvForm } from "availity-reactstrap-validation";
import notification from "../../services/notification";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import AppSettings from "../../components/Settings/AppSettings";
class Settings extends React.Component {
  state = {
    save: false,
    notifications: {
      notify_time: 3,
    },
  };

  handleChange = (e, val) => {
    const { name } = e.currentTarget;
    this.setState({ [name]: val });
  };

  checkSave = () => {
    this.props.showModal("DONT_SAVED_SETTINGS"); // setTimeout(()=> this.props.history.push( "/settings"),100)
    console.log("not saved");
  };

  saveData = () => {
    this.setState({ save: true });
  };
  componentDidMount() {
    this.setState({ save: false });
  }
  componentWillUnmount() {
    const { save } = this.state;

    if (!save) {
      this.checkSave();
    }
  }
  render() {
    const { notifications } = this.state;
    const COL_SIZE = 4;

    return (
      <>
        <div className="page-content settings_page">
          <Container fluid>
            <PageHeader>Settings</PageHeader>
            <AvForm>
              <Row>
                <Col lg={COL_SIZE}>
                  <AppSettings />
                </Col>
                <Col lg={COL_SIZE}>
                  <Card>
                    <CardHeader>Personal Settings</CardHeader>
                  </Card>
                </Col>
                <Col lg={COL_SIZE}>
                  <Card>
                    <CardHeader>Case Settings</CardHeader>
                  </Card>
                </Col>
                <Col lg={COL_SIZE}>
                  <EventNotification
                    notify_time={notifications.notify_time}
                    onChange={this.handleChange}
                  ></EventNotification>
                </Col>
                <Col lg={COL_SIZE}>
                  <Card>
                    <CardHeader>Calendars Settings</CardHeader>
                  </Card>
                </Col>
                <Col lg={COL_SIZE}>
                  <Card>
                    <CardHeader>Calendars Settings</CardHeader>
                  </Card>
                </Col>
              </Row>
            </AvForm>
          </Container>
          <Button type="button" className="SaveSettingsBtn ld-button-success" onClick={this.saveData}>
            <i class="ri-save-2-line"></i>
          </Button>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(null, mapDispatchToProps)(Settings);
