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
import PageHeader from "./../../components/PageHader/PageHeader";
import notification from "../../services/notification";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import EventsApi from "../../api/EventsApi";
import hexToRgba from "hex-to-rgba";
import { NavLink } from "react-router-dom";
import combine from "../../routes/combine";
class EventChain extends React.Component {
  state = {
    currentEvent: {},
    eventChainParents: [],
    eventChainChildren: [],
    isInit: false,
  };

  handleChange = (e, val) => {
    const { name } = e.currentTarget;
    this.setState({ [name]: val });
    console.log(this.state);
  };

  getDate = async () => {
    const event = await this.props.match.params.Activity_Name;
    const currentEvent = await EventsApi.fetchEvent(event);
    this.setState({ currentEvent });
  };

  loadEventChain = async () => {
    const { Activity_Name } = await this.props.match.params;
    const eventChainData = await EventsApi.fetchEventChain(Activity_Name);

    this.setState({
      eventChainParents: eventChainData[0],
      eventChainChildren: eventChainData[1],
    });
  };

  async componentDidMount() {
    await this.getDate();
    await this.loadEventChain();

    this.setState({ isInit: true });
  }

  render() {
    const { eventChainParents, eventChainChildren, currentEvent, isInit } =
      this.state;

    return (
      <>
        <div className="page-content ">
          <Container fluid>
            <PageHeader>
              {" "}
              {currentEvent.Activity_Title || ""} Event Chain
            </PageHeader>
            <Row>
              <Col lg={9}>
                <div className="chainHolder">
                  <div className="sd"></div>
                  {eventChainParents.map((x) => (
                     <NavLink to={combine("SINGLE_EVENT", {Activity_Name: x.Activity_Name})}>
                      <div
                      className={
                        x.INDEX_NUMBER === 0 ? "activeChain" : "chainParent"
                      }
                      style={{ background: hexToRgba("#cb003a", "0.8") }}
                    >
                      <div className="d-flex, align-items-center, justify-content-between ">
                        <span className="title">{x.Activity_Title}</span>{" "}
                        <span className="time">{x.Tentative_date}</span>
                      </div>
                      <div className="align-items-center, justify-content-between" style={{display: "flex"}}>
                        <span className="case">{x.Case_NAME}</span>
                        <span lassName="type"> {x.Activity_type}</span>
                      </div>
                      {console.log(x)}
                    </div>
                    </NavLink>
                  ))}
                  {/* {eventChainChildren.map((x)=> (
                    <div className="chainParent ">
                    {x.Activity_Title}
                    </div>
                 ))} */}
                </div>
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

export default connect(null, mapDispatchToProps)(EventChain);
