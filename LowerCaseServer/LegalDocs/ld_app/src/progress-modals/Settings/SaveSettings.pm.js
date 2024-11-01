import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { connect } from "react-redux";
import * as ProgressModalActions from "../../store/progress-modal/actions";
import notification from './../../services/notification'

import ProgressModal from "./../../components/ProgressModal/ProgressModal"


class SaveSettings extends Component {

  render() {
    const { step } = this.props;
    return (
      <>
        <>
          <ProgressModal>
            {step === "IN_PROCESS" && (
              <>
                <Spinner size="s" className="mr-2"/> Save Settings
              </>
            )}
            {step === "SUCCESS" && (
              <>
                <i className="ri-check-line mr-2" style={{fontSize:"20px"}}></i> Data Successfully Saved
              </>
            )}
            
          </ProgressModal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ProgressModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveSettings);
