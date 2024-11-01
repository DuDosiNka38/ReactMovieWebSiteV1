import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import notification from '../../services/notification'
import * as PreloaderActions from "../../store/preloader/actions";
import EventsApi from "../../api/EventsApi";


class DeleteActivityRequirementModal extends Component {

  submit = async () => {
    const { onSubmit, hideModal, showModal, type, Preloader } = this.props;

    Preloader.show();

    if(onSubmit && typeof onSubmit === "function"){
      await onSubmit();
    }
    
    hideModal(type);
    Preloader.hide();
  }

  render() {
    const { Description } = this.props;
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
            Add Activity Requirements
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal">
						  Do you want to create Activity Requirements for {Description} ?
            </ModalBody>
            <ModalFooter className="mfooterGT">
              <Button className="ld-button-success" type="submit" onClick={this.submit}>
                Create
              </Button>
              <Button className="ld-button-danger" type="submit" onClick={this.props.hideModal}>
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
    show: () => dispatch(PreloaderActions.showPreloader("DELETE_ACTIVITY_REQUIREMENT")),
    hide: () => dispatch(PreloaderActions.hidePreloader("DELETE_ACTIVITY_REQUIREMENT"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteActivityRequirementModal);
