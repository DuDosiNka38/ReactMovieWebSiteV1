import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import notification from '../../services/notification'
import * as PreloaderActions from "../../store/preloader/actions";


class DeleteActivityRequirementModal extends Component {

  submit = async () => {
    const { onSubmit, hideModal, type, Preloader } = this.props;

    Preloader.show();

    if(onSubmit && typeof onSubmit === "function"){
      await onSubmit();
    }

    hideModal(type);
    Preloader.hide();
  }

  render() {
    const { data } = this.props;

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
            Delete Activity Requirement
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal">
						  Are you sure what you want delete ?
            </ModalBody>
            <ModalFooter className="mfooterGTO">
              <Button className="ld-button-danger" type="submit" onClick={this.submit}>
                Delete
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
