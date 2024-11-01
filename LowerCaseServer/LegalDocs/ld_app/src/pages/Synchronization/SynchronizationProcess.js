import React, { Component } from 'react'
import SynchronizationModal from '../../modals/Sync/SynchronizationModal'
import ManualSyncModal from '../../modals/Sync/ManualSyncModal'
import Modals from "./../../services/ModalsConnection";
import { connect } from "react-redux";
import * as ModalActions from "./../../store/modal/actions";
     
class SynchronizationProcess extends Component {

  componentDidMount() {
    Modals();
    this.props.showModal("SYNCHRONIZATION");
  }
  
  render() {
    return (
      <>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  displayed: state.Modal.displayed,
  minimized: state.Modal.minimized,
  sysInfo: state.Main.system,
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SynchronizationProcess);
