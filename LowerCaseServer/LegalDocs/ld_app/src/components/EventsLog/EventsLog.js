import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Row,
  DropdownMenu,
  Spinner,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import { NavLink } from "react-router-dom";
import EventsApi from "../../api/EventsApi";
import combine from "../../routes/combine";
import Countdown from "react-countdown";
import hexToRgba from 'hex-to-rgba';

class EventsLog extends Component {
  state = {
    closestEvents: {},

    isInit: false,
  };

  loadClosestEvents = async () => {
    const { Person_id } = this.props.User;

    const currentDay = Date.now();
    const numDays = 45;
    const numDaysTime = (numDays + 1) * 24 * 60 * 60 * 1000;
    const endDateStamp = new Date(currentDay + numDaysTime);
    const endDate = `${endDateStamp.getFullYear()}-${endDateStamp.getMonth()}-${endDateStamp.getDate()}`;

    const closestEventsNotPrepared = await EventsApi.fetchClosestEvents(
      Person_id,
      endDate
    );
    const closestEventsPrepared = {};
    const closestEvents = {};

    closestEventsNotPrepared.map((e) => {
      let eventDate = new Date(e.Tentative_date);
      eventDate = eventDate.setHours(0, 0, 0);

      const tmp = closestEventsPrepared[eventDate] || [];

      tmp.push(e);

      closestEventsPrepared[eventDate] = tmp;
    });
    
    const keysSorted = Object.keys(closestEventsPrepared).sort(function(a,b){return closestEventsPrepared[a] > closestEventsPrepared[b]})

    keysSorted.map((time) => {
      closestEvents[time] = closestEventsPrepared[time];
    })

    this.setState({ closestEvents });
  };

  componentDidMount = async () => {};

  componentDidUpdate = async (prevProps, prevState) => {
    if (
      prevProps.User !== this.props.User &&
      this.props.User.Person_id &&
      !this.state.isInit
    ) {
      await this.loadClosestEvents();

      this.setState({ isInit: true });
    }
  };

  render() {
    const { closestEvents, isInit } = this.state;

    const eventsDates = Object.keys(closestEvents).sort(function(a,b){return a > b})

    // if (todos.length <= 0) {
    //   return <></>;
    // }

    // const pastTodos = todos.filter(
    //   (x) =>
    //     Date.parse(x.Completion_date) <
    //     new Date(Date.now()).setHours(0, 0, 0, 0)
    // );
    // const actualTodos = todos.filter(
    //   (x) =>
    //     Date.parse(x.Completion_date) >=
    //     new Date(Date.now()).setHours(0, 0, 0, 0)
    // );

    // const UpcomingEvents = (props) => {
    //   return <EventsList {...props} todos={actualTodos} />;
    // };

    // const PastEvents = (props) => {
    //   return <EventsList {...props} todos={pastTodos} isPast={true} />;
    // };

    const cd = ({days, hours, minutes}) => {
      return (
        <span>
        {days}d {hours}h {minutes}m
      </span>
      )

    }
    return (
      <>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="h60 d-flex align-items-center">
                <div className="d-flex align-items-start justify-content-between align-items-center">
                  <h4 className="card-title align-items-center h4">
                    Upcoming events
                  </h4>
                  <div className="d-flex justify-content-between align-items-center">
   
                  </div>
                </div>
              </CardHeader>
              <CardBody className="dhb_act_b">
                {isInit ? (
                  <>
                    {eventsDates.length === 0 && (
                      <>
                        Events List is empty.
                      </>
                    )}
                    {eventsDates.map((date, i) => (
                      <>
                        <div>
                          <h6 className="dashboard-activitys d-flex align-items-center "><span className="mr-1"><i className="ri-calendar-event-line font-size-18"> </i></span> {(new Date(parseInt(date))).toLocaleDateString()}</h6>
                          {closestEvents[date].map((e) => (
                            <NavLink
                              to={combine("SINGLE_EVENT", {
                                Activity_Name: e.Activity_Name,
                              })}
                            >
                              {/* <div className="act_link_Dhb"  style={{ background: `linear-gradient(190deg, ${hexToRgba(e.CaseBg, "0.8")} 0%, rgba(255,255,255,1) 100%)`}}> */}
                              <div className="act_link_Dhb" style={{borderLeft: `3px solid ${e.CaseBg}`}}>

                                <div className="d-flex justify-content-between py-1" >
                                  <h5 style = {{color: e.CaseBg}}>{e.Activity_Title}</h5>
                                  <span className="l_texr">
                                  <span className="mr-1 event_time_dhb" style={{background: 1 == 2 ? hexToRgba(e.CaseBg, "0.3") : e.CaseBg}}><i className="ri-time-line font-size-16"> </i> <span>{e.Tentative_date.split(" ")[1]}</span></span>
                                  </span>
                                </div>
                                <div className="l_texr  py-1">
                                Preparation Start Date: <span className="dhb_ev_date">{(new Date((Date.parse(e.Tentative_date ) - (e.Time_estimate_days * 24 * 60 * 60 * 1000))).toLocaleString()).split(" ")[0]}</span>
                                </div>
                                <div className="d-flex justify-content-between mt-1  py-1">
                                  <div className="l_texr">{e.Activity_type_Title}</div>
                                  <div className="l_texr">Time left:  <span className="dhb_ev_date"><Countdown
                                        date={Date.parse(e.Tentative_date)}
                                        renderer={cd} /></span></div>
                                </div>
                                
                              </div>
                            </NavLink>
                          ))}
                        </div>
                        {/* <hr/> */}
                      </>
                    ))}
                  </>
                ) : (
                  <>  
                    <div className="d-flex justify-content-center">
                    <Spinner/>

                    </div>
                  </>
                )}
                <SimpleBar style={{ maxHeight: "330px" }}>
                  {/* <Switch>
                    {this.props.pathname === "/home" && (
                      <Redirect to="/home/todos/upcoming" />
                    )}
                    <Route
                      exact
                      path="/home/todos/upcoming"
                      render={() => <EventsList todos={actualTodos} />}
                    />

                    <Route
                      exact
                      path="/home/todos/past"
                      render={() => (
                        <EventsList todos={pastTodos} isPast={true} />
                      )}
                    />
                  </Switch> */}
                </SimpleBar>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    User: state.User.data,
  };
};

export default connect(mapStateToProps, null)(EventsLog);
