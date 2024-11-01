import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import DocsApi from "./../../api/DocsApi"
import notification from './../../services/notification'
import * as PreloaderActions from "../../store/preloader/actions";


class DeleteDocumentModal extends Component {



  deleteDoc = async () => {
    const { Preloader } = this.props;
    Preloader.show();
    const res = await DocsApi.deleteDocument(this.props.DOC_ID);
    if (!res.result) {
      notification.isError(res.data.error_message);
      Preloader.hide();
      return false;
    }
    if(this.props.onSuccess){
      this.props.onSuccess();
    }
    notification.isSuck("Document successfully deleted!");
    this.props.hideModal();
    Preloader.hide();
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
            Delete Document
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal">
            You definitely want to delete the document?
            </ModalBody>
            <ModalFooter className= "mfooterGT">
              <Button
                className="ld-button-success"
                type="submit"
                onClick={this.deleteDoc}
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
    show: () => dispatch(PreloaderActions.showPreloader("DEL_DOC")),
    hide: () => dispatch(PreloaderActions.hidePreloader("DEL_DOC"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDocumentModal);
