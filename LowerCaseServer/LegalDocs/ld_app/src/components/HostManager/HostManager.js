import React, { Component } from "react";
import { Button } from "reactstrap";
import { ipcRenderer } from "electron";
import Select, { components } from "react-select";
import axios from "./../../services/axios";
import { connect } from "react-redux";
import * as ModalActions from './../../store/modal/actions';
import AuthService from "../../services/AuthService";
import ModalService from "../../services/ModalService";

import noteWindow from "./../../services/notification";
import AddHostModal from "./modals/AddHostModal";
import ProcessingModal from "./modals/ProcessingModal";

import "./style.scss";
import HostsSettingsModal from "./modals/HostsSettingsModal";
import EditHostModal from "./modals/EditHostModal";

class HostManager extends Component {
  state = {
    Hosts: [],
  };

  constructor(props) {
    super(props);

    this.isSidebar = this.props.isSidebar ?? false;
  }

  onHostChange = (e, el) => {
    const { name } = el;

    if (name === "host") {
      const host = e.value;

      this.props.showModal("PROCESSING");
      const result = ipcRenderer.sendSync("onToggleActiveHost", { _id: host });
      // AuthService.removeAuthHash();
      // ipcRenderer.sendSync("reloadWindow");
      this.props.hideModal("PROCESSING");
    }
  };

  setHostsList = () => {
    this.setState({ Hosts: ipcRenderer.sendSync("onGetHosts") });
  };

  getHostsList = () => {
    const { Hosts } = this.state;

    return Hosts.map((host) => ({
      value: host._id,
      label: this.isSidebar ? host.alias : `${host.alias} [${host.host}]`,
      active: host.active,
    }));
  };

  getSelectStyles = () => {
    return this.isSidebar
      ? {
          control: (base, state) => ({
            ...base,
            backgroundColor: "rgba(0,0,0,0)",
            color: "#fff",
          }),

          singleValue: (base, state) => ({
            ...base,
            color: "#fff",
          }),

          option: (base, state) => ({
            ...base,
            color: "#333",
          }),
        }
      : {
          option: (base, state) => ({
            ...base,
            color: "#333",
          }),
          menu: (base, state) => ({
            ...base,
            zIndex: "999"
          })
        };
  };

  componentDidMount() {
    this.setHostsList();

    this.props.addModals([
      {
        type: 'ADD_HOST',
        component: AddHostModal
      },
      {
        type: 'HOSTS_SETTINGS',
        component: HostsSettingsModal
      },
      {
        type: 'EDIT_HOST',
        component: EditHostModal
      },
      {
        type: 'PROCESSING',
        component: ProcessingModal
      },
    ]);

    ipcRenderer.addListener('onHostsChange', this.setHostsList);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('onHostsChange', this.setHostsList);
  }

  render() {
    const showModal = type => this.props.showModal(type);

    const NoOptionsMessage = props => {
      return (
        <components.NoOptionsMessage {...props}>
          <span>Hosts list is unset. <a href="#" onClick={() => showModal("ADD_HOST")}>Add new</a> host for begin!</span>
        </components.NoOptionsMessage>
      );
    };

    return (
      <>
        <div className={`host-manager ${this.isSidebar ? "d-flex sidebar" : ""}`} >
          {!this.isSidebar && (
            <>
              <div>Choose server:</div>
            </>
          )}

          <div
            className={
              !this.isSidebar
                ? "d-flex align-items-center justify-content-center"
                : "w-100"
            }
          >
            <Select
              name="host"
              options={this.getHostsList()}
              value={this.getHostsList().find((o) => o.active)}
              className="w-100 hm-select"
              onChange={this.onHostChange}
              styles={this.getSelectStyles()}
              components={{ NoOptionsMessage }}
            />
            
            <div className={`d-flex ${this.isSidebar ? "mt-2" : ""}`}>
              {this.isSidebar ? (
                <>
                  <Button
                    className="customBtn add"
                    onClick={() => showModal("ADD_HOST")}
                  >
                    <i className="ri-add-line"></i> Add new host
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="ml-1 customBtn add"
                    onClick={() => showModal("ADD_HOST")}
                  >
                    <i className="ri-add-line"></i>
                  </Button>
                </>
              )}
              <Button
                className="ml-1 customBtn"
                onClick={() => showModal("HOSTS_SETTINGS")}
              >
                <i className="ri-settings-5-line"></i>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  modalType: state.Modal.type,
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HostManager);
