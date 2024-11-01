import React, { Component } from 'react';
import {Modal, ModalHeader, ModalBody, Button} from "reactstrap"

class MoreCalendarActions extends Component {
  render() { 
    return <>
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
           Info <b	 className="AccentFont"></b>
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal confirm-modal">
            <div className="d-flex">
                <Button> Calc Days </Button>
            </div>
          </ModalBody>
          {/* <ModalFooter className= "mfooterGT">
            <Button className="ld-button-danger" type="submit" onClick={this.deleteUser}>Delete</Button>
            <Button className="ld-button-info" type="button" onClick={this.props.hideModal}>Cancel</Button>
          </ModalFooter> */}
        </Modal>
      </>
      

  }
}
 
export default MoreCalendarActions;