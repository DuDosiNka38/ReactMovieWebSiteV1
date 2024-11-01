import moment from "moment";
import React, { Component } from "react";
import { Card, CardBody, Button, Alert } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../store/modal/actions";

class KHuyamDayEvents extends Component {
  state = {
    _rangeStart: null,
    _rangeEnd: null,
    _selectedDate: null,
    _currentDate: null,
  };

  componentDidMount() {
    const calendarProps = this.props.calendarProps || {};
    this.setState({ ...calendarProps });

    // document.body.onmousedown = this.onRightMouseClick;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.calendarProps !== prevProps.calendarProps) {
      const calendarProps = this.props.calendarProps || {};
      this.setState({ ...calendarProps });
    }
  }

  onRightMouseClick = (e) => {
    if(e.which != 3) return;

      console.log("Right")
  }

  render() {
    const { _rangeStart, _rangeEnd, _selectedDate, _currentDate } = this.state;
    const { dayEvents, EventBlockComponent, showModal } = this.props;

    return (
      <>
        <Card className="calendarSideBar">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center sidebarHeader">
              <div className="selectedDate">
                {moment(_selectedDate).format("LL")}
              </div>
              <Button
                type="button"
                color="primary"
                onClick={() =>
                  showModal("ADD_EVENT", {
                    selectedDate: _selectedDate,
                    // Case_NAME: CaseData.Case_Short_NAME,
                    // Case_Full_NAME: CaseData.Case_Full_NAME,
                  })
                }
              >
                Add Event
              </Button>
            </div>
            <div className="overflow-y-auto eventsList">
              {!dayEvents?.length && (
                <>
                  <Alert color="info">Events list for {moment(_selectedDate).format("LL")} is empty.</Alert>
                </>
              )}
              {dayEvents.map((event) => (
                <>
                  <div className="eventWrapper" onClick={this.onRightMouseClick}>
                    <EventBlockComponent {...event?.eventBlockProps}/>
                  </div>
                </>
              ))}
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    // settings: state.User.settings,
    modalType: state.Modal.type,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addModals: (modals) => dispatch(ModalActions.addModals(modals)),
    showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KHuyamDayEvents);
