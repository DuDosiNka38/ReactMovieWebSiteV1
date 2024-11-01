import React, { Component } from "react";
import {
  Label,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Col,
} from "reactstrap";
import ConfigDepartment from "../../components/ConfigDepartment/ConfigDepartment";
import { toggleRightSidebar } from "../../store/actions";

class AddNewDepartment extends Component {
  
  state = {
    modal: false,
  };
  switch_modal = this.switch_modal.bind(this);
  switch_modal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
   
  }
  render() {
    return (
      <>
        <FormGroup row>
          <Label className="col col-form-label">&nbsp;</Label>
          <Col md={12}>
            <Button
              type="button"
              color="info"
              className="waves-effect btn btn-light custom-plus w-100"
              onClick={this.switch_modal}
            >
              Add new
            </Button>
          </Col>
        </FormGroup>

        <Modal
          isOpen={this.state.modal}
          centered={true}
        >
          <ModalHeader
            toggle={() => (this.setState({ modal: false }))}
            className="text-center"
          >
           Add new department
          </ModalHeader>
          <ModalBody >
             <ConfigDepartment  />
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default AddNewDepartment;
