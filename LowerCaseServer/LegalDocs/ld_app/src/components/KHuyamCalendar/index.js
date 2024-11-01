import React, { Component } from "react";
import KHuyamMonth from "./KHuyamMonth";
import KHuyamYear from "./KHuyamYear";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import "./scss/index.scss";
import moment from "moment";
import KHuyamDayEvents from "./KHuyamDayEvents";
import EventBlock from "../Events/EventBlock";
import KHuyamSettings from "./KHuyamSettings";
import KHuyamSettingsYear from "./KHuyamSettingsYear";
import KHuyamSettingsMonth from "./KHuyamSettingsMonth";

const _Views = [
  {
    name: "year",
    component: KHuyamYear,
    settingsComponent:KHuyamSettingsYear, 
    default: true,
    properties: {
      renderOpts:{
        monthsBefore: 4,
        monthsAfter: 4,
      },
    }
  },
  {
    name: "month",
    component: KHuyamMonth,
    settingsComponent:KHuyamSettingsMonth, 
  }
]

class KHuyamCalendar extends Component {
  state = {
    _dayEvents: [],
    _rangeStart: null,
    _rangeEnd: null,
    _selectedDate: null,
    _currentDate: null,
    _calendarView: null
  };

  setDateEvents = (date = new Date()) => {
    const { events } = this.props;

    const filteredEvents = events?.filter(
      (event) => moment(event.date).format("L") === moment(date).format("L")
    );
    this.setState({ _dayEvents: filteredEvents });
  };

  onSelectedDateChange = (date, dateMoment) => {
    this.setState({ _selectedDate: date });
    this.setDateEvents(date);
  };

  onMonthNameClick = (monthStartDate, monthStartDateMoment) => {
    this.switchCalendarView("month", {monthDate: monthStartDate});
  };

  onRangeSelection = (_rangeStart, _rangeEnd) => {
    this.setState({ _rangeStart, _rangeEnd });
  };

  onRangeSelectionStart = (_rangeStart) => {
    this.setState({ _rangeStart });
  };

  onRangeSelectionEnd = (_rangeStart, _rangeEnd) => {
    console.log({ _rangeStart, _rangeEnd });
    this.setState({ _rangeStart, _rangeEnd });
  };

  setCurrentDate = (date, dateMoment) => {};


  switchCalendarView = (setViewName, props ={}) => {
    const setView = _Views.find((v) => v.name === setViewName) || _Views.find((v) => v.default);
    this.setState({
      _calendarView: {...setView, properties: setView.properties ? {...setView.properties, ...props} : props}
    });

    if(setViewName === "month") console.log({props})
  }

  onSettingsChange = (_calendarView) => {
    this.setState({_calendarView});
  }

  componentDidMount() {
    this.setState({ _currentDate: moment() });
    this.switchCalendarView();
  }

  render() {
    const { _dayEvents, _calendarView } = this.state;
    const { events } = this.props;

    if(!_calendarView) return null;

    const CalendarViewComponent = _calendarView.component;
    const CalendarViewProps = _calendarView.properties;

    return (
      <>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody className="d-flex align-items-center justify-content-between">
                <KHuyamSettings calendarView={_calendarView} onChange={this.onSettingsChange}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={8} className="calendarViewType">
            <Card>
              <CardBody>
                <CalendarViewComponent
                  events={events}
                  switchCalendarView = {this.switchCalendarView}
                  onSelectedDateChange={this.onSelectedDateChange}
                  onMonthNameClick={this.onMonthNameClick}
                  onDateRangeChange={this.onDateRangeChange}

                  {...CalendarViewProps}
                />                
              </CardBody>
            </Card>
          </Col>
          <Col lg={4} className="cutHeight">
            <KHuyamDayEvents
              calendarProps={this.state}
              dayEvents={_dayEvents}
              EventBlockComponent={EventBlock}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default KHuyamCalendar;
