import React, { Component, Suspense, lazy } from "react";
import { Container, Card, CardBody, Row, Col, Button, CardHeader } from "reactstrap";
import * as CaseActions from "./../../store/case/actions";
import { connect } from "react-redux";
import TrotlingBlocks from "./../StyledComponents/TrotlingBlocks";

import * as ModalActions from "./../../store/modal/actions";

import combine from "./../../routes/combine";
import Calendar from "./Calendar";
import EventsApi from "../../api/EventsApi";

class CaseCalendar extends Component {
  state = {
    EventsData: [],
    isInit: false,
  };

  combine = (...args) => {
    if (this.props.disableLinks) return "#";

    return combine(...args);
  };

  navTo = (link) => {
    this.props.history.push(link);
  }

  loadEvents = async () => {
    const EventsData = (await EventsApi.fetchCaseEvents(this.props.Case_NAME)) || [];
    const URL = (data) => this.combine("SINGLE_EVENT", data);

    if (EventsData.hasOwnProperty("result") && !EventsData.result) return false;

    this.setState({
      EventsData: EventsData.map((x) => ({
        event: x,
        title: x.Activity_Title,
        start: new Date(x.Tentative_date),
        backgroundColor: x.CaseBg,		
        myUrl: this.combine("SINGLE_EVENT", {Activity_Name: x.Activity_Name})
      })),
      isInit: true,
    });
  };

  // async componentDidUpdate(prevProps, prevState) {
  // 	this.loadEvents();
  // }

  componentDidMount(prevProps, prevState) {
    this.loadEvents();
  }

  render() {
    const { EventsData, isInit } = this.state;

    return (
      <>
        <Calendar EventsData={EventsData} isInit={isInit}  loadEvents={this.loadEvents} Case_NAME={this.props.Case_NAME} Case_Full_NAME={this.props.Case_Full_NAME} navTo={this.navTo}/>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CaseCalendar);
