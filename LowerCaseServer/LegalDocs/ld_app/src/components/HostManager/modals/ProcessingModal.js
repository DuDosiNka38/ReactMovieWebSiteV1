import React, { Component } from "react";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
} from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from './../../../store/modal/actions';

class ProcessingModal extends Component {
  state = {};

  render() {
    return (
      <>
        <Modal
              isOpen={true}
              centered={true}
              size="s"
              style={{ width: "200px" }}
            >
              <ModalHeader
                className="text-center d-flex align-items-center justify-content-center"
                charCode=""
              >
                Processing
              </ModalHeader>
              <ModalBody className="text-center w-100">
                <div className="lds-default">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
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
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProcessingModal);
