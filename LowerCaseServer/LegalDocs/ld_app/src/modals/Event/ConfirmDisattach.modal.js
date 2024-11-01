import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import DocsApi from "./../../api/DocsApi"
import notification from './../../services/notification'
import * as PreloaderActions from "../../store/preloader/actions";


class ConfirmDisattachModal extends Component {

  submit = () => {
    const { onSubmit } = this.props;

    if(onSubmit && typeof onSubmit === "function"){
      onSubmit();
    }

    this.props.hideModal(this.props.type);
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
            Confirm Disattach Document
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal">
              You definitely want to disattach document from event?
            </ModalBody>
            <ModalFooter className= "mfooterGT">
              <Button
                className="ld-button-success"
                type="submit"
                onClick={this.submit}
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
    show: () => dispatch(PreloaderActions.showPreloader("CONFIRM_DISATTACH")),
    hide: () => dispatch(PreloaderActions.hidePreloader("CONFIRM_DISATTACH"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDisattachModal);
