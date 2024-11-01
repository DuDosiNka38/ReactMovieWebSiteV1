import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup } from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import axios from "./../../services/axios";
import noteWindow from "../../services/notifications";

class CloseCase extends Component {
  state = {};

  closeCase = this.closeCase.bind(this);

  closeCase(){
    const result = axios.post('/api/case/close', {
        Case_Short_NAME: this.props.caseId
      })
      .then((response) => {
        if (response.data.result) {
          noteWindow.isSuck("Case successfully closed!")
          return true;
        } else {
          noteWindow.isError(response.data.result_data.result_error_text);
          return false;
        }
      })
      .catch((response) => {
        noteWindow.isError(response);
        return false;
      });
      
      
     if (result) {
      this.props.onGlobalLoad();
      this.props.switch_modal()
     }
  }

  render() {
    return (
      <>
        <Modal
          size="s"
          isOpen={this.props.modal}
          switch={this.props.switch_modal}
          centered={true}
        >
          <ModalHeader toggle={this.props.switch_modal} className="text-center">
            Are you sure?
          </ModalHeader>

          <ModalBody>
          
        <div className="d-flex justify-content-end align-items-center">
        <Button color="danger" className="ml-3 d-flex align-items-center" onClick={this.props.switch_modal}>
              Decline
            </Button>
            <Button color="success" className="ml-3 d-flex align-items-center" onClick={this.closeCase}>
              Accept
            </Button>
        </div>
           
          </ModalBody>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    personeData: state.User.persone,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseCase);
