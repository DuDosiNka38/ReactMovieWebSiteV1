import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import notification from "./../../services/notification";

class DontSaved extends Component {
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
              Opps!
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal">
              It seems you haven't saved your changes, do you want to do it now?
            </ModalBody>
            <ModalFooter>
              <Button
                className="ld-button-success"
                type="submit"
                onClick={this.deleteKeyword}
              >
                Save Changes
              </Button>
              <Button
                className="ld-button-danger"
                type="submit"
                onClick={this.props.hideModal()}
              >
                Discard
              </Button>
            </ModalFooter>
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DontSaved);
