import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import Select from "react-select";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";

import notify from "../../services/notification";
import SyncApi from "../../api/SyncApi";

class AssignCaseToItemsModal extends Component {
  state = {
  };

  handleSelectChange = async (val) => {
    const { value } = val;
    const { onSuccess, hideModal, type } = this.props;

    if(typeof onSuccess === "function"){
      onSuccess(value);
    }

    hideModal(type);
  };

  render() {
    const { Cases_opt } = this.props;
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="m">
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Assign To Case
          </ModalHeader>
          <ModalBody
            className="w-100"
          >
            <Select
              name="Case_NAME"
              options={Cases_opt}
              closeMenuOnSelect={true}
              onChange={(val) => this.handleSelectChange(val)}
              className="w-100"
            />
          </ModalBody>
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

export default connect(mapStateToProps, mapDispatchToProps)(AssignCaseToItemsModal);
