import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";

class TimeLog extends Component {
  render() {
    return (
      <>
        <div className="time-log-block">
          <div className="time-log-timer d-flex align-items-center">
            <i className="ri-timer-line"></i> 
            <div>0:00:45</div>
          </div>
          <div className="time-log-controls">
            <i className="ri-stop-fill"></i>
            <i className="ri-pause-mini-line"></i>
            <i className="ri-play-mini-fill"></i>
          </div>
        </div>
        <Button className="time-log-new-timer d-flex align-items-center" onClick={() => this.props.showModal("START_TIMER")}>
          <i className="ri-play-mini-fill mr-2"></i> Start Timer
        </Button>
        <Button className="time-log-new-timer d-flex align-items-center" onClick={() => this.props.showModal("START_TIMER")}>
        <i className="ri-timer-line mr-2"></i> 0:00:45
        </Button>
        <Button className="time-log-new-timer d-flex align-items-center" onClick={() => this.props.showModal("START_TIMER")}>
        <i className="ri-play-mini-fill mr-2"></i> Continue

        </Button>
        <Button className="time-log-new-timer d-flex align-items-center" onClick={() => this.props.showModal("START_TIMER")}>
        <i className="ri-pause-mini-fill mr-2"></i> Pause

        </Button>
        
        <Button className="time-log-new-timer d-flex align-items-center" onClick={() => this.props.showModal("START_TIMER")}>
        <i className="ri-stop-fill mr-2"></i> 
          <span className="time-log-button-text">Stop</span>

        </Button>
    
        
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeLog);