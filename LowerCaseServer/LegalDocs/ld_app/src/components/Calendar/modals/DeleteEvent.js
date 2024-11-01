import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../../store/modal/actions";
import EventApi from "./../../../api/EventsApi"
import notification from './../../../services/notification'
import * as PreloaderActions from "./../../../store/preloader/actions";
import combine from "../../../routes/combine";


class DeleteEvent extends Component {



  deleteEvent = async () => {
    const { Preloader, navTo } = this.props;
    Preloader.show();
    const res = await EventApi.deleteEvent(this.props.Activity_Name);
    if (!res.result) {
      notification.isError(res.data.error_message);
      Preloader.hide();
      return false;
    }

    if(this.props.onSuccededDelete){
      this.props.onSuccededDelete();
    }
    notification.isSuck("Event successfully deleted");
    this.props.hideModal();
    navTo(combine("ALL_EVENTS"))
    Preloader.hide();
  }

  componentDidMount() {
  }

  render() {

    return (
      <>
        <>
          <Modal
            isOpen={true}
            centered={true}
            className="delete-case-modal"
            size="xs"
          >
            <ModalHeader
              className="d-flex align-items-center justify-content-center"
              toggle={this.props.hideModal}
            >
            Delete Event
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal">
            You definitely want to delete the event?
            </ModalBody>
            <ModalFooter className= "mfooterGT">
              <Button
                className="ld-button-success"
                type="submit"
                onClick={this.deleteEvent}
              >
                Confirm
              </Button>
              <Button
                className="ld-button-danger"
                type="submit"
                onClick={this.props.hideModal}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("DELETE_EVENT")),
    hide: () => dispatch(PreloaderActions.hidePreloader("DELETE_EVENT"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteEvent);
