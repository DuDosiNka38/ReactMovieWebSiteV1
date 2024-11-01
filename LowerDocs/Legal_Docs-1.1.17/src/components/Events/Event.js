import React, { Component } from "react";
import { Col, Card, CardBody, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
class Event extends Component {
  state = {};
  render() {
    return (
      <>
          <NavLink
            className="linkToEvent d-flex flex-column mb-2"
            to={`/app/case-explorer/case/${this.props.CurrentCase}/event/${this.props.EventName}`}
            style={this.props.style}
          >
            {/* /app/case-explorer/case/${this.props.match.params.caseId}/event/${Activity_Name} */}
            
            <div className="d-flex justify-content-between ">
              <div className="event-date">
                <div className="event-month">{new Date(this.props.Tentative_date_human).toLocaleString('en-us', { month: 'short' })}</div>
                <div className="event-day">{new Date(this.props.Tentative_date_human).toLocaleString('en-us', { day: '2-digit' })}</div>
              </div>
              <div className="event-info">
                <span>{this.props.EventTitle}</span>
               
                <ul className="eventMoreInfo">
                  <li className="event-type">{this.props.ActivityTypeTitle}</li>
                  <li className="event_caseInfo">Case: {this.props.CaseInfo}</li>
                  <li>{new Date(this.props.Tentative_date_human).toLocaleString('en-us')}</li>
                  <li><i>Responsible:</i> <b>{this.props.Responsible_Person_Name}</b></li>
                </ul>
                {/* <span>
                  <i className="ri-information-line eventIcon"></i>
                </span> */}
              </div>
              <div className="event-arrow d-flex align-items-center">
              <i class="ri-arrow-right-s-line"></i>
              </div>
            </div>
          </NavLink>
      </>
    );
  }
}

export default Event;
