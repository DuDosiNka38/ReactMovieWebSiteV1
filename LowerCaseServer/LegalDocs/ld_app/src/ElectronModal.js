import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Modals from "./services/ModalsConnection";
import ModalService from "./services/ModalService";
import * as ModalActions from "./store/modal/actions";
import { connect } from "react-redux";

class ElectronModal extends Component {
  componentDidMount() { 
    Modals();
  }

  render() {
    
    const { route } = this.props;
    return (
      <>
      {ModalService.renderModal(this.props.history)}
        <div style={{ position: "relative" }}>
          <BrowserRouter>
            <Switch>
              <Route exact {...route} />
            </Switch>
          </BrowserRouter>
        </div>
      </>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(ElectronModal);
