import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";

import notify from "../../services/notification";
import SyncApi from "../../api/SyncApi";

class DeleteSyncShareModal extends Component {
  state = {
  };

  deleteSyncShare = async () => {
    const { Share_to_Person_id } = this.props;
    this.props.removeSyncSharePerson(Share_to_Person_id);
    this.props.hideModal();
  }

  render() {
    const { Share_to_Person_id } = this.props;
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="m">
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Delete Person from Share
          </ModalHeader>
          <ModalBody
            className="w-100 scrollable-modal confirm-modal"
          >
            <h5 className="text-justify h5">Are you sure want to delete {Share_to_Person_id}?</h5>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-success" type="submit" onClick={this.deleteSyncShare}>Submit</Button>
            <Button className="ld-button-danger" type="submit" onClick={this.props.hideModal}>Cancel</Button>
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
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  removeSyncSharePerson: (Share_to_Person_id) => dispatch(SyncActions.removeSyncSharePersonRequested(Share_to_Person_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteSyncShareModal);
