import React, { Component, createRef } from "react";
import { Card, CardBody, Row, Col, Spinner, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../store/modal/actions";
import ReactTooltip from "react-tooltip";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import BootstrapTheme from "@fullcalendar/bootstrap";

import * as FCCore from "@fullcalendar/core";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";
import DaysCountModal from "./modals/DaysCountModal";
import AddEventModal from "./modals/AddEventModal";
// import AddEventFromCalendar from "./AddEventFromCalendar";
import fn from "./services/functions";
import EventsApi from "../../api/EventsApi";
import combine from "../../routes/combine";
class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarWeekends: true,
      event_title: "",
      selectedDay: null,
      fullData: "",
      allDays: null,
      workDays: null,
    };
  }

  calendarComponentRef = createRef();

  handleDateClick = (arg) => {
    // this.setState({ selectedDay: arg.dateStr });
    // this.setState({ fullData: arg.date });
    const today = new Date(Date.now()).setHours(0, 0, 0, 0);

    if (Date.parse(arg.date) >= today) {
      this.props.showModal("ADD_EVENT", {
        selectedDate: arg.dateStr,
        localCalendarType: this.props.localCalendarType,
        Case_NAME: this.props.Case_NAME,
        Case_Full_NAME: this.props.Case_Full_NAME,
        onSuccess: this.props.loadEvents,
      });
    }
  };

  selectionInfo = (info) => {
    const { startStr, endStr } = info;
    const allDays = fn.countDays(startStr, endStr);
    const workDays = fn.countWorkDays(startStr, endStr);

    // this.setState({ allDays: allDays, workDays: workDays });
    if (allDays > 1) {
      this.props.showModal("DAYS_COUNT", { allDays, workDays });
    }
  };

  handleEventPositioned(info) {
    const eventData = info.event._def.extendedProps.event;
    info.el.setAttribute("data-html", true);
    if (eventData !== undefined) {
      info.el.setAttribute(
        "data-tip",
        `
          <table class = "ttHolder">
          <tbody>
          <tr  class="ttInfo"> <td>Event Title:</td> <td>${eventData.Activity_Title}</td></tr>
          <tr  class="ttInfo"> <td>Owner:</td> <td>${eventData.Owner}</td></tr>
          <tr  class="ttInfo"> <td>Time Estimate Days:</td> <td>${eventData.Time_estimate_days}</td></tr>
          </tbody>
         
          </table>
          `
      );
    }
    ReactTooltip.rebuild();
  }


  render() {
    const { EventsData, navTo, isInit } = this.props;
    let calendar = new FCCore.Calendar(this.calendarComponentRef.currentRef, {
      plugins: [dayGridPlugin],
      initialView: "dayGridMonth",
    });


    // let addcontextrBtn = {

    // }

    return (
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                {!isInit ? (
                  <>
                    <div className="d-flex justify-content-center my-2">
                      <Spinner />
                    </div>
                  </>
                ) : (
                  <FullCalendar
                    // defaultView={uSettings.CALENDAR_VIEW}
                    defaultView="dayGridMonth"
                    customButtons={{
                      myCustomButton: {
                        text: "More...",
                        click:  () =>  {
                          this.props.showModal("CALENDAR_MORE_ACTIONS")
                        },
                      },
                    }}
                    header={{
                      left: 'prev,next today myCustomButton',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                  }}
                    plugins={[
                      dayGridPlugin,
                      timeGridPlugin,
                      interactionPlugin,
                      BootstrapTheme,
                      listPlugin,
                    ]}
                    themeSystem="bootstrap"
                    ref={this.calendarComponentRef}
                    dateClick={this.handleDateClick}
                    eventClick={(e) => {
                      const URL = e.event.extendedProps.myUrl;
                      this.props.navTo(URL);
                    }}
                    editable={false}
                    droppable={false}
                    weekNumbers={true}
                    eventLimit={2}
                    dayMaxEvents={10}
                    dayMaxEventRows={10}
                    selectable={true}
                    navLinks={true}
                    weekends={true}
                    events={EventsData}
                    nowIndicator={true}
                    select={this.selectionInfo}
                    fixedWeekCount={10}
                    contentHeight={600}
                    eventPositioned={this.handleEventPositioned}
                    eventTimeFormat={{
                      hour: "numeric",
                      minute: "2-digit",
                      meridiem: "short",
                    }}
                  />
                )}

                <div style={{ clear: "both" }}></div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* <AddEventFromCalendar
          modal={this.state.modal}
          switch_modal={this.switch_modal}
          actualdata={this.state.selectedDay}
          calendarType = {this.props.calendarType}
          currentCase = {this.props.currentCase}
          frombtn={false}
        /> */}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    // settings: state.User.settings,
    userData: state.User.persone,
    modalType: state.Modal.type,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onGlobalLoad: () => dispatch(actions.getGlobalData()),
    addModals: (modals) => dispatch(ModalActions.addModals(modals)),
    showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
