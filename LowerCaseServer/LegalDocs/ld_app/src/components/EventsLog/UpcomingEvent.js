import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
class UpcomingEvents extends React.Component {
  state = {};



  render() {
    const { notifications } = this.state;
    console.log(this.props);
    return (
      <>
        <div className="page-content ">
          <Container fluid>
           
          </Container>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(null, mapDispatchToProps)(UpcomingEvents);
