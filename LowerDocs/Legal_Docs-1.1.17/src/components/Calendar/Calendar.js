import React, { Component } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import ReactTooltip from "react-tooltip";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
// import listPlugin from '@fullcalendar/list';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
// import yearGridPlugin from "@f"
import listPlugin from "@fullcalendar/list";
import BootstrapTheme from "@fullcalendar/bootstrap";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";
import AddEventFromCalendar from "./AddEventFromCalendar";
import fn from "./../../services/functions"
class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sw_alert: false,
      calendarWeekends: true,
      event_title: "",
      selectedDay: null,
      modal: false,
      fullData: "",
      ttmodal: false,
      allDays: null,
      workDays: null
    };
 
    this.switch_modal = this.switch_modal.bind(this);
    this.switch_ttmodal = this.switch_ttmodal.bind(this);
  }

  switch_modal() {
    this.setState({ modal: !this.state.modal });
  }

  switch_ttmodal() {
    this.setState({ ttmodal: !this.state.ttmodal });
  }


  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };
  handleDateClick = (arg) => {
    this.setState({ selectedDay: arg.dateStr });
    this.setState({ fullData: arg.date });
    const today = new Date(Date.now()).setHours(0, 0, 0, 0);

    if (Date.parse(this.state.fullData) >= today) {
      this.switch_modal();
    }
  };


  handleEventPositioned(info) {
    const eventData = info.event._def.extendedProps.event;
    info.el.setAttribute("data-html", true);
    if (eventData !== undefined) {
      info.el.setAttribute(
        "data-tip",
        `
          <div class = "ttHolder">
          <div  class="ttInfo"> Event Title: ${eventData.Activity_Title}</div>
          <div  class="ttInfo"> Activity Type: ${eventData.Activity_type}</div>
          <div  class="ttInfo"> Comments: ${eventData.Comments}</div>
          <div  class="ttInfo"> Owner: ${eventData.Owner}</div>
          <div  class="ttInfo"> Parent Activity Name: ${eventData.Parent_Activity_Name}</div>
          <div  class="ttInfo">Parent Activity Type: ${eventData.Parent_Activity_type}</div>
          <div  class="ttInfo"> Time Estimate Days: ${eventData.Time_estimate_days}</div>
          </div>
          `
      );
    }
    ReactTooltip.rebuild();
  }

  selectionInfo = (info) => {
    const { startStr, endStr } = info;
    const allDays = fn.countDays(startStr, endStr);
    const workDays = fn.countWorkDays(startStr, endStr);

    this.setState({allDays: allDays, workDays: workDays}) 
    if (allDays > 1 ) {
      this.switch_ttmodal()
    }
  };

  render() {
    const { settings, personeData } = this.props;
    const {calendarType} = this.props;

    

    if (
      !settings.hasOwnProperty("USER") ||
      !personeData.hasOwnProperty("Person_id")
    )
      return <></>;

    const uSettings = settings.USER[personeData.Person_id];

    return (
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                <FullCalendar
                  defaultView={uSettings.CALENDAR_VIEW}
                  header={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek,",
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
                  editable={false}
                  droppable={false}
                  weekNumbers={true}
                  eventLimit={2}
                  dayMaxEvents={10}
                  dayMaxEventRows={10}
                  selectable={true}
                  navLinks={true}
                  weekends={true}
                  events={this.props.calendarEvents}
                  nowIndicator={true}
                  select={this.selectionInfo}
                  contentHeight={600}
                  eventPositioned={this.handleEventPositioned}
                  eventTimeFormat={{
                    // hour: '2-digit',
                    // minute: '2-digit',
                    // meridiem: false,
                    hour: "numeric",
                    minute: "2-digit",
                    meridiem: "short",
                  }}
                />

                <div style={{ clear: "both" }}></div>
              </CardBody>
            </Card>
          </Col>
          
        </Row>
        <AddEventFromCalendar
          modal={this.state.modal}
          switch_modal={this.switch_modal}
          actualdata={this.state.selectedDay}
          calendarType = {this.props.calendarType}
          currentCase = {this.props.currentCase}
          frombtn={false}
        />

        <Modal
          size="md"
          isOpen={this.state.ttmodal}
          switch={this.switch_ttmodal}
          centered={true}
        >
          <ModalHeader toggle={this.switch_ttmodal} className="text-center">
              Selected Days
          </ModalHeader>

          <ModalBody toggle={this.switch_ttmodal}>
           <div className="daysSelected"> Selected All Days: <span className="selectedDaysCount">{this.state.allDays}</span></div>
           <div className="daysSelected"> Selected Business Days: <span className="selectedDaysCount">{this.state.workDays}</span></div>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    settings: state.User.settings,
    personeData: state.User.persone,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
