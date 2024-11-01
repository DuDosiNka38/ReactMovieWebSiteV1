import React, { Component, createRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Collapse,
} from "reactstrap";
import PageHeader from "../../components/PageHader/PageHeader";
import notification from "../../services/notification";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import data from "./../../components/TimeLog/timelog.json";
class TimeLog extends React.Component {
  state = {};

  toshow = React.createRef();
  handleChange = (e, val) => {
    const { name } = e.currentTarget;
    this.setState({ [name]: val });
    console.log(this.state);
  };

  showMore = (e) => {};

  toggleBlock = (i) => {
    const el = document.getElementById(`timeline_collapse/${i}`);
    el.classList.toggle("show");
  };

  switchTrack = () => {

  }

  render() {
    let timelog_item = data;
    console.log(timelog_item);
    return (
      <>
        <div className="page-content ">
          <Container fluid>
            <PageHeader>Time Log</PageHeader>
            <Row>
              <Col lg={9}>
                <Card>
                  <CardBody>
                    <div className="timeline_holder ">
                      <h6>Today</h6>
                      {timelog_item.map((Case, i) => (
                        <>
                        <div className = "timeline_block">
                          <div
                            className="timeLine_header"
                            style={{background: Case.caseBG}}
                           
                          >
                            <div  onClick={(e) => this.toggleBlock(i)} className="cursor-pointer">  {Case.case_name}</div>{" "}
                            <div className="d-flex align-items-center timer_bar ">
                              <i className="ri-timer-line  timeline_timer"></i>
                              {Case.case_full_time}
                            </div>{" "}
                            <div className="actions d-flex align-items-center">
                              <span className="timelin_action d-flex align-items-center" title = "Start">
                                <i className="ri-play-mini-fill"></i>
                              </span>
                              <span className="timelin_action d-flex align-items-center" title = "Get Report">
                                <i className=" ri-file-download-fill"></i>
                              </span>
                              <span className="timelin_action d-flex align-items-center" title = "Close Log">
                                <i className="ri-close-circle-fill"></i>
                              </span>
                            </div>
                            {Case.active && (
                              <div className="active_timer_line">
                              <div className="ANIMED_LINE"></div>
                            </div>
                            )}
                          </div>

                          <Collapse isOpen={false} id={`timeline_collapse/${i}`}>
                            <div className="timeline_body px-3 py-1" style={{borderLeft: `1px solid ${Case.caseBG}`, borderRight: `1px solid ${Case.caseBG}`, borderBottom: `5px solid ${Case.caseBG}`}}>
                              <div className="timeline_inside_title">
                                Documents
                              </div>
                              {Case.documents.map((x) => (
                                <>
                                  <div className="timeline_sub_item ">
                                    <span>{x.doc_name} </span>{" "}
                                    <span className="d-flex align-items-center">
                                      <i className="ri-timer-line  timeline_timer"></i>
                                      {x.doc_time}{" "}
                                    </span>
                                  </div>

                                </>
                              ))}
                                 <div className="timeline_inside_title">
                                Events
                              </div>
                              {Case.events.map((x) => (
                                <>
                                  <div className="timeline_sub_item ">
                                    <span>{x.event_name} </span>{" "}
                                    <span className="d-flex align-items-center">
                                      <i className="ri-timer-line  timeline_timer"></i>
                                      {x.event_time}{" "}
                                    </span>
                                  </div>
                                </>
                              ))}
                            </div>

                          
                           
                         
                          </Collapse>
                          </div>
                        </>
                      ))}
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
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(null, mapDispatchToProps)(TimeLog);
