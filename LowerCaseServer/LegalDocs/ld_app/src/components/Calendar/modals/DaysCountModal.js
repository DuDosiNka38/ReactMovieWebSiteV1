import React, { Component } from "react";
import { Modal, ModalBody, ModalHeader, Col, Row, Container } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../../store/modal/actions";
import Icofont from "react-icofont";

class DaysCountModal extends Component {
  state = {};

  render() {
    return (
      <Modal size="md" isOpen={true} centered={true}>
        <ModalHeader toggle={this.props.hideModal} className="text-center">
          Selected Days
        </ModalHeader>

        <ModalBody>
          <Container fluid>
            <Row>
              <Col lg={6}>
              <div className="daysSelected">
              <Icofont icon="calendar" className="font-size-30"></Icofont> All Days:
                  <div className="d-flex align-items-center">
                  

                    <span className="selectedDaysCount">
                    {this.props.allDays}

                    </span>
                  </div>
                </div>
      
              </Col>

              <Col lg={6}>
                <div className="daysSelected">
                <Icofont icon="calendar" className="font-size"></Icofont> Business Days:
                  <div className="d-flex align-items-center">
                   

                    <span className="selectedDaysCount">
                      {this.props.workDays}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>

          {/* <div className="daysSelected">
            {" "}
            Selected Business Days:{" "}
            <span className="selectedDaysCount">{this.props.workDays}</span>
          </div> */}
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DaysCountModal);
