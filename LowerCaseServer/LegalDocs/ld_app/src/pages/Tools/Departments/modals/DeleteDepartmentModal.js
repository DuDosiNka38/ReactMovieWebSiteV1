import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../../../store/modal/actions";
import * as CaseActions from "./../../../../store/case/actions";

import notification from "./../../../../services/notification";

class DeleteDepartmentModal extends Component {
  state = {};

	deleteDepartment = () => {
    const res = this.props.deleteDepartment(this.props.Department_id);
    if(res) {
      notification.isSuck(`Department ${ this.props.Department_id} is successfully deleted`)
      this.props.hideModal()
    }
    else {
      notification.isError(res.error_text)
    }
	}

  render() {
    const { Department_id, Department_Name } = this.props;
    
    return (
      <>
        <Modal
          isOpen={true}
          centered={true}
          className="delete-case-modal"
          size="m"
        >
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
           Delete <b	 className="AccentFont">{Department_Name} </b>
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal confirm-modal">
            <h5 className="text-justify h5">
              You definitely want to delete <b	 className="AccentFont">{Department_Name} </b>{" "} department
            </h5>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-danger" type="submit" onClick={this.deleteDepartment}>Delete</Button>
            <Button className="ld-button-info" type="button" onClick={this.props.hideModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  deleteDepartment: (Department_id) => dispatch(CaseActions.deleteDepartmentRequested(Department_id)),
	
});

export default connect(null, mapDispatchToProps) (DeleteDepartmentModal);
