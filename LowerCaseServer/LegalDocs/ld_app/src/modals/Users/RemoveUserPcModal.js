import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../store/modal/actions";
import ComputersApi from "./../../api/ComputersApi"
import notification from "../../services/notification";
import * as PersonnelActions from "./../../store/personnel/actions";
import * as PreloaderActions from "./../../store/preloader/actions";

class RemoveUserPcModal extends Component {
  state = {};

	deleteComputer = async () => {
    const { Preloader } = this.props;
    Preloader.show();

    const res = await ComputersApi.deleteComputer(this.props.User_id, this.props.Mac_Address);
    if(res) {
      notification.isSuck(`Computer ${ this.props.Computer_id} is successfully deleted`);

      if(typeof this.props.onSuccess === "function"){
        this.props.onSuccess();
      }

      this.props.hideModal(this.props.type)
    }
    else {
      notification.isError(res.error_text)
    }
    Preloader.hide();
	}

  render() {
    const { Computer_id } = this.props;
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
           Delete  <b className="AccentFont">{Computer_id} </b>
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal confirm-modal">
            <h5 className="text-justify h5">
              You definitely want to delete  <b	 className="AccentFont"> {" "}{Computer_id} </b>{" "}
            </h5>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-danger" type="submit" onClick={this.deleteComputer}>Delete</Button>
            <Button className="ld-button-info" type="button" onClick={this.props.hideModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  fetchPersonnel: () => dispatch(PersonnelActions.personnelFetchRequested()),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("DELETE_USER")),
    hide: () => dispatch(PreloaderActions.hidePreloader("DELETE_USER")),
  },
});

export default connect(null, mapDispatchToProps) (RemoveUserPcModal);
