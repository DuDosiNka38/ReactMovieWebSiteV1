import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";

class SyncErrorModal extends Component {
  state = {
  };

  componentDidMount() {
  }

  render() {
    const { content } = this.props;
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="lg" >
          <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
            <div className="d-flex align-items-center">
              <i className="ri-error-warning-line mr-2"></i> Warning
            </div>
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal">
            {content}
          </ModalBody>
          <ModalFooter className= "mfooterGTO">
            <Button className="ld-button-success" type="submit" onClick={this.props.hideModal}>
              Ok, i understand
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  AuthHash: state.Main.auth_hash,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  removeSyncSharePerson: (Share_to_Person_id) =>
    dispatch(SyncActions.removeSyncSharePersonRequested(Share_to_Person_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncErrorModal);
