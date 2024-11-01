import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../../../store/modal/actions";
import * as CaseActions from "./../../../../store/case/actions";

import notification from "./../../../../services/notification";

class DeleteCalendarsModal extends Component {
  state = {};

  deleteCalendar = () => {
    const res = this.props.deleteCalendar(this.props.Calendar_name);
    if (res) {
      notification.isSuck(
        `Calendar ${this.props.Calendar_name} is successfully deleted`
      );
      this.props.hideModal();
    } else {
      notification.isError(res.error_text);
    }
  };

  render() {
    const { Calendar_name } = this.props;
    return (
      <>
        <Modal
          isOpen={true}
          centered={true}
          className="delete-case-modal"
          size="m"
        >
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Delete <b className="AccentFont">{Calendar_name} </b>
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal confirm-modal">
            <h5 className="text-justify h5">
              You definitely want to delete{" "}
              <b className="AccentFont">{Calendar_name} </b> calendar
            </h5>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button
              className="ld-button-danger"
              type="submit"
              onClick={this.deleteCalendar}
            >
              Delete
            </Button>
            <Button
              className="ld-button-info"
              type="button"
              onClick={this.props.hideModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  deleteCalendar: (Calendar_name) =>
    dispatch(CaseActions.deleteCalendarRequested(Calendar_name)),
});

export default connect(null, mapDispatchToProps)(DeleteCalendarsModal);
