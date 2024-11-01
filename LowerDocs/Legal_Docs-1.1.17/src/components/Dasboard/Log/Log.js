import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,
  CardBody,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Row,
  DropdownMenu,
  // NavLink,
  // Component
} from "reactstrap";
import SimpleBar from "simplebar-react";
import { Link, Route, Switch, BrowserRouter, NavLink, Redirect } from "react-router-dom";
import EventsList from "./EventsList"

class Log extends Component {
  state = {};
  render() {
    const { todos, cases } = this.props;

    if (todos.length <= 0) {
      return <></>;
    }
    
    const pastTodos = todos.filter(
      (x) => Date.parse(x.Completion_date) < new Date(Date.now()).setHours(0, 0, 0, 0)
    );
    const actualTodos = todos.filter(
      (x) => Date.parse(x.Completion_date) >= new Date(Date.now()).setHours(0, 0, 0, 0)
    );

    const UpcomingEvents = (props) => {
      return (<EventsList {...props} todos={actualTodos} />);
    }

    const PastEvents = (props) => {
      return (<EventsList {...props} todos={pastTodos} isPast={true} />);
    }
    return (
      <>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Dropdown
                  className="float-right"
                  isOpen={this.state.menu}
                  toggle={() => this.setState({ menu: !this.state.menu })}
                >
                  <DropdownToggle
                    tag="i"
                    className="darrow-none card-drop"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-dots-vertical"></i>
                  </DropdownToggle>
                  <DropdownMenu right>
                  <NavLink
                        to="/home/todos/upcoming"
                        className="log_link"
                        activeClassName="avtive-link"
                      >
                    <DropdownItem className="btn_log">
                     
                        Upcoming events
                   
                    </DropdownItem>
                    </NavLink>
                    <NavLink 
                        className="log_link"
                        to="/home/todos/past" activeClassName="avtive-link" >
                    <DropdownItem className="btn_log">
                     
                        Past events
                    </DropdownItem>
                    </NavLink>

                  </DropdownMenu>
                </Dropdown>

        <h4 className="card-title mb-4 h4 d-flex align-items-start justify-content-between">Activities   <span className="sstatus">{this.props.pathname === "/home/todos/upcoming" ? "Upcoming" : "Past"}</span></h4>


       <SimpleBar style={{ maxHeight: "330px" }}>
                 
                      <Switch>
                      {/* <Redirect to="/home/todos/upcoming" /> */}
                      {this.props.pathname === "/home" && (
                      <Redirect to="/home/todos/upcoming" />
                    )}
                        <Route
                          exact
                          path="/home/todos/upcoming"
                          render={() => <EventsList todos={actualTodos} />}
                          // component={UpcomingEvents}
                        />

                        <Route
                          exact
                          path="/home/todos/past"
                          render={() => <EventsList todos={pastTodos} isPast={true} />}
                          // component={PastEvents}
                        />
                      </Switch>
               
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
    cases: state.User.caseData.cases,
    events: state.User.localEvents,
    docs: state.User.localDocument,
    calendars: state.User.calendars,
    persone: state.User.persone,
    todos: state.User.todos,
  };
};

export default connect(mapStateToProps, null)(Log);
