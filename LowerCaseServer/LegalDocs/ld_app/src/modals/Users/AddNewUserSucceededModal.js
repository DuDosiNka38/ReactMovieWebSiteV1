import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";

import * as ModalActions from "./../../store/modal/actions";

class AddNewUserSucceededModal extends Component {
  state = {
  };

  render() {
    const { userData } = this.props;
    const {NAME} = userData;
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="m">
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
          Registration Successfully Done 
          </ModalHeader>
          <ModalBody
            className="w-100 scrollable-modal confirm-modal"
          >
            <h5 className="text-justify h5">Would you like assign <i>{NAME}</i> to cases? </h5>
            <span> You can do this later on User Settings tab. </span>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-success" type="submit" onClick={() => { this.props.hideModal(this.props.type); this.props.showModal("PIN_USER_TO_CASE", {userData})}}>Assign</Button>
            <Button className="ld-button-danger" type="submit" onClick={this.props.hideModal}>Later</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNewUserSucceededModal);
